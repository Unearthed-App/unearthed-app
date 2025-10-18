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

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db/index";
import {
  insertQuoteSchema,
  profiles,
  quotes,
  unearthedKeys,
} from "@/db/schema";
import { z } from "zod";
import { encrypt } from "@/lib/auth/encryptionKey";
import bcrypt from "bcrypt";

import PostHogClient from "@/app/posthog";
import { and, eq, isNotNull } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";

const BATCH_SIZE = 100;

// Sanitization function to be used on both incoming and existing data
const sanitizeText = (text: string): string => {
  if (!text || typeof text !== "string") return "";

  return (
    text
      // Normalize unicode characters
      .normalize("NFKC")
      // Replace various problematic quote characters with standard ones
      .replace(/[\u2018\u2019]/g, "'") // Smart single quotes
      .replace(/[\u201C\u201D]/g, '"') // Smart double quotes
      .replace(/[\u2013\u2014]/g, "-") // En dash, Em dash
      .replace(/\u2026/g, "...") // Ellipsis
      // Replace various whitespace characters with standard space
      .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, " ")
      // Replace zero-width characters
      .replace(/[\u200B\u200C\u200D\uFEFF]/g, "")
      // Replace other problematic characters
      .replace(/[\u00AD]/g, "") // Soft hyphen
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") // Control characters
      // Trim and collapse multiple spaces
      .replace(/\s+/g, " ")
      .trim()
  );
};

async function verifyApiKeyGetProfile(
  providedApiKey: string,
  providedUserId: string
) {
  const potentialProfiles = await db.query.unearthedKeys.findMany({
    where: and(
      eq(unearthedKeys.userId, providedUserId),
      isNotNull(unearthedKeys.key)
    ),
  });

  for (const unearthedKey of potentialProfiles) {
    const isMatch = await bcrypt.compare(providedApiKey, unearthedKey.key!);
    if (isMatch) {
      const profile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, unearthedKey.userId),
      });
      return profile;
    }
  }

  return false;
}

export async function POST(request: NextRequest) {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bearerValue = authHeader.split(" ")[1];
  const apiKey = bearerValue.split("~~~")[0];
  const secret = bearerValue.split("~~~")[1];

  if (!apiKey || !secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = await clerkClient();

  const clerkUsersResponse = await client.users.getUserList({
    limit: 500,
  });
  const clerkUsers = clerkUsersResponse.data;
  const matchingUser = clerkUsers.find(
    (user) => user.privateMetadata.secret === secret
  );

  if (!matchingUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const matchesUserId = matchingUser.id;

  const profile = await verifyApiKeyGetProfile(apiKey, matchesUserId);

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = profile.userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let encryptionKey: string | undefined;
  const user = await client.users.getUser(userId);
  encryptionKey = user.privateMetadata.encryptionKey as string | undefined;

  if (!encryptionKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const posthogClient = PostHogClient();

  posthogClient.capture({
    distinctId: userId,
    event: `quotes-insert BEGIN`,
  });

  try {
    let body = await request.json();
    const QuotesArraySchema = z.array(insertQuoteSchema);

    // 1. Fetch existing quotes for the user
    const existingQuotes = await db.query.quotes.findMany({
      where: eq(quotes.userId, userId),
    });

    // 2. Create a Set of sanitized texts from existing quotes for efficient lookup
    const existingSanitizedTexts = new Set(
      existingQuotes.map((q) => sanitizeText(q.content))
    );
    // 3. Filter the incoming quotes to remove duplicates
    const uniqueNewQuotes = body.filter((newQuote: any) => {
      const sanitizedNewText = sanitizeText(newQuote.content);
      // Keep the quote only if its sanitized version is not in our Set
      return !existingSanitizedTexts.has(sanitizedNewText);
    });
    // If all quotes were duplicates, we can exit early.
    if (uniqueNewQuotes.length === 0) {
      return NextResponse.json(
        { result: "No new quotes to add." },
        { status: 200 }
      );
    }

    // 4. Prepare the unique quotes for insertion
    const toInsert = await Promise.all(
      QuotesArraySchema.parse(uniqueNewQuotes).map(async (row) => ({
        ...row,
        note: row.note ? await encrypt(row.note, encryptionKey!) : "",
        userId,
      }))
    );
    const batches: any[] = [];

    for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
      batches.push(toInsert.slice(i, i + BATCH_SIZE));
    }

    posthogClient.capture({
      distinctId: userId,
      event: `quotes-insert uploading quotes in batches`,
      properties: {
        originalCount: body.length,
        newQuoteCount: toInsert.length,
        batchCount: batches.length,
      },
    });

    // 5. Insert the new unique quotes
    await db.transaction(async (tx) => {
      for (const batch of batches) {
        // onConflictDoNothing is kept as a final safety net,
        // though our logic should prevent most conflicts.
        await tx.insert(quotes).values(batch).onConflictDoNothing();
      }
    });

    return NextResponse.json(
      { message: `Successfully added ${toInsert.length} new quotes.` },
      { status: 200 }
    );
  } catch (error) {
    posthogClient.capture({
      distinctId: userId,
      event: `quotes-insert ERROR`,
      properties: {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    });
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error inserting quotes:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
