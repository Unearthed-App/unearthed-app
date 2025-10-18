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
  tags,
  sourceTags,
  quoteTags,
  insertTagSchema,
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
  count,
  desc,
  asc,
} from "drizzle-orm";
import { z } from "zod";
type Source = z.infer<typeof selectSourceSchema>;
type Quote = z.infer<typeof selectQuoteSchema>;
type Media = z.infer<typeof insertMediaSchema>;
type Profile = z.infer<typeof insertProfileSchema>;
import { utapi } from "@/server/uploadthing";
import { extractNumber, splitArray } from "@/lib/utils";
import { capicitiesGetSpaces, getProfile, getUnearthedKeys } from "./actions";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ImageFile {
  appUrl: string;
  key: string;
  name: string;
  uploadedBy: string;
  url: string;
}

interface BlindSpot {
  category: string;
  description: string;
  recommendations: {
    title: string;
    author: string;
    reason: string;
  }[];
}

interface BlindSpotsResponse {
  blindSpots: BlindSpot[];
  patterns: string[];
  suggestedTopics: string[];
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

  const tagsResult = await db.query.tags.findMany({
    where: and(
      or(
        ilike(tags.title, `%${query}%`),
        ilike(tags.description, `%${query}%`)
      ),
      eq(tags.userId, userId)
    ),
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

  // Get all quote-tag relationships for the filtered quotes
  const quoteTagsResult = await db
    .select({
      quoteId: quoteTags.quoteId,
      tagId: quoteTags.tagId,
      tagTitle: tags.title,
    })
    .from(quoteTags)
    .innerJoin(tags, eq(tags.id, quoteTags.tagId))
    .where(
      and(
        eq(quoteTags.userId, userId),
        inArray(
          quoteTags.quoteId,
          quotesResult.map((q) => q.id)
        )
      )
    );

  // Add tags to each quote
  const quotesWithTags = quotesResult.map((quote) => ({
    ...quote,
    tags: quoteTagsResult
      .filter((qt) => qt.quoteId === quote.id)
      .map((qt) => ({
        id: qt.tagId,
        title: qt.tagTitle,
      })),
  }));

  return { books: booksResult, quotes: quotesWithTags, tags: tagsResult };
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

export const getBook = async (
  bookId: string,
  page: number = 1,
  pageSize: number = 20
) => {
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
    const [totalCount, notesCount] = await Promise.all([
      db
        .select({ count: count() })
        .from(quotes)
        .where(and(eq(quotes.sourceId, bookId), eq(quotes.userId, userId))),
      db
        .select({ count: count() })
        .from(quotes)
        .where(
          and(
            eq(quotes.sourceId, bookId),
            eq(quotes.userId, userId),
            isNotNull(quotes.note),
            not(eq(quotes.note, ""))
          )
        ),
    ]);

    const allQuotes = await db
      .select({
        id: quotes.id,
        location: quotes.location,
        createdAt: quotes.createdAt,
      })
      .from(quotes)
      .where(and(eq(quotes.sourceId, bookId), eq(quotes.userId, userId)));

    // Sort quotes by numeric location, then createdAt, then id
    const sortedQuotes = allQuotes.sort((a, b) => {
      const aLoc = a.location || "";
      const bLoc = b.location || "";

      // Extract numbers from location strings
      const aNum = extractNumber(aLoc);
      const bNum = extractNumber(bLoc);

      // Compare numeric locations
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      } else if (isNaN(aNum) && !isNaN(bNum)) {
        return 1;
      } else if (!isNaN(aNum) && isNaN(bNum)) {
        return -1;
      }

      // If no numbers or equal numbers, sort by creation date and id
      if (a.createdAt !== b.createdAt) {
        return b.createdAt!.getTime() - a.createdAt!.getTime();
      }
      return a.id.localeCompare(b.id);
    });

    // Handle pagination in memory
    const paginatedQuoteIds = sortedQuotes
      .slice((page - 1) * pageSize, page * pageSize)
      .map((q) => q.id);

    // Get the book with the specific quotes
    const dbResult = await db.query.sources.findFirst({
      with: {
        quotes: {
          where: inArray(quotes.id, paginatedQuoteIds),
          orderBy: [asc(quotes.id)], // Keep original order from pagination
        },
        media: true,
      },
      where: and(eq(sources.id, bookId), eq(sources.userId, userId)),
    });

    if (!dbResult) {
      throw new Error("Book not found");
    }

    const bookTags = await db
      .select({
        id: tags.id,
        title: tags.title,
        description: tags.description,
        createdAt: tags.createdAt,
        userId: tags.userId,
      })
      .from(tags)
      .innerJoin(sourceTags, eq(sourceTags.tagId, tags.id))
      .where(
        and(eq(sourceTags.sourceId, bookId), eq(sourceTags.userId, userId))
      );

    const quoteTagsResult = await db
      .select({
        quoteId: quoteTags.quoteId,
        tagId: quoteTags.tagId,
        tagTitle: tags.title,
      })
      .from(quoteTags)
      .innerJoin(tags, eq(tags.id, quoteTags.tagId))
      .where(
        and(
          eq(quoteTags.userId, userId),
          inArray(
            quoteTags.quoteId,
            dbResult.quotes.map((q) => q.id)
          )
        )
      );

    // Map tags to quotes and maintain order from paginatedQuoteIds
    const quotesWithTags = paginatedQuoteIds
      .map((id) => dbResult.quotes.find((q) => q.id === id))
      .filter(
        (quote): quote is NonNullable<typeof quote> => quote !== undefined
      )
      .map((quote) => ({
        ...quote,
        tags: quoteTagsResult
          .filter((qt) => qt.quoteId === quote.id)
          .map((qt) => ({
            id: qt.tagId,
            title: qt.tagTitle,
          })),
      }));

    const decryptedQuotes = await Promise.all(
      quotesWithTags.map(async (quote) => ({
        ...quote,
        note: quote.note
          ? await decrypt(quote.note as string, encryptionKey)
          : "",
      }))
    );

    const resultWithTags = {
      ...dbResult,
      quotes: decryptedQuotes,
      tags: bookTags, // Include the full tag information
      totalQuotes: totalCount[0]?.count || 0,
      totalNotes: notesCount[0]?.count || 0,
    };

    return resultWithTags;
  } catch (error) {
    console.error("Error fetching book:", error);
    throw new Error("Failed to fetch book");
  }
};

type IdeaWithQuotes = {
  tag: string;
  description: string;
  quoteIds: string[];
};

export const createTagsFromIdeas = async (
  sourceId?: string,
  ideas?: IdeaWithQuotes[]
) => {
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
    if (!ideas) {
      ideas = [];
    }

    // First, check for existing tags with matching titles
    const ideaTitles = ideas.map((idea) => idea.tag);
    const existingTags = await db
      .select()
      .from(tags)
      .where(and(eq(tags.userId, userId), inArray(tags.title, ideaTitles)));

    // Separate ideas into new and existing
    const existingTagMap = new Map(existingTags.map((tag) => [tag.title, tag]));
    const newIdeas = ideas.filter((idea) => !existingTagMap.has(idea.tag));

    // Create new tags only for ideas that don't exist
    let newTags: typeof existingTags = [];
    if (newIdeas.length > 0) {
      const ideasModified = newIdeas.map((idea) => ({
        title: idea.tag,
        description: idea.description,
        userId: userId,
      }));

      const TagsArraySchema = z.array(insertTagSchema);
      const validatedInsert = TagsArraySchema.parse(ideasModified);
      newTags = await db.insert(tags).values(validatedInsert).returning();
    }

    // Combine existing and new tags
    const allTags = [...existingTags, ...newTags];

    // Create source-tag connections if sourceId is provided
    if (sourceId) {
      const sourceTagConnections = allTags.map((tag) => ({
        userId: userId,
        sourceId: sourceId,
        tagId: tag.id,
      }));

      await db
        .insert(sourceTags)
        .values(sourceTagConnections)
        .onConflictDoNothing();

      // Create quote-tag connections if quoteIds exist
      for (const idea of ideas) {
        const tag = allTags.find((t) => t.title === idea.tag);
        if (tag && idea.quoteIds && idea.quoteIds.length > 0) {
          const quoteTagConnections = idea.quoteIds.map((quoteId) => ({
            userId: userId,
            quoteId: quoteId,
            tagId: tag.id,
          }));

          await db
            .insert(quoteTags)
            .values(quoteTagConnections)
            .onConflictDoNothing();
        }
      }
    }

    return { success: true, tags: allTags };
  } catch (error) {
    console.error("Error creating tags:", error);
    throw new Error("Failed to create tags");
  }
};

export const deleteTagFromBook = async (tagId: string, sourceId: string) => {
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
    // First remove any quote-tag connections
    await db
      .delete(quoteTags)
      .where(and(eq(quoteTags.userId, userId), eq(quoteTags.tagId, tagId)));

    // Then remove the source-tag connection
    await db
      .delete(sourceTags)
      .where(
        and(
          eq(sourceTags.userId, userId),
          eq(sourceTags.tagId, tagId),
          eq(sourceTags.sourceId, sourceId)
        )
      );

    // // Finally delete the tag itself
    // await db
    //   .delete(tags)
    //   .where(and(eq(tags.id, tagId), eq(tags.userId, userId)));

    return { success: true };
  } catch (error) {
    console.error("Error deleting tag:", error);
    throw new Error("Failed to delete tag");
  }
};

export const deleteAllTagsFromBook = async (sourceId: string) => {
  const { userId }: { userId: string | null } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    // First get all tag IDs associated with this source
    const sourceTagsResult = await db
      .select({
        tagId: sourceTags.tagId,
      })
      .from(sourceTags)
      .where(
        and(eq(sourceTags.userId, userId), eq(sourceTags.sourceId, sourceId))
      );

    const tagIds = sourceTagsResult.map((st) => st.tagId);

    // Get all quote IDs for this source
    const quoteIds = await db
      .select({
        id: quotes.id,
      })
      .from(quotes)
      .where(and(eq(quotes.sourceId, sourceId), eq(quotes.userId, userId)));

    const quoteIdArray = quoteIds.map((q) => q.id);

    // Delete quote-tag connections for all quotes in this source
    if (quoteIdArray.length > 0) {
      await db
        .delete(quoteTags)
        .where(
          and(
            eq(quoteTags.userId, userId),
            inArray(quoteTags.quoteId, quoteIdArray)
          )
        );
    }

    // Delete quote-tag connections for these tags
    if (tagIds.length > 0) {
      await db
        .delete(quoteTags)
        .where(
          and(eq(quoteTags.userId, userId), inArray(quoteTags.tagId, tagIds))
        );
    }

    // Delete source-tag connections
    await db
      .delete(sourceTags)
      .where(
        and(eq(sourceTags.userId, userId), eq(sourceTags.sourceId, sourceId))
      );

    // // Finally delete the tags themselves
    // if (tagIds.length > 0) {
    //   await db
    //     .delete(tags)
    //     .where(and(eq(tags.userId, userId), inArray(tags.id, tagIds)));
    // }

    return { success: true };
  } catch (error) {
    console.error("Error deleting tags:", error);
    throw new Error("Failed to delete tags");
  }
};

export const getQuotesByTag = async (bookId: string, tagId: string) => {
  const { userId }: { userId: string | null } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const encryptionKey = await getOrCreateEncryptionKey();
  if (!encryptionKey) {
    throw new Error("User not authenticated");
  }

  try {
    // First get all quoteIds for this tag
    const taggedQuotes = await db
      .select({
        quoteId: quoteTags.quoteId,
      })
      .from(quoteTags)
      .where(eq(quoteTags.tagId, tagId));

    const quoteIds = taggedQuotes.map((tq) => tq.quoteId);

    // Then get the actual quotes
    const quotesResults = await db
      .select()
      .from(quotes)
      .where(
        and(
          inArray(quotes.id, quoteIds),
          eq(quotes.sourceId, bookId),
          eq(quotes.userId, userId)
        )
      );

    // Decrypt the notes
    const decryptedQuotes = await Promise.all(
      quotesResults.map(async (quote) => ({
        ...quote,
        note: quote.note
          ? await decrypt(quote.note as string, encryptionKey)
          : "",
      }))
    );

    return decryptedQuotes;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch quotes by tag");
  }
};

export const updateQuoteTags = async (quoteId: string, tagIds: string[]) => {
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
    // Verify that all tags exist and belong to the user
    if (tagIds.length > 0) {
      const existingTags = await db
        .select({ id: tags.id })
        .from(tags)
        .where(and(eq(tags.userId, userId), inArray(tags.id, tagIds)));

      const validTagIds = existingTags.map((tag) => tag.id);

      // First, remove all existing quote-tag connections for this quote
      await db
        .delete(quoteTags)
        .where(
          and(eq(quoteTags.userId, userId), eq(quoteTags.quoteId, quoteId))
        );

      // Create new connections only for valid tags
      if (validTagIds.length > 0) {
        const newQuoteTags = validTagIds.map((tagId) => ({
          userId,
          quoteId,
          tagId,
        }));

        await db.insert(quoteTags).values(newQuoteTags);
      }
    } else {
      // If no tags provided, just remove existing connections
      await db
        .delete(quoteTags)
        .where(
          and(eq(quoteTags.userId, userId), eq(quoteTags.quoteId, quoteId))
        );
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating quote tags:", error);
    throw new Error("Failed to update quote tags");
  }
};

export const getUnusedTagsForSource = async (sourceId?: string) => {
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

  if (!sourceId) {
    throw new Error("No Source");
  }

  try {
    // If sourceId is provided, first get all tag IDs that are linked to this source
    const linkedTagIds = (
      await db
        .select({
          tagId: sourceTags.tagId,
        })
        .from(sourceTags)
        .where(
          and(eq(sourceTags.sourceId, sourceId), eq(sourceTags.userId, userId))
        )
    ).map((t) => t.tagId);

    // Then get all tags that are NOT in the linked tags array
    const allTags = await db
      .select({
        id: tags.id,
        title: tags.title,
        description: tags.description,
      })
      .from(tags)
      .where(and(eq(tags.userId, userId), not(inArray(tags.id, linkedTagIds))))
      .orderBy(asc(tags.title));

    return allTags;
  } catch (error) {
    console.error("Error fetching user tags:", error);
    throw new Error("Failed to fetch tags");
  }
};

export const addExistingTagToSource = async (
  sourceId: string,
  tagId: string
) => {
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
    // Check if the tag exists and belongs to the user
    const tagExists = await db.query.tags.findFirst({
      where: and(eq(tags.id, tagId), eq(tags.userId, userId)),
    });

    if (!tagExists) {
      throw new Error("Tag not found");
    }

    // Check if the source exists and belongs to the user
    const sourceExists = await db.query.sources.findFirst({
      where: and(eq(sources.id, sourceId), eq(sources.userId, userId)),
    });

    if (!sourceExists) {
      throw new Error("Source not found");
    }

    // Check if the connection already exists
    const existingConnection = await db.query.sourceTags.findFirst({
      where: and(
        eq(sourceTags.sourceId, sourceId),
        eq(sourceTags.tagId, tagId),
        eq(sourceTags.userId, userId)
      ),
    });

    if (existingConnection) {
      return { success: true }; // Connection already exists
    }

    // Create the new connection
    await db.insert(sourceTags).values({
      userId,
      sourceId,
      tagId,
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding existing tag to source:", error);
    throw new Error("Failed to add tag to source");
  }
};

export const generateBlindSpotsAnalysis =
  async (): Promise<BlindSpotsResponse> => {
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

    // Get user's profile to check AI usage
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Check AI usage limits
    const canUseAI = await calculateAiUsage(profile);
    if (!canUseAI) {
      throw new Error("AI usage limit reached");
    }

    // Fetch all user's books
    const userBooks = await db.query.sources.findMany({
      where: and(eq(sources.userId, userId), eq(sources.ignored, false)),
    });

    if (userBooks.length === 0) {
      throw new Error("No books found for analysis");
    }

    const books = userBooks.map((book) => ({
      title: book.title,
      author: book.author || "Unknown Author",
      subtitle: book.subtitle || undefined,
    }));

    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(process.env.AI_GOOGLE_KEY!);
    const model = genAI.getGenerativeModel({
      model: process.env.AI_GOOGLE_MODEL!,
    });

    const prompt = `Analyze these books:
  ${JSON.stringify(books, null, 2)}

  Provide a reading pattern analysis and identify potential blind spots in the reader's book selection.
  Return the response as a JSON object with this exact structure:
  {
    "blindSpots": [
      {
        "category": "string",
        "description": "string",
        "recommendations": [
          {
            "title": "string",
            "author": "string",
            "reason": "string"
          }
        ]
      }
    ],
    "patterns": ["string"],
    "suggestedTopics": ["string"]
  }`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const analysis = await cleanAndParseJSONFromAi(text);
      if (!analysis) {
        throw new Error("Failed to parse AI response");
      }

      return analysis;
    } catch (error) {
      console.error("Error in generateBlindSpotsAnalysis:", error);
      throw new Error("Failed to generate analysis");
    }
  };

export const calculateAiUsage = async (profile: Profile) => {
  const aiInputCostPerM = parseFloat(process.env.AI_INPUT_COST_PER_M || "0");
  const aiOutputCostPerM = parseFloat(process.env.AI_OUTPUT_COST_PER_M || "0");
  const aiDollarLimit = parseFloat(process.env.AI_DOLLAR_LIMIT || "99999");

  if (!profile) {
    throw new Error("Profile is required for AI usage calculation.");
  }

  const aiInputTokensUsed = profile.aiInputTokensUsed || 0;
  const aiOutputTokensUsed = profile.aiOutputTokensUsed || 0;

  const costOfInput = (aiInputTokensUsed / 1000000) * aiInputCostPerM;
  const costOfOutput = (aiOutputTokensUsed / 1000000) * aiOutputCostPerM;
  const totalCost = costOfInput + costOfOutput;

  let percentageUsed = (totalCost / aiDollarLimit) * 100;
  percentageUsed = Math.ceil(percentageUsed * 100) / 100;

  return percentageUsed;
};

export const getSettings = async () => {
  const { userId }: { userId: string | null } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const profile = await getProfile();
  const capicitiesSpaces = await capicitiesGetSpaces(profile);
  const unearthedKeys = await getUnearthedKeys(profile);

  const notionAuthData = JSON.parse(profile.notionAuthData || "{}");

  const aiPercentageUsed = await calculateAiUsage(profile);

  return {
    profile,
    capicitiesSpaces,
    unearthedKeys,
    notionWorkspace: notionAuthData.workspace_name || "",
    aiPercentageUsed,
  };
};

export async function cleanAndParseJSONFromAi(text: string | null | undefined) {
  if (!text) return null;

  // First remove markdown code blocks and trim
  text = text
    .replace(/```json\s*/g, "")
    .replace(/```\s*$/g, "")
    .trim();

  try {
    // First try: direct parse
    return JSON.parse(text);
  } catch (e) {
    try {
      // Second try: clean up various quote issues and escapes
      let cleaned = text
        .replace(/\\:/g, ":") // Replace \: with :
        .replace(/\\\"/g, '"') // Replace \" with "
        .replace(/\\n/g, "\n") // Replace \n with actual newlines
        .replace(/\\\\/g, "\\") // Replace \\ with \
        .replace(/\\'/g, "'") // Replace \' with '
        .replace(/[\u2018\u2019]/g, "'") // Replace smart single quotes
        .replace(/[\u201C\u201D]/g, '"') // Replace smart double quotes
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .replace(/\\(?!["\\/bfnrt])/g, "") // Remove unnecessary escapes
        .trim();

      // If the string doesn't start with {, wrap it
      if (!cleaned.startsWith("{")) {
        cleaned = `{${cleaned}}`;
      }

      // Ensure proper JSON structure
      if (!cleaned.endsWith("}")) {
        cleaned = `${cleaned}}`;
      }

      return JSON.parse(cleaned);
    } catch (e) {
      try {
        const questionMatch = text.match(
          /["']?question["']?\s*:?\s*["']([^"]+)["']/i
        );
        const answerMatch = text.match(
          /["']?answer["']?\s*:?\s*["']([^"]+)["']/i
        );

        if (questionMatch?.[1] || answerMatch?.[1]) {
          return {
            question: questionMatch?.[1]?.trim() || "Failed to parse question",
            answer: answerMatch?.[1]?.trim() || "Failed to parse answer",
          };
        }

        // Fourth try: split on question/answer keywords
        const parts = text.split(/["']?(question|answer)["']?\s*:?\s*["']/i);
        if (parts.length >= 3) {
          return {
            question:
              parts[2]?.split('"')[0]?.trim() || "Failed to parse question",
            answer: parts[3]?.split('"')[0]?.trim() || "Failed to parse answer",
          };
        }

        // If all else fails, return null
        return null;
      } catch (e) {
        console.error("Final parsing attempt failed:", e);
        return null;
      }
    }
  }
}

export async function getAllTags() {
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
    // First get all tags
    const tagsResult = await db
      .select({
        id: tags.id,
        title: tags.title,
        description: tags.description,
      })
      .from(tags)
      .where(eq(tags.userId, userId))
      .orderBy(asc(tags.title));

    // Get the count of sources for each tag
    const sourceCountsResult = await db
      .select({
        tagId: sourceTags.tagId,
        count: count(),
      })
      .from(sourceTags)
      .where(eq(sourceTags.userId, userId))
      .groupBy(sourceTags.tagId);

    // Get the count of quotes for each tag
    const quoteCountsResult = await db
      .select({
        tagId: quoteTags.tagId,
        count: count(),
      })
      .from(quoteTags)
      .where(eq(quoteTags.userId, userId))
      .groupBy(quoteTags.tagId);

    // Create maps for both source and quote counts
    const sourceCountMap = new Map(
      sourceCountsResult.map(({ tagId, count }) => [tagId, count])
    );
    const quoteCountMap = new Map(
      quoteCountsResult.map(({ tagId, count }) => [tagId, count])
    );

    // Combine all the results
    const result = tagsResult.map((tag) => ({
      ...tag,
      sourceCount: sourceCountMap.get(tag.id) || 0,
      quoteCount: quoteCountMap.get(tag.id) || 0,
    }));

    return result;
  } catch (error) {
    console.error("Error fetching user tags:", error);
    throw new Error("Failed to fetch tags");
  }
}

export async function getTagDetails(tagId: string) {
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
    throw new Error("No encryption key");
  }

  try {
    // First get the tag details
    const tag = await db.query.tags.findFirst({
      where: and(eq(tags.id, tagId), eq(tags.userId, userId)),
      columns: {
        id: true,
        title: true,
        description: true,
      },
    });

    if (!tag) return null;

    // Get sources for this tag with media
    const taggedSources = await db
      .select({
        id: sources.id,
        title: sources.title,
        author: sources.author,
        media: {
          url: media.url,
        },
      })
      .from(sourceTags)
      .innerJoin(sources, eq(sources.id, sourceTags.sourceId))
      .leftJoin(media, eq(sources.mediaId, media.id))
      .where(and(eq(sourceTags.userId, userId), eq(sourceTags.tagId, tagId)))
      .execute();

    // Get quotes for this tag
    const taggedQuotes = await db
      .select({
        id: quotes.id,
        content: quotes.content,
        note: quotes.note,
        location: quotes.location,
        color: quotes.color,
        source: {
          id: sources.id,
          title: sources.title,
          author: sources.author,
          origin: sources.origin,
        },
      })
      .from(quoteTags)
      .innerJoin(quotes, eq(quotes.id, quoteTags.quoteId))
      .innerJoin(sources, eq(sources.id, quotes.sourceId))
      .where(and(eq(quoteTags.tagId, tagId), eq(quotes.userId, userId)))
      .execute();

    // Decrypt the notes in taggedQuotes
    const decryptedQuotes = await Promise.all(
      taggedQuotes.map(async (quote) => {
        const sourceMedia = taggedSources.find(
          (s) => s.id === quote.source.id
        )?.media;
        return {
          ...quote,
          note: quote.note
            ? await decrypt(quote.note as string, encryptionKey)
            : "",
          source: {
            ...quote.source,
            media: sourceMedia,
          },
        };
      })
    );

    return {
      ...tag,
      sources: taggedSources,
      quotes: decryptedQuotes,
    };
  } catch (error) {
    console.error("Error fetching tag details:", error);
    throw new Error("Failed to fetch tag details");
  }
}

export const deleteTag = async (tagId: string) => {
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
    // First remove any quote-tag connections
    await db
      .delete(quoteTags)
      .where(and(eq(quoteTags.userId, userId), eq(quoteTags.tagId, tagId)));

    // Then remove the source-tag connections
    await db
      .delete(sourceTags)
      .where(and(eq(sourceTags.userId, userId), eq(sourceTags.tagId, tagId)));

    // Finally delete the tag itself
    await db
      .delete(tags)
      .where(and(eq(tags.id, tagId), eq(tags.userId, userId)));

    return { success: true };
  } catch (error) {
    console.error("Error deleting tag:", error);
    throw new Error("Failed to delete tag");
  }
};

export const unlinkQuoteFromTag = async (quoteId: string, tagId: string) => {
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
    // Remove the specific quote-tag connection
    await db
      .delete(quoteTags)
      .where(
        and(
          eq(quoteTags.userId, userId),
          eq(quoteTags.quoteId, quoteId),
          eq(quoteTags.tagId, tagId)
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Error unlinking quote from tag:", error);
    throw new Error("Failed to unlink quote from tag");
  }
};

export const unlinkSourceFromTag = async (sourceId: string, tagId: string) => {
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
    // Get all quotes from this source that are linked to this tag
    const linkedQuotes = await db
      .select({ quoteId: quotes.id })
      .from(quotes)
      .where(and(eq(quotes.sourceId, sourceId), eq(quotes.userId, userId)));

    const quoteIds = linkedQuotes.map((q) => q.quoteId);

    // Remove quote-tag connections for all quotes from this source
    if (quoteIds.length > 0) {
      await db
        .delete(quoteTags)
        .where(
          and(
            eq(quoteTags.userId, userId),
            eq(quoteTags.tagId, tagId),
            inArray(quoteTags.quoteId, quoteIds)
          )
        );
    }

    // Remove the source-tag connection
    await db
      .delete(sourceTags)
      .where(
        and(
          eq(sourceTags.userId, userId),
          eq(sourceTags.sourceId, sourceId),
          eq(sourceTags.tagId, tagId)
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Error unlinking source from tag:", error);
    throw new Error("Failed to unlink source from tag");
  }
};

export const updateTag = async (
  tagId: string,
  title: string,
  description: string
) => {
  const { userId } = await auth();
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
    throw new Error("Premium required");
  }

  try {
    await db.update(tags).set({ title, description }).where(eq(tags.id, tagId));
  } catch (error) {
    console.error("Error updating tag:", error);
    throw new Error("Failed to update tag");
  }
};

export const deleteAllTags = async () => {
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
    // First remove all quote-tag connections
    await db.delete(quoteTags).where(eq(quoteTags.userId, userId));

    // Then remove all source-tag connections
    await db.delete(sourceTags).where(eq(sourceTags.userId, userId));

    // Finally delete all tags
    await db.delete(tags).where(eq(tags.userId, userId));

    return { success: true };
  } catch (error) {
    console.error("Error deleting all tags:", error);
    throw new Error("Failed to delete all tags");
  }
};

export const deleteOrphanedTags = async () => {
  const { userId }: { userId: string | null } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  let isPremium = false;
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    isPremium = user.privateMetadata.isPremium as boolean;
  } catch (error) {
    console.error("Error checking premium status:", error);
  }

  if (!isPremium) {
    throw new Error("User not allowed");
  }

  try {
    // Find tags that have no connections in either sourceTags or quoteTags
    const tagsToDelete = await db
      .select({ id: tags.id })
      .from(tags)
      .leftJoin(
        sourceTags,
        and(eq(tags.id, sourceTags.tagId), eq(tags.userId, sourceTags.userId))
      )
      .leftJoin(
        quoteTags,
        and(eq(tags.id, quoteTags.tagId), eq(tags.userId, quoteTags.userId))
      )
      .where(
        and(
          eq(tags.userId, userId),
          isNull(sourceTags.tagId),
          isNull(quoteTags.tagId)
        )
      );

    if (tagsToDelete.length === 0) {
      return { success: true, deletedCount: 0 };
    }

    const tagIds = tagsToDelete.map((tag) => tag.id);

    // Delete the orphaned tags
    await db
      .delete(tags)
      .where(and(eq(tags.userId, userId), inArray(tags.id, tagIds)));

    return { success: true, deletedCount: tagIds.length };
  } catch (error) {
    console.error("Error deleting orphaned tags:", error);
    throw new Error("Failed to delete orphaned tags");
  }
};

export const updateBookDetails = async (
  bookId: string,
  title: string,
  subtitle: string | null,
  author: string | null,
  asin: string | null
) => {
  const { userId } = await auth();
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
    throw new Error("Premium required");
  }

  try {
    await db
      .update(sources)
      .set({
        title,
        subtitle,
        author,
        asin,
      })
      .where(and(eq(sources.id, bookId), eq(sources.userId, userId)));

    return { success: true };
  } catch (error) {
    console.error("Error updating book details:", error);
    throw new Error("Failed to update book details");
  }
};

export const getBookNetworkData = async () => {
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

  // Get all sources
  const sourcesResult = await db.query.sources.findMany({
    where: and(
      eq(sources.userId, userId),
      eq(sources.type, "BOOK"),
      eq(sources.ignored, false)
    ),
  });

  if (!sourcesResult.length) {
    return { sources: [], quotes: [], tags: [], sourceTags: [], quoteTags: [] };
  }

  // Get all quotes for these sources
  const quotesResult = await db.query.quotes.findMany({
    where: inArray(
      quotes.sourceId,
      sourcesResult.map((s) => s.id)
    ),
  });

  // Decrypt quotes notes
  const decryptedQuotes = await Promise.all(
    quotesResult.map(async (quote) => ({
      ...quote,
      note: quote.note
        ? await decrypt(quote.note as string, encryptionKey)
        : "",
    }))
  );

  // Get source tags for all sources
  const sourceTagsRelations = await db.query.sourceTags.findMany({
    where: and(
      eq(sourceTags.userId, userId),
      inArray(
        sourceTags.sourceId,
        sourcesResult.map((s) => s.id)
      )
    ),
  });

  // Get quote tags for all quotes
  const quoteTagsRelations = await db.query.quoteTags.findMany({
    where: and(
      eq(quoteTags.userId, userId),
      inArray(
        quoteTags.quoteId,
        decryptedQuotes.map((q) => q.id)
      )
    ),
  });

  // Get only the connected tag IDs
  const connectedTagIds = new Set([
    ...sourceTagsRelations.map((st) => st.tagId),
    ...quoteTagsRelations.map((qt) => qt.tagId),
  ]);

  const tagsResult = await db.query.tags.findMany({
    where: and(
      eq(tags.userId, userId)
      // inArray(tags.id, Array.from(connectedTagIds))
    ),
  });

  // Transform the data into the network format
  const networkData = {
    sources: sourcesResult.map((source) => ({
      id: source.id,
      title: source.title,
      author: source.author || "",
      userId: source.userId,
      createdAt: source.createdAt,
    })),
    quotes: decryptedQuotes.map((quote) => ({
      id: quote.id,
      content: quote.content,
      sourceId: quote.sourceId,
      note: quote.note || "",
    })),
    tags: tagsResult.map((tag) => ({
      id: tag.id,
      title: tag.title,
      description: tag.description || "",
    })),
    sourceTags: sourceTagsRelations.map((st) => ({
      id: `st-${st.tagId}`,
      sourceId: st.sourceId,
      tagId: st.tagId,
    })),
    quoteTags: quoteTagsRelations.map((qt) => ({
      id: `qt-${qt.quoteId}-${qt.tagId}`,
      quoteId: qt.quoteId,
      tagId: qt.tagId,
    })),
  };

  return networkData;
};

export const applyTagGlobally = async (tagId: string) => {
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
    // Get the tag details
    const tag = await db.query.tags.findFirst({
      where: and(eq(tags.id, tagId), eq(tags.userId, userId)),
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    // Get all quotes for the user
    const userQuotes = await db.query.quotes.findMany({
      where: eq(quotes.userId, userId),
    });

    // Decrypt quotes and check for matches
    const matchingQuoteIds: string[] = [];

    for (const quote of userQuotes) {
      const decryptedNote = quote.note
        ? await decrypt(quote.note as string, encryptionKey)
        : "";

      const searchText = `${quote.content} ${decryptedNote}`.toLowerCase();
      const tagTitle = tag.title.toLowerCase();

      if (searchText.includes(tagTitle)) {
        matchingQuoteIds.push(quote.id);
      }
    }
    const quoteTagsExisting = await db.query.quoteTags.findMany({
      where: and(eq(quoteTags.tagId, tagId), eq(quotes.userId, userId)),
    });

    // Filter out quotes that are already linked to this tag
    const filteredMatchingQuoteIds = matchingQuoteIds.filter(
      (quoteId) =>
        !quoteTagsExisting.some(
          (qt) => qt.quoteId === quoteId && qt.tagId === tagId
        )
    );

    if (filteredMatchingQuoteIds.length > 0) {
      // Create quote-tag connections
      const quoteTagConnections = filteredMatchingQuoteIds.map((quoteId) => ({
        userId,
        quoteId,
        tagId,
      }));

      // Insert connections, ignoring duplicates
      await db
        .insert(quoteTags)
        .values(quoteTagConnections)
        .onConflictDoNothing();

      // Get the sources for these quotes
      const quoteSources = await db.query.quotes.findMany({
        where: inArray(quotes.id, filteredMatchingQuoteIds),
        columns: {
          sourceId: true,
        },
      });

      // Get unique source IDs
      const uniqueSourceIds = [...new Set(quoteSources.map((q) => q.sourceId))];

      // Get existing source-tag connections to avoid duplicates
      const existingSourceTags = await db.query.sourceTags.findMany({
        where: and(
          eq(sourceTags.tagId, tagId),
          inArray(sourceTags.sourceId, uniqueSourceIds)
        ),
      });

      // Filter out sources that already have the tag
      const sourceIdsToLink = uniqueSourceIds.filter(
        (sourceId) => !existingSourceTags.some((st) => st.sourceId === sourceId)
      );

      if (sourceIdsToLink.length > 0) {
        // Create source-tag connections
        const sourceTagConnections = sourceIdsToLink.map((sourceId) => ({
          userId,
          sourceId,
          tagId,
        }));

        // Insert connections, ignoring duplicates
        await db
          .insert(sourceTags)
          .values(sourceTagConnections)
          .onConflictDoNothing();
      }
    }

    return {
      success: true,
      matchCount: filteredMatchingQuoteIds.length,
    };
  } catch (error) {
    console.error("Error applying tag globally:", error);
    throw new Error("Failed to apply tag globally");
  }
};
