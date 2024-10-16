"use server";
import { encrypt, getOrCreateEncryptionKey, hashApiKey } from "@/lib/auth/encryptionKey";
import { schema } from "./formSchema";

import { auth } from "@clerk/nextjs/server";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { generateNewUnearthedApiKey } from "@/server/actions";

export async function onSubmitAction(data: any, utcOffset: number) {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data",
    };
  }

  if (!userId) {
    return {
      success: false,
      message: "Not authenticated",
    };
  }

  const encryptionKey = await getOrCreateEncryptionKey();
  if (!encryptionKey) {
    return {
      success: false,
      message: "No encryption key found",
    };
  }

  if (!parsed.data.unearthedApiKey) {
    const newApiKey = await generateNewUnearthedApiKey();
    if (newApiKey) {
      parsed.data.unearthedApiKey = newApiKey as string;
    }
  }

  const capacitiesApiKeyEncyrpted = parsed.data.capacitiesApiKey
    ? await encrypt(parsed.data.capacitiesApiKey as string, encryptionKey)
    : "";
  const unearthedApiKeyHash = parsed.data.unearthedApiKey
    ? await hashApiKey(
        parsed.data.unearthedApiKey as string
      )
    : "";
  const capacitiesSpaceIdEncyrpted = parsed.data.capacitiesSpaceId
    ? await encrypt(parsed.data.capacitiesSpaceId as string, encryptionKey)
    : "";

  let couldNotUpdate = false;

  try {
    const result = await db
      .update(profiles)
      .set({
        capacitiesApiKey: capacitiesApiKeyEncyrpted,
        unearthedApiKey: unearthedApiKeyHash,
        capacitiesSpaceId: capacitiesSpaceIdEncyrpted,
        utcOffset,
      })
      .where(eq(profiles.userId, userId));
    console.log(result);
    if (result.length === 0) {
      couldNotUpdate = true;
    }
  } catch (error) {
    console.error(error);
    couldNotUpdate = true;
  }

  if (couldNotUpdate) {
    try {
      await db
        .insert(profiles)
        .values({
          capacitiesApiKey: capacitiesApiKeyEncyrpted,
          unearthedApiKey: unearthedApiKeyHash,
          capacitiesSpaceId: capacitiesSpaceIdEncyrpted,
          utcOffset,
          userId: userId,
        })
        .onConflictDoNothing()
        .returning();
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Could not update or insert profile",
      };
    }
  }

  return {
    success: true,
    message: "Your profile settings have been saved.",
  };
}
