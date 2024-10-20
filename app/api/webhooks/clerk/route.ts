import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import {
  generateSecureKey,
} from "@/lib/auth/encryptionKey";
import { insertProfileSchema, profiles } from "@/db/schema";
import { z } from "zod";
import { db } from "@/db";

type Profile = z.infer<typeof insertProfileSchema>;

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

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

  if (evt.type === "user.created") {
    const userId = evt.data.id;
    console.log("userId:", userId);

    if (!userId) {
      return new Response("Error", { status: 500 });
    }

    const newEncryptionKey = generateSecureKey(); // Generate a secure encryption key
    const newSecret = generateSecureKey(); // Generate a secure encryption key

    try {
      await clerkClient.users.updateUserMetadata(userId, {
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
  }

  return new Response("", { status: 200 });
}
