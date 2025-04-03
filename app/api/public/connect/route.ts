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
import { profiles, unearthedKeys } from "@/db/schema";
import bcrypt from "bcrypt";
import { clerkClient } from "@clerk/nextjs/server";

import PostHogClient from "@/app/posthog";

async function verifyApiKeyGetProfile(providedApiKey: string) {
  const potentialProfiles = await db.query.unearthedKeys.findMany({
    where: and(isNotNull(unearthedKeys.userId), isNotNull(unearthedKeys.key)),
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

  const apiKey = authHeader.split(" ")[1];

  if (!apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await verifyApiKeyGetProfile(apiKey);

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = await clerkClient();
  const user = await client.users.getUser(profile.userId);
  const secret = user.privateMetadata.secret as string;

  const posthogClient = PostHogClient();
  posthogClient.capture({
    distinctId: profile.userId,
    event: `connect`,
  });

  return NextResponse.json({
    success: true,
    data: { secret },
  });
}
