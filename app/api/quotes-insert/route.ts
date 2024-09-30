import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { insertQuoteSchema, quotes } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { encrypt, getOrCreateEncryptionKey } from "@/lib/auth/encryptionKey";

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

  try {
    const body = await request.json();

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

    const result = await db.transaction(async (tx) => {
      for (const batch of batches) {
        await tx.insert(quotes).values(batch).onConflictDoNothing();
      }
    });

    return NextResponse.json({ result }, { status: 200 });
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
