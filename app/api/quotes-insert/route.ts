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


import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { insertQuoteSchema, quotes } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { encrypt, getOrCreateEncryptionKey } from "@/lib/auth/encryptionKey";
import PostHogClient from "@/app/posthog";

const BATCH_SIZE = 100;

export async function POST(request: NextRequest) {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const encryptionKey = await getOrCreateEncryptionKey();
  if (!encryptionKey) {
    throw new Error("User not authenticated");
  }
  const posthogClient = PostHogClient();

  posthogClient.capture({
    distinctId: userId,
    event: `quotes-insert BEGIN`,
  });

  try {
    let body = await request.json();

    body = body.map((row: any) => {
      const { sourceId, ...rest } = row;
      return {
        ...rest,
        sourceId: sourceId,
      };
    });
    const QuotesArraySchema = z.array(insertQuoteSchema);

    const toInsert = await Promise.all(
      QuotesArraySchema.parse(body).map(async (row) => ({
        ...row,
        note: row.note ? await encrypt(row.note, encryptionKey) : "",
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
        quoteCount: toInsert.length,
        batchCount: batches.length,
      },
    });

    const result = await db.transaction(async (tx) => {
      for (const batch of batches) {
        await tx.insert(quotes).values(batch).onConflictDoNothing();
      }
    });

    return NextResponse.json({ result }, { status: 200 });
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
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
