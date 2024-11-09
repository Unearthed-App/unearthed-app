export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "auto";

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
});
import PostHogClient from "@/app/posthog";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
import { z } from "zod";
import { profiles, selectProfileSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";

type ProfileSelect = z.infer<typeof selectProfileSchema>;

export async function POST(req: NextRequest) {
  const posthogClient = PostHogClient();

  const headersList = headers();
  const sig = headersList.get("stripe-signature");

  if (!sig || !endpointSecret) {
    console.error("Missing signature or webhook secret");
    return NextResponse.json(
      { message: "No signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const payload = await req.text();
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ message: "Webhook error" }, { status: 400 });
  }

  posthogClient.capture({
    distinctId: `"stripe webhook START"`,
    event: `${event.type}`,
  });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status === "paid") {
          const customerEmail = session.customer_details?.email;
          const userId = session.metadata?.userId;

          if (!customerEmail) {
            throw new Error("No customer email found in session");
          }
          if (!userId) {
            throw new Error("No userId found in session metadata");
          }

          console.log(`Processing completed checkout for user ${userId}`);
          const clerkUser = await clerkClient().users.getUser(userId);

          posthogClient.capture({
            distinctId: userId,
            event: `${event.type}`,
          });

          try {
            if (clerkUser) {
              await clerkClient().users.updateUserMetadata(userId!, {
                privateMetadata: {
                  isPremium: true,
                },
              });
            }

            let profile: ProfileSelect;

            const toSet = {
              userId,
              stripeSubscriptionId: session.subscription as string,
              stripePriceId: session.metadata!.priceId as string,
              stripeCustomerId: session.customer as string,
              stripeCreatedTimestamp: session.created as number,
              stripeExpireTimestamp: session.expires_at as number,
              expiredAt: null,
              lastWebhookError: null,
            };

            await db.transaction(async (tx) => {
              // First try to update existing profile
              const result = await tx
                .update(profiles)
                .set(toSet)
                .where(eq(profiles.userId, userId))
                .returning();

              if (result.length > 0) {
                profile = result[0];
                console.log(`Updated existing profile for user ${userId}`);
              } else {
                // If no existing profile, create new one
                const resultNew = await tx
                  .insert(profiles)
                  .values(toSet)
                  .onConflictDoNothing()
                  .returning();

                if (resultNew.length > 0) {
                  profile = resultNew[0];
                  console.log(`Created new profile for user ${userId}`);
                } else {
                  throw new Error(
                    `Failed to create or update profile for user ${userId}`
                  );
                }
              }
            });
          } catch (error) {
            console.error("Database operation failed:", error);

            posthogClient.capture({
              distinctId: userId,
              event: `stripe ERROR`,
              properties: {
                message:
                  error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
              },
            });
            return new Response("Database operation failed", { status: 500 });
          }
        }
        break;
      }

      case "customer.subscription.deleted":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(
          `Processing subscription ${subscription.id} update/deletion. Sub status: ${subscription.status}`
        );

        const profileResult = await db
          .select()
          .from(profiles)
          .where(eq(profiles.stripeSubscriptionId, subscription.id))
          .limit(1);

        if (!profileResult || profileResult.length === 0) {
          // Log the error but don't throw
          console.error(
            `No profile found for subscription ${subscription.id}. Creating error log.`
          );

          posthogClient.capture({
            distinctId: subscription.id,
            event: "Stripe updated with no unearthed profile",
            properties: {
              subscriptionId: subscription.id,
              subscriptionStatus: subscription.status,
              customerId: subscription.customer as string,
            },
          });

          try {
            const customer = await stripe.customers.retrieve(
              subscription.customer as string
            );
            console.log(
              `Customer information for missing profile - ID: ${customer.id}`
            );
          } catch (e) {
            console.error("Could not fetch customer information:", e);
          }

          return NextResponse.json(
            {
              message: "Profile not found for subscription",
              subscriptionId: subscription.id,
              status: subscription.status,
            },
            { status: 404 }
          );
        }

        const userId = profileResult[0].userId;

        posthogClient.capture({
          distinctId: userId,
          event: `${event.type}`,
        });

        if (
          subscription.status === "unpaid" ||
          subscription.status === "incomplete_expired"
        ) {
          try {
            const clerkUser = await clerkClient().users.getUser(userId);

            if (clerkUser) {
              await clerkClient().users.updateUserMetadata(userId, {
                privateMetadata: {
                  isPremium: false,
                },
              });
            }

            await db
              .update(profiles)
              .set({
                expiredAt: new Date(),
                lastWebhookError: null, // Clear any previous errors
              })
              .where(eq(profiles.userId, userId));
          } catch (error) {
            console.error("Error updating cancelled subscription:", error);
            posthogClient.capture({
              distinctId: userId,
              event: `stripe subscription cancellation ERROR`,
              properties: {
                message:
                  error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
              },
            });
            throw error;
          }
        } else if (subscription.status === "active") {
          const isPremium =
            new Date(subscription.current_period_end * 1000) > new Date();
          let clerkUserGone = false;

          try {
            await clerkClient().users.updateUserMetadata(userId, {
              privateMetadata: {
                isPremium,
              },
            });
          } catch (error) {
            console.log("Clerk user has already been deleted");
            clerkUserGone = true;
          }

          try {
            await db
              .update(profiles)
              .set({
                stripePriceId: subscription.items.data[0]?.price.id,
                stripeExpireTimestamp: subscription.current_period_end,
                expiredAt: !isPremium || clerkUserGone ? new Date() : null,
                lastWebhookError: null, // Clear any previous errors
              })
              .where(eq(profiles.userId, userId));
          } catch (error) {
            console.error("Error updating subscription:", error);
            posthogClient.capture({
              distinctId: userId,
              event: `stripe subscription update ERROR`,
              properties: {
                message:
                  error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
              },
            });
            throw error;
          }
        } else if (subscription.status === "canceled") {
          // const isPremium =
          //   new Date(subscription.current_period_end * 1000) > new Date();
          const isPremium = false;
          let clerkUserGone = false;

          try {
            await clerkClient().users.updateUserMetadata(userId, {
              privateMetadata: {
                isPremium,
              },
            });
          } catch (error) {
            console.log("Clerk user has already been deleted");
            clerkUserGone = true;
          }

          try {
            await db
              .update(profiles)
              .set({
                stripePriceId: subscription.items.data[0]?.price.id,
                stripeExpireTimestamp: subscription.current_period_end,
                expiredAt: !isPremium || clerkUserGone ? new Date() : null,
                lastWebhookError: null, // Clear any previous errors
              })
              .where(eq(profiles.userId, userId));
          } catch (error) {
            console.error("Error updating subscription:", error);
            posthogClient.capture({
              distinctId: userId,
              event: `stripe subscription update ERROR`,
              properties: {
                message:
                  error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
              },
            });
            throw error;
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscription = invoice.subscription as string;

        console.log(
          `Processing failed payment for subscription ${subscription}`
        );

        const profileResult = await db
          .select()
          .from(profiles)
          .where(eq(profiles.stripeSubscriptionId, subscription))
          .limit(1);

        if (!profileResult || profileResult.length === 0) {
          console.error(
            `No profile found for subscription ${subscription} during payment failure`
          );
          return NextResponse.json(
            {
              message:
                "Profile not found for subscription during payment failure",
              subscriptionId: subscription,
            },
            { status: 404 }
          );
        }

        const userId = profileResult[0].userId;

        posthogClient.capture({
          distinctId: userId,
          event: `payment_failed`,
        });

        try {
          const clerkUser = await clerkClient().users.getUser(userId);

          if (clerkUser) {
            await clerkClient().users.updateUserMetadata(userId, {
              privateMetadata: {
                isPremium: false,
              },
            });
          }

          // Update the profile to record the payment failure
          await db
            .update(profiles)
            .set({
              lastWebhookError: "Payment failed",
              expiredAt: new Date(),
            })
            .where(eq(profiles.userId, userId));
        } catch (error) {
          console.error("Error processing payment failure:", error);
          throw error;
        }

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);

    if (error instanceof Error) {
      posthogClient.capture({
        distinctId: "webhook_error",
        event: "webhook_processing_error",
        properties: {
          error: error.message,
          stack: error.stack,
          eventType: event.type,
        },
      });
    }

    return NextResponse.json(
      {
        message: "Error processing webhook",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
