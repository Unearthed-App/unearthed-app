"use server";

import { schema } from "./formSchema";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/db";
import { insertSourceSchema, sources } from "@/db/schema";
type Source = z.infer<typeof insertSourceSchema>;

export async function onSubmitAction(data: any) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await clerkClient().users.getUser(userId!);
  const isPremium = user.privateMetadata.isPremium as boolean;

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

  try {
    const toInsert: Source = {
      title: parsed.data.title,
      subtitle: parsed.data.subtitle,
      author: parsed.data.author,
      type: parsed.data.type,
      origin: parsed.data.origin,
      userId: userId,
    };

    const validatedInsert = insertSourceSchema.parse(toInsert);
    await db
      .insert(sources)
      .values(validatedInsert)
      .onConflictDoNothing()
      .returning();

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
