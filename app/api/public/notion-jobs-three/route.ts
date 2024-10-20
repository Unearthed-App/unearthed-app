import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { db } from "@/db";
import { notionSourceJobsThree } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import PostHogClient from "@/app/posthog";

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

  const dbResult = await db.query.notionSourceJobsThree.findMany({
    where: eq(notionSourceJobsThree.status, "PENDING"),
    with: {
      source: {
        with: {
          quotes: true,
        },
      },
    },
    limit: 2,
  });

  const sourceIds = [];
  for (const row of dbResult) {
    sourceIds.push(row.sourceId);
  }

  for (const row of dbResult) {
    posthogClient.capture({
      distinctId: `${row.source.userId}`,
      event: `notion-jobs-three cron`,
      properties: {
        newConnection: row.newConnection,
        sourceName: row.source.title,
      },
    });

    let result;

    if (row.newConnection) {
      // fetch(process.env.DOMAIN + "/api/public/notion-add-source", {
      result = await fetch(
        process.env.DOMAIN + "/api/public/notion-add-source-qstash",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.CRON_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: row.source,
          }),
        }
      );
    } else {
      // fetch(process.env.DOMAIN + "/api/public/notion-add-update-source", {
      result = await fetch(
        process.env.DOMAIN + "/api/public/notion-a-u-source-qstash",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.CRON_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: row.source,
          }),
        }
      );
    }

    posthogClient.capture({
      distinctId: `${row.source.userId}`,
      event: `notion-jobs-three result`,
      properties: {
        result,
      },
    });
  }

  await db
    .update(notionSourceJobsThree)
    .set({
      status: "COMPLETE",
    })
    .where(inArray(notionSourceJobsThree.sourceId, sourceIds));

  return NextResponse.json({ updated: dbResult.length }, { status: 200 });
}
