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

"use server";

import { parse } from "csv-parse";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Readable } from "stream";
import { z } from "zod";
import {
  sources,
  insertSourceSchema,
  insertQuoteSchema,
  quotes,
} from "@/db/schema";
import { db } from "@/db";
import { eq, inArray, and } from "drizzle-orm";
import { encrypt, getOrCreateEncryptionKey } from "@/lib/auth/encryptionKey";
type SourceInsert = z.infer<typeof insertSourceSchema>;
type QuoteInsert = z.infer<typeof insertQuoteSchema>;
const BATCH_SIZE = 100;

const SEPARATOR = "==========";
const csvSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  author: z.string().optional().default(""),
  content: z.string().optional(),
  note: z.string().optional().default(""),
  color: z.string().optional(),
  location: z.string().optional(),
});

function parseBookTitle(input: string) {
  input = input.trim();

  const result = {
    title: "",
    subtitle: "",
    author: "",
  };

  // Extract author first as it's the most consistent pattern
  const authorMatch = input.match(/\(([^()]+)\)$/);
  if (authorMatch) {
    result.author = authorMatch[1].trim();
    // Remove the author portion from input
    input = input.slice(0, input.lastIndexOf("(")).trim();
  }

  // Handle case with explicit subtitle in parentheses
  const subtitleMatch = input.match(/\(([^()]+)\)/);
  if (subtitleMatch) {
    result.subtitle = subtitleMatch[1].trim();
    // Remove subtitle portion
    input = input.replace(/\([^()]+\)/, "").trim();
  } else {
    // Check for subtitle after colon
    const colonParts = input.split(":");
    if (colonParts.length > 1) {
      result.subtitle = colonParts[1].trim();
      input = colonParts[0].trim();
    }
  }

  // Whatever remains is the title
  result.title = input;

  return result;
}

async function parseAndValidateClippings(clippingsText: string) {
  const records = clippingsText
    .split(SEPARATOR)
    .map((record) => record.trim())
    .filter(
      (record) =>
        record.length > 0 &&
        (record.includes("Your Highlight") || record.includes("Your Note"))
    );

  const quoteRecords = records
    .map((record) => record.trim())
    .filter((record) => record.length > 0 && record.includes("Your Highlight"));

  const noteRecords = records
    .map((record) => record.trim())
    .filter((record) => record.length > 0 && record.includes("Your Note"));

  const notesByTitleAuthor: Record<string, string> = {};

  for (const row of noteRecords) {
    const splitLines = row.split(/\r\n|\r|\n/);
    const firstLine = splitLines[0];
    const parseBookTitleResult = parseBookTitle(firstLine);

    const secondLine = splitLines[1];
    const locationSplit = secondLine.split(" | ")[0];
    let location: string = locationSplit.replace("- Your Highlight on ", "");
    location = location.replace("- Your Note on ", "");

    const note = splitLines[splitLines.length - 1];
    const noteKey = `${parseBookTitleResult.title}${
      parseBookTitleResult.author
    }${location}${secondLine.split(" | ")[1]}`;
    notesByTitleAuthor[noteKey] = note;
  }

  let toReturn = [];
  for (const row of quoteRecords) {
    const splitLines = row.split(/\r\n|\r|\n/);
    const firstLine = splitLines[0];
    const parseBookTitleResult = parseBookTitle(firstLine);
    const secondLine = splitLines[1];
    const locationSplit = secondLine.split(" | ")[0];
    let location: string = locationSplit.replace("- Your Highlight on ", "");
    location = location.replace("- Your Note on ", "");
    const noteKey = `${parseBookTitleResult.title}${
      parseBookTitleResult.author
    }${location}${secondLine.split(" | ")[1]}`;

    toReturn.push({
      title: parseBookTitleResult.title,
      subtitle: parseBookTitleResult.subtitle,
      author: parseBookTitleResult.author,
      content: splitLines[splitLines.length - 1],
      location: location,
      note: notesByTitleAuthor[noteKey] || "",
    });
  }

  return toReturn;
}

async function parseAndValidateCSV(csvText: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const records: any[] = [];
    const errors: any[] = [];

    const stream = Readable.from(csvText);

    stream
      .pipe(
        parse({
          columns: true, // Treat first row as headers
          skip_empty_lines: true,
          trim: true,
        })
      )
      .on("data", (record) => {
        const validation = csvSchema.safeParse(record);
        if (validation.success) {
          records.push(validation.data);
        } else {
          errors.push(validation.error);
        }
      })
      .on("end", () => {
        if (errors.length > 0) {
          reject(new Error(`Validation failed for ${errors.length} rows`));
        } else {
          resolve(records);
        }
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

export async function onSubmitAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  let isPremium = false;
  try {
    if (userId) {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      isPremium = user.privateMetadata.isPremium as boolean;
    }
  } catch (error) {
    isPremium = false;
  }

  if (!isPremium) {
    throw new Error("User not allowed");
  }

  const encryptionKey = await getOrCreateEncryptionKey();
  if (!encryptionKey) {
    throw new Error("User not authenticated");
  }

  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    const text = await file.text();

    let records;

    if (formData.get("type") === "csv") {
      records = await parseAndValidateCSV(text);
    } else if (formData.get("type") === "kindle") {
      records = await parseAndValidateClippings(text);
    }

    if (!records) {
      return {
        success: false,
        message: "Could not process file",
      };
    }

    const SourcesArraySchema = z.array(insertSourceSchema);
    const toInsert: SourceInsert[] = SourcesArraySchema.parse(records).map(
      (row) => ({
        ...row,
        type: "BOOK",
        origin: "UNEARTHED",
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

    let combinedInsertedRecords = records.map((item) => {
      const matchingSource = insertedRecords.find((source) => {
        return source.title === item.title && source.author === item.author;
      });

      if (!matchingSource) {
        return {
          ...item,
          userId,
        };
      }

      return {
        ...item,
        sourceId: matchingSource.id,
        userId,
      };
    });

    combinedInsertedRecords = combinedInsertedRecords.filter(
      (row) => row.sourceId !== undefined && row.sourceId !== null
    );

    if (insertedRecords.length > 0) {
      await insertQuotesForInsertedSources(
        combinedInsertedRecords,
        encryptionKey
      );
    }

    let combinedExistingRecords = records.map((item) => {
      const matchingSource = existingRecords.find(
        (source) => source.title === item.title && source.author === item.author
      );

      return {
        ...item,
        sourceId: matchingSource?.id,
        userId,
      };
    });

    combinedExistingRecords = combinedExistingRecords.filter(
      (row) => row.sourceId !== undefined && row.sourceId !== null
    );

    if (existingRecords.length > 0) {
      await insertQuotesForExistingSources(
        combinedExistingRecords,
        encryptionKey,
        userId
      );
    }

    return {
      success: true,
      message: "Data imported successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Could not process file",
    };
  }
}
const insertQuotesForInsertedSources = async (
  combinedInsertedRecords: QuoteInsert[],
  encryptionKey: string
) => {
  const QuotesArraySchema = z.array(insertQuoteSchema);

  const toInsertQuotes = await Promise.all(
    QuotesArraySchema.parse(combinedInsertedRecords)
      .filter((row) => row.content !== null && row.content.trim() !== "")
      .map(async (row) => ({
        ...row,
        note: row.note ? await encrypt(row.note, encryptionKey) : "",
      }))
  );

  const batches: any[] = [];

  for (let i = 0; i < toInsertQuotes.length; i += BATCH_SIZE) {
    batches.push(toInsertQuotes.slice(i, i + BATCH_SIZE));
  }

  await db.transaction(async (tx) => {
    for (const batch of batches) {
      await tx.insert(quotes).values(batch).onConflictDoNothing();
    }
  });

  return true;
};

const insertQuotesForExistingSources = async (
  combinedExistingRecords: QuoteInsert[],
  encryptionKey: string,
  userId: string
) => {
  const sourceIds = combinedExistingRecords.map((row) => row.sourceId);

  const quotesFromDb = await db
    .select()
    .from(quotes)
    .where(and(inArray(quotes.sourceId, sourceIds), eq(quotes.userId, userId)));

  const quotesBySourceId = quotesFromDb.reduce(
    (acc, quote) => {
      if (!acc[quote.sourceId]) {
        acc[quote.sourceId] = [];
      }
      acc[quote.sourceId].push(quote.content);
      return acc;
    },
    {} as { [sourceId: string]: string[] }
  );

  const filteredRecords = combinedExistingRecords.filter((record) => {
    if (!record.content || record.content.trim() === "") {
      return false;
    }

    const existingQuotes = quotesBySourceId[record.sourceId] || [];
    return !existingQuotes.includes(record.content);
  });

  if (filteredRecords.length === 0) {
    return true;
  }

  const QuotesArraySchema = z.array(insertQuoteSchema);

  const toInsertQuotes = await Promise.all(
    QuotesArraySchema.parse(filteredRecords).map(async (row) => ({
      ...row,
      note: row.note ? await encrypt(row.note, encryptionKey) : "",
    }))
  );

  const batches: any[] = [];

  for (let i = 0; i < toInsertQuotes.length; i += BATCH_SIZE) {
    batches.push(toInsertQuotes.slice(i, i + BATCH_SIZE));
  }

  await db.transaction(async (tx) => {
    for (const batch of batches) {
      await tx.insert(quotes).values(batch).onConflictDoNothing();
    }
  });

  return true;
};
