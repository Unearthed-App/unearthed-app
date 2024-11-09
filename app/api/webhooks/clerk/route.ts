/**
 * Copyright (C) 2024 Unearthed App
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { generateSecureKey } from "@/lib/auth/encryptionKey";
import {
  dailyQuotes,
  insertProfileSchema,
  media,
  profiles,
  quotes,
  sources,
  unearthedKeys,
} from "@/db/schema";
import { z } from "zod";
import { db } from "@/db";
import { eq } from "drizzle-orm";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import PostHogClient from "@/app/posthog";

type Profile = z.infer<typeof insertProfileSchema>;

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  const posthogClient = PostHogClient();

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  posthogClient.capture({
    distinctId: `"clerk webhook START"`,
    event: `${evt.type}`,
  });

  if (evt.type === "user.created") {
    const userId = evt.data.id;

    if (!userId) {
      return new Response("Error", { status: 500 });
    }

    const newEncryptionKey = generateSecureKey();
    const newSecret = generateSecureKey();

    try {
      await clerkClient().users.updateUserMetadata(userId, {
        privateMetadata: {
          encryptionKey: newEncryptionKey,
          secret: newSecret,
        },
      });
      console.log("Encryption key set successfully");
    } catch (error) {
      console.error("Error setting encryption key:", error);
      return new Response("Error", { status: 500 });
    }

    try {
      const toInsert: Profile = {
        userId,
        userStatus: "ACTIVE",
      };

      const validatedProfileData = insertProfileSchema.parse(toInsert);

      const result = await db
        .insert(profiles)
        .values(validatedProfileData)
        .onConflictDoNothing();

      console.log("API key set successfully");
    } catch (error) {
      console.error("Error setting API key:", error);
      return new Response("Error", { status: 500 });
    }
  } else if (evt.type === "user.deleted") {
    const userId = evt.data.id;

    if (!userId) {
      return new Response("Error", { status: 500 });
    }

    try {
      const profile = await db
        .update(profiles)
        .set({
          userStatus: "TERMINATED",
        })
        .where(eq(profiles.userId, userId))
        .returning();

      if (profile[0] && profile[0].stripeSubscriptionId) {
        await stripe.subscriptions.cancel(
          profile[0].stripeSubscriptionId as string
        );
      }

      await db.delete(dailyQuotes).where(eq(dailyQuotes.userId, userId));
      await db.delete(sources).where(eq(sources.userId, userId));
      await db.delete(quotes).where(eq(quotes.userId, userId));
      await db.delete(unearthedKeys).where(eq(unearthedKeys.userId, userId));
      await db.delete(media).where(eq(media.userId, userId));
    } catch (error) {
      console.error("Error setting API key:", error);
      return new Response("Error", { status: 500 });
    }
  }

  return new Response("", { status: 200 });
}
