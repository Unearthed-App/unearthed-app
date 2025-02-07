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

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import {
  notionSourceJobsOne,
  notionSourceJobsThree,
  notionSourceJobsTwo,
  // notionSourceJobsFour,
  profiles,
  sources,
  selectProfileSchema,
} from "@/db/schema";
import { and, eq, isNotNull, not } from "drizzle-orm";
import PostHogClient from "@/app/posthog";
import { generateUUID, splitArray } from "@/lib/utils";

type Profile = z.infer<typeof selectProfileSchema>;

export async function GET() {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  const validToken = process.env.CRON_TOKEN;
  const posthogClient = PostHogClient();

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  if (token !== validToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const distinctId = generateUUID();

  posthogClient.capture({
    distinctId,
    event: `notion-insert-jobs cron`,
  });

  try {
    const dbResults = await db
      .select()
      .from(sources)
      .leftJoin(
        profiles,
        and(
          eq(sources.ignored, false),
          eq(sources.userId, profiles.userId),
          eq(profiles.userStatus, "ACTIVE"),
          isNotNull(profiles.notionAuthData),
          isNotNull(profiles.notionDatabaseId),
          not(eq(profiles.notionAuthData, "")),
          not(eq(profiles.notionDatabaseId, ""))
        )
      )
      .where(and(isNotNull(profiles.userId)));

    type SourceResult = {
      id: string;
      profile: Profile | null;
    };

    const sourcesResults = dbResults.map(
      (result): SourceResult => ({
        ...result.sources,
        profile: result.profiles,
      })
    );

    if (!sourcesResults || sourcesResults.length === 0) {
      posthogClient.capture({
        distinctId,
        event: `notion-insert-jobs cron ERROR`,
        properties: {
          message: `No sources found`,
        },
      });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const [sourcesOne, sourcesTwo, sourcesThree, sourcesFour] = splitArray(
      sourcesResults,
      // 1
      3
    );

    const tables = [
      notionSourceJobsOne,
      notionSourceJobsTwo,
      notionSourceJobsThree,
      // notionSourceJobsFour,
    ];
    const sourceChunks = [sourcesOne, sourcesTwo, sourcesThree, sourcesFour];

    const nonEmptyChunks = sourceChunks.filter(
      (chunk): chunk is NonNullable<typeof chunk> =>
        Array.isArray(chunk) && chunk.length > 0
    );

    for (let i = 0; i < nonEmptyChunks.length; i++) {
      const toInsert = nonEmptyChunks[i].map((source: SourceResult) => {
        if (!source.profile) {
          throw new Error(`Source ${source.id} has no associated profile`);
        }
        return {
          sourceId: source.id,
          profileId: source.profile.id,
          status: "READY",
          newConnection: false,
        };
      });

      // await db
      //   .insert(notionSourceJobsOne)
      //   .values(toInsert)
      //   .onConflictDoNothing();

      if (tables[i] && toInsert.length > 0) {
        await db.insert(tables[i]).values(toInsert).onConflictDoNothing();
      } else {
        console.error(`Table at index ${i} is undefined`);
      }
    }
  } catch (error) {
    console.error("Error in Notion redirect handler:", error);
    posthogClient.capture({
      distinctId,
      event: `notion-insert-jobs cron ERROR`,
      properties: {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    });

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
