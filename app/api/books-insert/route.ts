import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { sources, insertSourceSchema } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { inArray } from "drizzle-orm";

type SourceInsert = z.infer<typeof insertSourceSchema>;

export async function POST(request: NextRequest) {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const SourcesArraySchema = z.array(insertSourceSchema);
    const toInsert: SourceInsert[] = SourcesArraySchema.parse(body).map(
      (row) => ({
        ...row,
        type: "BOOK",
        origin: "KINDLE",
        userId,
      })
    );

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
        .where((row) => inArray(row.title, titles));
    }

    existingRecords = detailsForDuplicates.filter((row: { title: string }) => {
      const existingSource = existingRecords.find(
        (source) => source.title === row.title
      );
      return existingSource !== undefined;
    });

    return NextResponse.json(
      { existingRecords, insertedRecords },
      { status: 200 }
    );
  } catch (error) {
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
