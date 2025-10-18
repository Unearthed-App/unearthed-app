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

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { and, eq, isNotNull } from "drizzle-orm";
import { profiles, sources, unearthedKeys } from "@/db/schema";
import bcrypt from "bcrypt";
import { decrypt } from "@/lib/auth/encryptionKey";
import { clerkClient } from "@clerk/nextjs/server";
import { sortQuotes } from "@/lib/utils";
import PostHogClient from "@/app/posthog";

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

export async function GET() {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bearerValue = authHeader.split(" ")[1];
  const apiKey = bearerValue.split("~~~")[0];
  let matchesUserId = bearerValue.split("~~~")[1];

  if (!apiKey || !matchesUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  matchesUserId = `user_${matchesUserId}`;

  const profile = await verifyApiKeyGetProfile(apiKey, matchesUserId);

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = profile.userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clerkClient();
  let user;
  let isPremium = false;
  try {
    user = await client.users.getUser(profile.userId);
    isPremium = user.privateMetadata.isPremium as boolean;
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isPremium) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posthogClient = PostHogClient();

  posthogClient.capture({
    distinctId: profile.userId,
    event: `obs-obsidian-sync BEGIN`,
  });

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(profile.userId);
    const encryptionKey = user.privateMetadata.encryptionKey as string;

    const dbResult = await db.query.sources.findMany({
      with: {
        quotes: true,
      },
      where: and(
        eq(sources.ignored, false),
        eq(sources.userId, profile.userId)
      ),
    });

    for (const source of dbResult) {
      for (const quote of source.quotes) {
        if (quote.note) {
          quote.note = await decrypt(quote.note as string, encryptionKey);
        }
        source.quotes = sortQuotes(source.quotes);
      }
    }

    return NextResponse.json({ success: true, data: dbResult });
  } catch (error) {
    console.error(error);

    posthogClient.capture({
      distinctId: profile.userId,
      event: `obs-obsidian-sync ERROR`,
      properties: {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    });

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
