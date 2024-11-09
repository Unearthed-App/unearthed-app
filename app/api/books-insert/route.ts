import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import {
  sources,
  insertSourceSchema,
  insertMediaSchema,
  media,
} from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";
import PostHogClient from "@/app/posthog";

type SourceInsert = z.infer<typeof insertSourceSchema>;
type MediaInsert = z.infer<typeof insertMediaSchema>;
type BodyItem = SourceInsert & {
  imageUrl?: string;
};

export async function POST(request: NextRequest) {
  const { userId }: { userId: string | null } = auth();
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
