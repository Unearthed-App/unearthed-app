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
  profiles,
  insertProfileSchema,
  notionSourceJobsOne,
  notionSourceJobsTwo,
  notionSourceJobsThree,
} from "@/db/schema";
import { decrypt, getOrCreateEncryptionKey } from "@/lib/auth/encryptionKey";
import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  and,
  eq,
  ilike,
  inArray,
  isNotNull,
  isNull,
  not,
  or,
} from "drizzle-orm";
import { z } from "zod";
type Source = z.infer<typeof selectSourceSchema>;
type Quote = z.infer<typeof selectQuoteSchema>;
type Media = z.infer<typeof insertMediaSchema>;
type Profile = z.infer<typeof insertProfileSchema>;
import { utapi } from "@/server/uploadthing";
import { splitArray } from "@/lib/utils";

interface ImageFile {
  appUrl: string;
  key: string;
  name: string;
  uploadedBy: string;
  url: string;
}

export const search = async (query: string) => {
  const { userId }: { userId: string | null } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
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
  const { userId }: { userId: string | null } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
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
  const { userId }: { userId: string | null } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
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
  const { userId }: { userId: string | null } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
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
  const { userId }: { userId: string | null } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
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

export const deleteBookImage = async (source: Source) => {
  const { userId }: { userId: string | null } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
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

  try {
    if (source.mediaId) {
      const mediaResults = await db.query.media.findFirst({
        where: and(eq(media.id, source.mediaId), eq(media.userId, userId)),
      });

      if (mediaResults && mediaResults.key) {
        await db
          .update(sources)
          .set({ mediaId: null })
          .where(and(eq(sources.id, source.id), eq(sources.userId, userId)));

        await db
          .delete(media)
          .where(and(eq(media.id, source.mediaId), eq(media.userId, userId)));

        await utapi.deleteFiles(mediaResults.key);
      }
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const disconnectNotion = async () => {
  const { userId }: { userId: string | null } = await auth();
  if (!userId) {
    return { success: false };
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
    return { success: false };
  }

  try {
    await db
      .update(profiles)
      .set({
        notionAuthData: null,
        notionDatabaseId: null,
      })
      .where(eq(profiles.userId, userId));

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};

export const syncToNotion = async () => {
  const { userId }: { userId: string | null } = await auth();
  if (!userId) {
    return { success: false };
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
    return { success: false };
  }

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
    .where(eq(profiles.userId, userId));

  type SourceResult = {
    id: string;
    profile: Profile | null;
  };

  const sourcesResults = dbResults.map(
    (result): SourceResult => ({
      ...result.sources,
      profile: result.profiles,
    })
  );

  if (!sourcesResults || sourcesResults.length === 0) {
    throw new Error("sourcesResults failed");
  }

  // delete all existing jobs for that user first
  const sourceIds = sourcesResults.map((source) => source.id);
  await db
    .delete(notionSourceJobsOne)
    .where(inArray(notionSourceJobsOne.sourceId, sourceIds));
  await db
    .delete(notionSourceJobsTwo)
    .where(inArray(notionSourceJobsTwo.sourceId, sourceIds));
  await db
    .delete(notionSourceJobsThree)
    .where(inArray(notionSourceJobsThree.sourceId, sourceIds));
  // await db
  //   .delete(notionSourceJobsFour)
  //   .where(inArray(notionSourceJobsFour.sourceId, sourceIds));

  const [sourcesOne, sourcesTwo, sourcesThree, sourcesFour] = splitArray(
    sourcesResults,
    // 1
    3
  );

  const tables = [
    notionSourceJobsOne,
    notionSourceJobsTwo,
    notionSourceJobsThree,
    //   notionSourceJobsFour,
  ];
  const sourceChunks = [sourcesOne, sourcesTwo, sourcesThree, sourcesFour];
  const nonEmptyChunks = sourceChunks.filter(
    (chunk): chunk is NonNullable<typeof chunk> =>
      Array.isArray(chunk) && chunk.length > 0
  );
  for (let i = 0; i < nonEmptyChunks.length; i++) {
    const toInsert = nonEmptyChunks[i].map((source: SourceResult) => {
      if (!source.profile) {
        throw new Error(`Source ${source.id} has no associated profile`);
      }
      return {
        sourceId: source.id,
        profileId: source.profile.id!,
        status: "READY",
        newConnection: false,
      };
    });

    // await db.insert(notionSourceJobsOne).values(toInsert).onConflictDoNothing();

    if (tables[i] && toInsert.length > 0) {
      await db.insert(tables[i]).values(toInsert).onConflictDoNothing();
    } else {
      console.error(`Table at index ${i} is undefined`);
    }
  }

  return { success: true };
};
