import { NextResponse } from "next/server";
import { headers } from "next/headers";
import PostHogClient from "@/app/posthog";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { and, eq, gt, isNotNull } from "drizzle-orm";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
});

export async function POST() {
  const headersList = headers();
  const authHeader = headersList.get("authorization");
  const validToken = process.env.CRON_TOKEN;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  if (token !== validToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posthogClient = PostHogClient();

  try {
    posthogClient.capture({
      distinctId: `subscription-check-cron`,
      event: `subscription check START`,
    });

    const activeProfiles = await db
      .select()
      .from(profiles)
      .where(
        and(
          isNotNull(profiles.stripeSubscriptionId),
          gt(profiles.stripeExpireTimestamp, Math.floor(Date.now() / 1000))
        )
      );

    for (const profile of activeProfiles) {
      try {
        const subscription = await stripe.subscriptions.retrieve(
          profile.stripeSubscriptionId!
        );

        if (subscription.status !== "active") {
          await clerkClient().users.updateUserMetadata(profile.userId, {
            privateMetadata: {
              isPremium: false,
            },
          });

          await db
            .update(profiles)
            .set({
              // stripeSubscriptionId: null,
              // stripePriceId: null,
              // stripeCustomerId: null,
              // stripeCreatedTimestamp: null,
              // stripeExpireTimestamp: null,
              expiredAt: new Date(),
              lastWebhookError: `Subscription ${
                subscription.status
              } as of ${new Date().toISOString()}`,
            })
            .where(eq(profiles.userId, profile.userId));

          posthogClient.capture({
            distinctId: profile.userId,
            event: `subscription expired`,
          });
        }
      } catch (error) {
        console.error(
          `Error verifying subscription for user ${profile.userId}:`,
          error
        );
        posthogClient.capture({
          distinctId: profile.userId,
          event: `subscription check ERROR`,
          properties: {
            message:
              error instanceof Error ? error.message : "Unknown error occurred",
          },
        });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    posthogClient.capture({
      distinctId: "subscription-check-cron ERROR",
      event: `subscription check ERROR`,
      properties: {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    });
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}