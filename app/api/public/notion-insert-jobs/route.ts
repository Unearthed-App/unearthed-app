import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import {
  insertNotionSourceJobsOneSchema,
  notionSourceJobsFour,
  notionSourceJobsOne,
  notionSourceJobsThree,
  notionSourceJobsTwo,
  profiles,
  selectSourceSchema,
  sources,
} from "@/db/schema";
import { and, eq, isNotNull, not } from "drizzle-orm";
import PostHogClient from "@/app/posthog";
import { splitArray } from "@/lib/utils";
type NotionSourceJobsOneInsert = z.infer<
  typeof insertNotionSourceJobsOneSchema
>;

type Source = z.infer<typeof selectSourceSchema>;

export async function GET() {
  const headersList = headers();
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

  posthogClient.capture({
    distinctId: "notion-insert-jobs cron",
    event: `notion-insert-jobs`,
    properties: {
      message: "got encryptionKey 1",
    },
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
      .where(
        and(
          isNotNull(profiles.userId),
        )
      );

    const sourcesResults: Source[] = dbResults.map((result) => result.sources);

    if (!sourcesResults || sourcesResults.length == 0) {
      throw new Error("profilesResults failed");
    }

    const [sourcesOne, sourcesTwo, sourcesThree, sourcesFour] = splitArray(
      sourcesResults,
      4
    );

    const tables = [
      notionSourceJobsOne,
      notionSourceJobsTwo,
      notionSourceJobsThree,
      notionSourceJobsFour,
    ];
    const sourceChunks = [sourcesOne, sourcesTwo, sourcesThree, sourcesFour];

    const nonEmptyChunks = sourceChunks.filter(
      (chunk): chunk is NonNullable<typeof chunk> =>
        Array.isArray(chunk) && chunk.length > 0
    );

    for (let i = 0; i < nonEmptyChunks.length; i++) {
      const toInsert: NotionSourceJobsOneInsert[] = nonEmptyChunks[i].map(
        (source: { id: string }) => ({
          sourceId: source.id,
          status: "PENDING",
          newConnection: false,
        })
      );

      if (tables[i] && toInsert.length > 0) {
        await db.insert(tables[i]).values(toInsert).onConflictDoNothing();
      } else {
        console.error(`Table at index ${i} is undefined`);
      }
    }
  } catch (error) {
    console.error("Error in Notion redirect handler:", error);
    posthogClient.capture({
      distinctId: "notion-insert-jobs cron",
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