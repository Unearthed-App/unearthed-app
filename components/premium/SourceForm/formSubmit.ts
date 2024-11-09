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
