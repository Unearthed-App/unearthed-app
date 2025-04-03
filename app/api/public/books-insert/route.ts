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
  sources,
  insertSourceSchema,
  insertMediaSchema,
  media,
  unearthedKeys,
  profiles,
} from "@/db/schema";
import { z } from "zod";
import { and, eq, inArray, isNotNull } from "drizzle-orm";
import bcrypt from "bcrypt";
import PostHogClient from "@/app/posthog";
import { clerkClient } from "@clerk/nextjs/server";

type SourceInsert = z.infer<typeof insertSourceSchema>;
type MediaInsert = z.infer<typeof insertMediaSchema>;
type BodyItem = SourceInsert & {
  imageUrl?: string;
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

  const posthogClient = PostHogClient();

  posthogClient.capture({
    distinctId: userId,
    event: `books-insert BEGIN`,
  });

  try {
    const body: BodyItem[] = await request.json();

    const MediaArraySchema = z.array(insertMediaSchema);

    const medias = body
      .filter((item: BodyItem) => item.imageUrl)
      .map((item: BodyItem) => ({
        url: item.imageUrl as string,
        userId,
        uploadedBy: userId,
      }));

    let mediaResults: MediaInsert[] = [];
    if (medias.length > 0) {
      posthogClient.capture({
        distinctId: userId,
        event: `books-insert uploading media`,
        properties: {
          mediaCount: medias.length,
        },
      });
      const validatedMedias = MediaArraySchema.parse(medias);
      mediaResults = await db
        .insert(media)
        .values(validatedMedias)
        .onConflictDoNothing()
        .returning();
    }

    const mediaMap = new Map(
      mediaResults.map((media) => [media.url, media.id])
    );

    const transformedBody = body.map((item: BodyItem) => {
      if (!item.imageUrl) return item;

      const { imageUrl, ...rest } = item;
      return {
        ...rest,
        mediaId: mediaMap.get(imageUrl),
      };
    });

    const SourcesArraySchema = z.array(insertSourceSchema);

    const toInsert: SourceInsert[] = SourcesArraySchema.parse(
      transformedBody
    ).map((row) => ({
      ...row,
      type: "BOOK",
      origin: "KINDLE",
      userId,
    }));

    posthogClient.capture({
      distinctId: userId,
      event: `books-insert uploading sources`,
      properties: {
        sourceount: toInsert.length,
      },
    });

    const result = await db
      .insert(sources)
      .values(toInsert)
      .onConflictDoNothing()
      .returning();

    const insertedRecords = result;
    let existingRecords = toInsert.filter(
      (source) =>
        !insertedRecords.some(
          (insertedSource) => insertedSource.title === source.title
        )
    );

    let detailsForDuplicates: any = [];
    if (existingRecords.length > 0) {
      const titles = toInsert.map((item) => item.title);
      detailsForDuplicates = await db
        .select()
        .from(sources)
        .where((row) =>
          and(inArray(row.title, titles), eq(row.userId, userId))
        );
    }

    existingRecords = detailsForDuplicates.filter((row: { title: string }) => {
      const existingSource = existingRecords.find(
        (source) => source.title === row.title
      );
      return existingSource !== undefined;
    });

    posthogClient.capture({
      distinctId: userId,
      event: `books-insert finished`,
      properties: {
        existingRecords: existingRecords.length,
        insertedRecords: insertedRecords.length,
      },
    });

    return NextResponse.json(
      { existingRecords, insertedRecords },
      { status: 200 }
    );
  } catch (error) {
    posthogClient.capture({
      distinctId: userId,
      event: `books-insert ERROR`,
      properties: {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
