import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { books, insertBookSchema } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";

type BookInsert = z.infer<typeof insertBookSchema>;

export async function POST(request: NextRequest) {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const deleteResult = await db
      .delete(books)
      .where(and(eq(books.status, "PENDING"), eq(books.userId, userId)));

    const BooksArraySchema = z.array(insertBookSchema);
    const toInsert: BookInsert[] = BooksArraySchema.parse(body).map((row) => ({
      ...row,
      status: "PENDING", // No need to explicitly cast, TypeScript knows it's valid
      userId,
    }));

    const result = await db
      .insert(books)
      .values(toInsert)
      .onConflictDoNothing()
      .returning();

    const insertedRecords = result;
    let existingRecords = toInsert.filter(
      (book) =>
        !insertedRecords.some(
          (insertedBook) => insertedBook.title === book.title
        )
    );

    let detailsForDuplicates: any = [];
    if (existingRecords.length > 0) {
      const titles = toInsert.map((item) => item.title);
      detailsForDuplicates = await db
        .select()
        .from(books)
        .where((row) => inArray(row.title, titles));
    }

    existingRecords = detailsForDuplicates.filter((row: { title: string }) => {
      const existingBook = existingRecords.find(
        (book) => book.title === row.title
      );
      return existingBook !== undefined;
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
