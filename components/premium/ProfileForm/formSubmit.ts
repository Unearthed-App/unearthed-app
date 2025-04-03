/**
 * Copyright (C) 2025 Unearthed App
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
import { encrypt, getOrCreateEncryptionKey } from "@/lib/auth/encryptionKey";
import { schema } from "./formSchema";

import { auth } from "@clerk/nextjs/server";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

import { db } from "@/db";

export async function onSubmitAction(data: any, utcOffset: number) {
  const { userId }: { userId: string | null } = await auth();
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

  const supernotesApiKeyEncyrpted = parsed.data.supernotesApiKey
    ? await encrypt(parsed.data.supernotesApiKey as string, encryptionKey)
    : "";

  const capacitiesApiKeyEncyrpted = parsed.data.capacitiesApiKey
    ? await encrypt(parsed.data.capacitiesApiKey as string, encryptionKey)
    : "";

  const capacitiesSpaceIdEncyrpted = parsed.data.capacitiesSpaceId
    ? await encrypt(parsed.data.capacitiesSpaceId as string, encryptionKey)
    : "";

  const aiApiKeyEncyrpted = parsed.data.aiApiKey
    ? await encrypt(parsed.data.aiApiKey as string, encryptionKey)
    : "";

  let couldNotUpdate = false;

  try {
    const result = await db
      .update(profiles)
      .set({
        dailyEmails: parsed.data.dailyEmails,
        supernotesApiKey: supernotesApiKeyEncyrpted,
        capacitiesApiKey: capacitiesApiKeyEncyrpted,
        capacitiesSpaceId: capacitiesSpaceIdEncyrpted,
        aiApiKey: aiApiKeyEncyrpted,
        aiApiUrl: parsed.data.aiApiUrl,
        aiApiModel: parsed.data.aiApiModel,
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
          dailyEmails: parsed.data.dailyEmails,
          supernotesApiKey: supernotesApiKeyEncyrpted,
          capacitiesApiKey: capacitiesApiKeyEncyrpted,
          capacitiesSpaceId: capacitiesSpaceIdEncyrpted,
          aiApiKey: aiApiKeyEncyrpted,
          aiApiUrl: parsed.data.aiApiUrl,
          aiApiModel: parsed.data.aiApiModel,
          utcOffset,
          userId: userId,
          userStatus: "ACTIVE",
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
