"use server";

import { schema } from "./formSchema";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/db";
import { quotes, insertQuoteSchema } from "@/db/schema";
type Quote = z.infer<typeof insertQuoteSchema>;
import { encrypt, getOrCreateEncryptionKey } from "@/lib/auth/encryptionKey";

export async function onSubmitAction(data: any) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  let isPremium = false;
  try {
    if (userId) {
      const user = await clerkClient().users.getUser(userId);
      isPremium = user.privateMetadata.isPremium as boolean;
    }
  } catch (error) {
    isPremium = false;
  }

  if (!isPremium) {
    throw new Error("User not allowed");
  }

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data",
    };
  }

  const encryptionKey = await getOrCreateEncryptionKey();
  if (!encryptionKey) {
    return {
      success: false,
      message: "No encryption key found",
    };
  }

  try {
    const toInsert: Quote = {
      content: parsed.data.content,
      color: parsed.data.color,
      location: parsed.data.location,
      userId: userId,
      sourceId: data.sourceId,
    };

    if (parsed.data.note) {
      toInsert.note = await encrypt(parsed.data.note, encryptionKey);
    }

    const validatedInsert = insertQuoteSchema.parse(toInsert);
    await db.insert(quotes).values(validatedInsert).returning();

    return {
      success: true,
      message: "Added successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Could not add",
    };
  }
}