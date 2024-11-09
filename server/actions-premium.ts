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


"use server";

import { db } from "@/db";
import {
  sources,
  selectSourceSchema,
  quotes,
  selectQuoteSchema,
  insertMediaSchema,
  media,
} from "@/db/schema";
import { decrypt, getOrCreateEncryptionKey } from "@/lib/auth/encryptionKey";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { and, eq, ilike, inArray, isNull, or } from "drizzle-orm";
import { z } from "zod";
type Source = z.infer<typeof selectSourceSchema>;
type Quote = z.infer<typeof selectQuoteSchema>;
type Media = z.infer<typeof insertMediaSchema>;
import { utapi } from "@/server/uploadthing";

interface ImageFile {
  appUrl: string;
  key: string;
  name: string;
  uploadedBy: string;
  url: string;
}

export const search = async (query: string) => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  let isPremium = false;
  try {
    if (userId) {
      const user = await clerkClient().users.getUser(userId);
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

  query = query.toLowerCase();

  const booksResult = await db.query.sources.findMany({
    with: {
      media: true,
    },
    where: and(
      or(
        ilike(sources.title, `%${query}%`),
        ilike(sources.subtitle, `%${query}%`),
        ilike(sources.author, `%${query}%`)
      ),
      eq(sources.type, "BOOK"),
      eq(sources.ignored, false),
      eq(sources.userId, userId)
    ),
  });

  const dbResult = await db.query.quotes.findMany({
    with: {
      source: true,
    },
    where: eq(quotes.userId, userId),
  });

  // Decrypt and filter quotes asynchronously based on decrypted note and content
  const filteredResults = await Promise.all(
    dbResult.map(async (quote) => {
      if (quote.source.ignored) {
        return null;
      }

      if (quote.note) {
        quote.note = await decrypt(quote.note as string, encryptionKey);
        if (quote.note.toLowerCase().includes(query)) {
          return quote;
        }
      }

      if (quote.content.toLowerCase().includes(query)) {
        return quote;
      }

      if (quote.location && quote.location.toLowerCase().includes(query)) {
        return quote;
      }

      return null; // Return null for non-matching quotes
    })
  );

  // Filter out the null values (non-matching quotes)
  const quotesResult = filteredResults.filter((quote) => quote !== null);

  return { books: booksResult, quotes: quotesResult };
};

export const deleteQuote = async ({ quoteId }: { quoteId: string }) => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  let isPremium = false;
  try {
    if (userId) {
      const user = await clerkClient().users.getUser(userId);
      isPremium = user.privateMetadata.isPremium as boolean;
    }
  } catch (error) {
    isPremium = false;
  }

  if (!isPremium) {
    throw new Error("User not allowed");
  }

  try {
    await db
      .delete(quotes)
      .where(and(eq(quotes.id, quoteId), eq(quotes.userId, userId)));
    return {};
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getQuotesStandalone = async (): Promise<Quote[]> => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  let isPremium = false;
  try {
    if (userId) {
      const user = await clerkClient().users.getUser(userId);
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
    const dbResult = await db.query.quotes.findMany({
      where: and(
        isNull(quotes.sourceId),

        eq(quotes.userId, userId)
      ),
    });

    if (!dbResult) {
      throw new Error("Not found");
    }

    const decryptedQuotes = await Promise.all(
      dbResult.map(async (quote) => ({
        ...quote,
        note: quote.note
          ? await decrypt(quote.note as string, encryptionKey)
          : "",
      }))
    );

    return decryptedQuotes;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getSourceTitles = async (): Promise<Source[]> => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  let isPremium = false;
  try {
    if (userId) {
      const user = await clerkClient().users.getUser(userId);
      isPremium = user.privateMetadata.isPremium as boolean;
    }
  } catch (error) {
    isPremium = false;
  }

  if (!isPremium) {
    throw new Error("User not allowed");
  }

  try {
    const dbResult = await db.query.sources.findMany({
      where: eq(sources.userId, userId),
    });
    const validatedData = z.array(selectSourceSchema).parse(dbResult);

    return validatedData;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const updateBookImage = async (file: ImageFile, source: Source) => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  let isPremium = false;
  try {
    if (userId) {
      const user = await clerkClient().users.getUser(userId);
      isPremium = user.privateMetadata.isPremium as boolean;
    }
  } catch (error) {
    isPremium = false;
  }

  if (!isPremium) {
    throw new Error("User not allowed");
  }

  try {
    const toInsert: Media = {
      appUrl: file.appUrl,
      key: file.key,
      name: file.name,
      uploadedBy: file.uploadedBy,
      url: file.url,
      userId: userId,
    };

    const validatedData = insertMediaSchema.parse(toInsert);

    // delete the existing one first
    if (source.mediaId) {
      const mediaResults = await db.query.media.findFirst({
        where: and(eq(media.id, source.mediaId), eq(media.userId, userId)),
      });

      if (mediaResults && mediaResults.key) {
        await utapi.deleteFiles(mediaResults.key);
      }
    }

    const result = await db
      .insert(media)
      .values(validatedData)
      .onConflictDoNothing()
      .returning();

    const dbResult = await db
      .update(sources)
      .set({
        mediaId: result[0].id,
      })
      .where(and(eq(sources.id, source.id), eq(sources.userId, userId)));

    // this needs to be done after because of the key constraint
    if (source.mediaId) {
      await db
        .delete(media)
        .where(and(eq(media.id, source.mediaId), eq(media.userId, userId)));
    }

    return dbResult;
  } catch (error) {
    console.error(error);
    return [];
  }
};
