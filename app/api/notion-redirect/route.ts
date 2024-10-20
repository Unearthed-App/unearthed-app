import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { encrypt, getOrCreateEncryptionKey } from "@/lib/auth/encryptionKey";
import {
  insertNotionSourceJobsOneSchema,
  notionSourceJobsOne,
  insertNotionSourceJobsTwoSchema,
  notionSourceJobsTwo,
  insertNotionSourceJobsThreeSchema,
  notionSourceJobsThree,
  insertNotionSourceJobsFourSchema,
  notionSourceJobsFour,
  profiles,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { firstNotionSync } from "@/server/actions";
import { z } from "zod";
import PostHogClient from "@/app/posthog";
import { splitArray } from "@/lib/utils";

type NotionSourceJobsOneInsert = z.infer<
  typeof insertNotionSourceJobsOneSchema
>;
type NotionSourceJobsTwoInsert = z.infer<
  typeof insertNotionSourceJobsTwoSchema
>;
type NotionSourceJobsThreeInsert = z.infer<
  typeof insertNotionSourceJobsThreeSchema
>;
type NotionSourceJobsFourInsert = z.infer<
  typeof insertNotionSourceJobsFourSchema
>;

export async function GET(request: NextRequest): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const posthogClient = PostHogClient();

  posthogClient.capture({
    distinctId: userId,
    event: `notion-redirect`,
    properties: {
      code,
    },
  });
  if (!code) {
    return NextResponse.json(
      { error: "Missing code parameter" },
      { status: 400 }
    );
  }

  let encryptionKey;
  try {
    encryptionKey = await getOrCreateEncryptionKey();
  } catch (error) {
    console.error("Error getting encryption key:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  if (!encryptionKey) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const notionClientId = process.env.NOTION_CLIENT_ID;
    const notionSecret = process.env.NOTION_SECRET;
    const domain = process.env.DOMAIN;

    if (!notionClientId || !notionSecret || !domain) {
      throw new Error("Missing environment variables");
    }

    const encodedIdAndSecret = Buffer.from(
      `${notionClientId}:${notionSecret}`
    ).toString("base64");

    const body = {
      code: code,
      grant_type: "authorization_code",
      redirect_uri: `${domain}/api/notion-redirect`,
    };

    const response = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${encodedIdAndSecret}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.statusText}`);
    }

    const data = await response.json();

    posthogClient.capture({
      distinctId: userId,
      event: `notion-redirect`,
      properties: {
        data,
      },
    });

    if (!data.access_token) {
      throw new Error("No access token in Notion response");
    }

    const encryptedAuthData = await encrypt(
      JSON.stringify(data),
      encryptionKey
    );

    await db.transaction(async (tx) => {
      const result = await tx
        .update(profiles)
        .set({
          notionAuthData: encryptedAuthData,
        })
        .where(eq(profiles.userId, userId));

      if (result.length === 0) {
        await tx
          .insert(profiles)
          .values({
            notionAuthData: encryptedAuthData,
            userId: userId,
            userStatus: "ACTIVE",
          })
          .onConflictDoNothing();
      }
    });

    let { success, sources } = await firstNotionSync();
    posthogClient.capture({
      distinctId: userId,
      event: `notion-redirect firstNotionSync`,
      properties: {
        success,
        sourcesLength: sources ? sources.length : 0,
      },
    });
    if (success && sources) {
      if (!Array.isArray(sources) || sources.length === 0) {
        throw new Error("No Sources found");
      }

      const [sourcesOne, sourcesTwo, sourcesThree, sourcesFour] = splitArray(
        sources,
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
          (source) => ({
            sourceId: source.id,
            status: "PENDING",
            newConnection: true,
          })
        );

        if (tables[i] && toInsert.length > 0) {
          await db.insert(tables[i]).values(toInsert).onConflictDoNothing();
        } else {
          console.error(`Table at index ${i} is undefined`);
        }
      }
    }

    const redirectUrl = new URL(
      `${domain}/dashboard/notion-setup-began`,
      request.url
    );
    redirectUrl.searchParams.set("redirect", "true");
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in Notion redirect handler:", error);
    posthogClient.capture({
      distinctId: userId,
      event: `notion-redirect Catch Error`,
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
