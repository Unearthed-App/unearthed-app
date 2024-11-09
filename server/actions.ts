"use server";

import PostHogClient from "@/app/posthog";
import { db } from "@/db";
import {
  sources,
  selectSourceWithRelationsSchema,
  selectQuoteSchema,
  insertDailyQuotesSchema,
  quotes,
  selectSourceSchema,
  insertProfileSchema,
  profiles,
  selectProfileSchema,
  dailyQuotes,
  selectQuoteWithRelationsSchema,
  selectUnearthedKeySchema,
  unearthedKeys,
  notionSourceJobsOne,
  notionSourceJobsTwo,
  notionSourceJobsThree,
  // notionSourceJobsFour,
  insertNotionSourceJobsOneSchema,
  media,
} from "@/db/schema";
import {
  decrypt,
  generateApiKey,
  getOrCreateEncryptionKey,
  hashApiKey,
} from "@/lib/auth/encryptionKey";
import { getTodaysDate, splitArray } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { and, eq, ilike, inArray, isNotNull, not, or } from "drizzle-orm";
import { z } from "zod";

const { Client } = require("@notionhq/client");

type SourceWithRelations = z.infer<typeof selectSourceWithRelationsSchema>;
type QuoteWithRelations = z.infer<typeof selectQuoteWithRelationsSchema>;
type Quote = z.infer<typeof selectQuoteSchema>;
type Source = z.infer<typeof selectSourceSchema>;
type Profile = z.infer<typeof insertProfileSchema>;
type DailyQuote = z.infer<typeof insertDailyQuotesSchema>;
type NotionSourceJobsOneInsert = z.infer<
  typeof insertNotionSourceJobsOneSchema
>;
export const getBook = async (
  bookId: string
): Promise<SourceWithRelations | { error: string }> => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const encryptionKey = await getOrCreateEncryptionKey();
  if (!encryptionKey) {
    throw new Error("User not authenticated");
  }

  try {
    const dbResult = await db.query.sources.findFirst({
      with: {
        quotes: true,
        media: true,
      },
      where: and(eq(sources.id, bookId), eq(sources.userId, userId)),
    });

    if (!dbResult) {
      throw new Error("Book not found");
    }

    const decryptedQuotes = await Promise.all(
      dbResult.quotes.map(async (quote) => ({
        ...quote,
        note: quote.note
          ? await decrypt(quote.note as string, encryptionKey)
          : "",
      }))
    );

    const decryptedResult = {
      ...dbResult,
      quotes: decryptedQuotes,
    };

    const validatedData =
      selectSourceWithRelationsSchema.parse(decryptedResult);

    return validatedData;
  } catch (error) {
    console.error(error);
    return { error: "Error occurred" };
  }
};

export const getBooks = async ({
  ignored,
}: {
  ignored?: true | false | "";
}): Promise<SourceWithRelations[]> => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    let where;

    // Handle the case where 'ignored' is not provided or is an empty string
    if (ignored === "" || ignored === null || ignored === undefined) {
      where = and(eq(sources.type, "BOOK"), eq(sources.userId, userId));
    } else {
      where = and(
        eq(sources.type, "BOOK"),
        eq(sources.ignored, ignored),
        eq(sources.userId, userId)
      );
    }

    const dbResult = await db.query.sources.findMany({
      with: {
        quotes: true,
        media: true,
      },
      where,
    });
    const validatedData = z
      .array(selectSourceWithRelationsSchema)
      .parse(dbResult);

    return validatedData;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getBookTitles = async (): Promise<Source[]> => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    return [];
  }
  try {
    const dbResult = await db.query.sources.findMany({
      where: and(eq(sources.type, "BOOK"), eq(sources.userId, userId)),
    });
    const validatedData = z.array(selectSourceSchema).parse(dbResult);

    return validatedData;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const toggleIgnoredBook = async ({
  bookId,
  ignored,
}: {
  bookId: string;
  ignored: boolean;
}): Promise<{ status: string } | { error: string }> => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    await db
      .update(sources)
      .set({ ignored: ignored })
      .where(and(eq(sources.id, bookId), eq(sources.userId, userId)));
    return { status: "OK" };
  } catch (error) {
    console.error(error);
    return { error: "Error occurred" };
  }
};

export const getProfile = async (): Promise<Profile> => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const encryptionKey = await getOrCreateEncryptionKey();
  if (!encryptionKey) {
    throw new Error("User not authenticated");
  }

  try {
    let toReturn: Profile;

    const dbResult = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (!dbResult) {
      return {};
    } else {
      toReturn = dbResult;
    }

    const decryptedResult = {
      ...toReturn,
      capacitiesApiKey: toReturn.capacitiesApiKey
        ? await decrypt(toReturn.capacitiesApiKey as string, encryptionKey)
        : "",
      capacitiesSpaceId: toReturn.capacitiesSpaceId
        ? await decrypt(toReturn.capacitiesSpaceId as string, encryptionKey)
        : "",
      notionAuthData: toReturn.notionAuthData
        ? await decrypt(toReturn.notionAuthData as string, encryptionKey)
        : "",
    };
    const validatedData = selectProfileSchema.parse(decryptedResult);
    return validatedData;
  } catch (error) {
    console.error(error);
    return {};
  }
};

const capicitiesGetSpaces = async (profile: Profile) => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  if (!profile.capacitiesApiKey) {
    return false;
  }

  try {
    const response = await fetch("https://api.capacities.io/spaces", {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${profile.capacitiesApiKey}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    let data = await response.json();
    if (data.spaces) {
      return data.spaces;
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const getSettings = async () => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const profile = await getProfile();
  const capicitiesSpaces = await capicitiesGetSpaces(profile);
  const unearthedKeys = await getUnearthedKeys(profile);

  const notionAuthData = JSON.parse(profile.notionAuthData || "{}");

  return {
    profile,
    capicitiesSpaces,
    unearthedKeys,
    notionWorkspace: notionAuthData.workspace_name || "",
  };
};

export const getOrCreateDailyReflection = async ({
  replaceDailyQuote = false,
  utcOffset = 0,
}: {
  replaceDailyQuote?: true | false;
  utcOffset?: number;
} = {}) => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const encryptionKey = await getOrCreateEncryptionKey();
  if (!encryptionKey) {
    throw new Error("User not authenticated");
  }

  try {
    let randomBook: Source;
    let randomQuote: QuoteWithRelations;

    let profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (!profile) {
      const newProfile = await db
        .insert(profiles)
        .values({
          utcOffset,
          userId,
          userStatus: "ACTIVE",
        })
        .onConflictDoNothing()
        .returning();

      profile = newProfile[0];
    }

    if (!profile.utcOffset) {
      const result = await db
        .update(profiles)
        .set({
          utcOffset: utcOffset,
        })
        .where(eq(profiles.userId, userId));
    }

    const todaysDate = await getTodaysDate(
      profile.utcOffset ? profile.utcOffset : 0
    );

    let dailyQuoteWithRelationsResult = (await db
      .select()
      .from(dailyQuotes)
      .where(
        and(eq(dailyQuotes.day, todaysDate), eq(dailyQuotes.userId, userId))
      )
      .leftJoin(quotes, eq(quotes.id, dailyQuotes.quoteId))
      .leftJoin(sources, eq(sources.id, quotes.sourceId))
      .leftJoin(media, eq(media.id, sources.mediaId))) as any;


    if (dailyQuoteWithRelationsResult.length > 0) {
      dailyQuoteWithRelationsResult = dailyQuoteWithRelationsResult.map(
        (item: any) => {
          const { media, ...rest } = item;
          return {
            ...rest,
            sources: {
              ...rest.sources,
              media: media || {},
            },
          };
        }
      );

      dailyQuoteWithRelationsResult = dailyQuoteWithRelationsResult[0];
    }

    const dailyQuoteResult = dailyQuoteWithRelationsResult.daily_quotes;

    // if there is already one and we aren't making a new one, just return it
    if (dailyQuoteResult && !replaceDailyQuote) {
      dailyQuoteWithRelationsResult.quotes.note = dailyQuoteWithRelationsResult
        .quotes.note
        ? await decrypt(
            dailyQuoteWithRelationsResult.quotes.note,
            encryptionKey
          )
        : "";

      return {
        book: dailyQuoteWithRelationsResult.sources,
        quote: dailyQuoteWithRelationsResult.quotes,
      };
    }

    const quotesResult = await db.query.quotes.findMany({
      with: {
        source: {with: {media: true}},
      },
      where: and(eq(quotes.userId, userId)),
    });

    // remove any quotes that have books that are not ignored:true
    const quotesResultFiltered = quotesResult.filter((quote) => {
      if (quote.source) {
        return quote.source.ignored === false;
      }
    });

    if (quotesResultFiltered.length == 0) {
      return {};
    }

    const randomQuoteIndex = Math.floor(
      Math.random() * quotesResultFiltered.length
    );
    randomQuote = quotesResultFiltered[randomQuoteIndex] as QuoteWithRelations;

    randomBook = randomQuote.source;

    if (!dailyQuoteResult) {
      const toInsert = {
        quoteId: randomQuote.id,
        day: todaysDate,
        userId: userId,
      } as DailyQuote;

      const newDailyQuote = await db
        .insert(dailyQuotes)
        .values(toInsert)
        .onConflictDoNothing()
        .returning();

      randomQuote.note = randomQuote.note
        ? await decrypt(randomQuote.note, encryptionKey)
        : "";

      await addPassedDailyToCapacities({
        book: randomBook,
        quote: randomQuote,
      });

      return { book: randomBook, quote: randomQuote };
    }

    // if there is already one and we are making a new one, update it
    if (dailyQuoteResult && replaceDailyQuote) {
      const toSet = {
        quoteId: randomQuote.id,
      };

      const updatedDailyQuote = await db
        .update(dailyQuotes)
        .set(toSet)
        .where(
          and(
            eq(dailyQuotes.id, dailyQuoteResult.id),
            eq(dailyQuotes.userId, userId)
          )
        )
        .returning();

      randomQuote.note = randomQuote.note
        ? await decrypt(randomQuote.note, encryptionKey)
        : "";

      await addPassedDailyToCapacities({
        book: randomBook,
        quote: randomQuote,
      });

      return { book: randomBook, quote: randomQuote };
    }

    return {};
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const addDailyToCapacities = async () => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const dailyReflection = await getOrCreateDailyReflection();
  const { book, quote } = dailyReflection;
  const bookTitle = book.title;
  const bookAuthor = book.author;
  const quoteContent = quote.content;
  const quoteNote = quote.note;
  const quoteLocation = quote.location;
  const profile = await getProfile();

  const encryptionKey = await getOrCreateEncryptionKey();
  if (!encryptionKey) {
    throw new Error("User not authenticated");
  }

  if (!profile.capacitiesSpaceId) {
    return false;
  }

  const mdText = await capacitiesFormatDaily(
    bookTitle as string,
    bookAuthor as string,
    quoteContent as string,
    quoteNote as string,
    quoteLocation as string
  );

  const body = {
    spaceId: profile.capacitiesSpaceId,
    mdText: mdText,
    origin: "commandPalette",
    noTimeStamp: true,
  };
  try {
    const response = await fetch(
      "https://api.capacities.io/save-to-daily-note",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${profile.capacitiesApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const data = await response.text();
    return { status: "OK" };
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const addPassedDailyToCapacities = async (dailyReflection: {
  book: Source;
  quote: Quote;
}) => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    return false;
  }

  const profile = await getProfile();

  if (!profile.capacitiesSpaceId) {
    return false;
  }

  const encryptionKey = await getOrCreateEncryptionKey();
  if (!encryptionKey) {
    throw new Error("No encryption key");
  }

  const { book, quote } = dailyReflection;
  const bookTitle = book.title;
  const bookAuthor = book.author;
  const quoteContent = quote.content;
  let quoteNote = quote.note;
  try {
    quoteNote = quote.note
      ? await decrypt(quote.note as string, encryptionKey)
      : "";
  } catch (decryptError) {
    console.error("Decryption error:", decryptError);
  }

  const quoteLocation = quote.location;

  const mdText = await capacitiesFormatDaily(
    bookTitle as string,
    bookAuthor as string,
    quoteContent as string,
    quoteNote as string,
    quoteLocation as string
  );

  const body = {
    spaceId: profile.capacitiesSpaceId,
    mdText: mdText,
    origin: "commandPalette",
    noTimeStamp: true,
  };
  try {
    const response = await fetch(
      "https://api.capacities.io/save-to-daily-note",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${profile.capacitiesApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const data = await response.text();
    return { status: "OK" };
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const capacitiesFormatDaily = async (
  bookTitle?: string,
  bookAuthor?: string,
  quoteContent?: string,
  quoteNote?: string,
  quoteLocation?: string
) => {
  let toReturn = `
---
## 🔥 Remember This?
### [[book/${bookTitle}]]
#### [[person/${bookAuthor}]]

> ${quoteContent}

**Location:** ${quoteLocation}
`;

  if (quoteNote) {
    toReturn += `

**My note:** ${quoteNote}

---
`;
  }

  return toReturn;
};

export const search = async (
  query: string
): Promise<{
  books: Source[];
  quotes: QuoteWithRelations[];
}> => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
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

  const quotesResult = await db.query.quotes.findMany({
    with: {
      source: true,
    },
    where: and(
      or(
        ilike(quotes.content, `%${query}%`),
        ilike(quotes.location, `%${query}%`)
      ),
      eq(quotes.userId, userId)
    ),
  });

  return { books: booksResult, quotes: quotesResult };
};

export const syncToNotion = async () => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
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

export const syncSourceToNotion = async (sourceId: string) => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    return { success: false };
  }

  const profile = await getProfile();

  // delete all existing jobs for first
  await db
    .delete(notionSourceJobsOne)
    .where(eq(notionSourceJobsOne.sourceId, sourceId));
  await db
    .delete(notionSourceJobsTwo)
    .where(eq(notionSourceJobsTwo.sourceId, sourceId));
  await db
    .delete(notionSourceJobsThree)
    .where(eq(notionSourceJobsThree.sourceId, sourceId));
  // await db
  //   .delete(notionSourceJobsFour)
  //   .where(eq(notionSourceJobsFour.sourceId, sourceId));

  // insert job
  await db
    .insert(notionSourceJobsOne)
    .values({
      sourceId: sourceId,
      status: "READY",
      profileId: profile.id!,
      newConnection: false,
    })
    .onConflictDoNothing();

  return { success: true };
};

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  delay: number = INITIAL_RETRY_DELAY
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      if (attempt === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  throw new Error("Max retries reached");
}

export const firstNotionSync = async (): Promise<{
  success: boolean;
  error?: string;
  sources?: z.infer<typeof selectSourceWithRelationsSchema>[];
}> => {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "No user ID" };

  const profile = await getProfile();
  const notionAuthData = JSON.parse(profile.notionAuthData || "{}");
  if (!notionAuthData || !notionAuthData.access_token) {
    return { success: false, error: "No valid Notion auth data" };
  }

  const notion = new Client({ auth: notionAuthData.access_token });
  const notionUserId = notionAuthData.owner?.user?.id;
  if (!notionUserId) return { success: false, error: "No Notion user ID" };

  const posthogClient = PostHogClient();

  let notionBooksDatabaseId: string;

  try {
    const newDatabase = await retryOperation(async () =>
      notion.databases.create({
        parent: {
          type: "page_id",
          page_id: notionAuthData.duplicated_template_id,
        },
        icon: { type: "emoji", emoji: "📚" },
        cover: {
          type: "external",
          external: {
            url: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
          },
        },
        title: [{ type: "text", text: { content: "Sources", link: null } }],
        properties: {
          Title: { title: {} },
          Subtitle: { rich_text: {} },
          Author: { rich_text: {} },
          Image: { files: {} },
          Origin: { rich_text: {} },
        },
      })
    );

    if (newDatabase.id) {
      notionBooksDatabaseId = newDatabase.id;
      await db
        .update(profiles)
        .set({ notionDatabaseId: notionBooksDatabaseId })
        .where(eq(profiles.userId, userId));
    } else {
      throw new Error("Failed to get Notion database ID");
    }
  } catch (error) {
    console.error("Failed to create Notion database:", error);
    return { success: false, error: "Failed to create Notion database" };
  }

  try {
    const dbResult = await db.query.sources.findMany({
      with: { quotes: true, media: true },
      where: and(
        eq(sources.type, "BOOK"),
        eq(sources.ignored, false),
        eq(sources.userId, userId)
      ),
    });

    posthogClient.capture({
      distinctId: userId,
      event: `firstNotionSync`,
      properties: {
        sourcesLength: dbResult ? dbResult.length : 0,
      },
    });

    const sourcesResult = z
      .array(selectSourceWithRelationsSchema)
      .parse(dbResult);

    if (!sourcesResult || sourcesResult.length === 0) {
      return { success: false, error: "No sources found" };
    }

    return { success: true, sources: sourcesResult };
  } catch (error) {
    console.error("Error querying sources:", error);
    posthogClient.capture({
      distinctId: userId,
      event: `firstNotionSync Error`,
      properties: {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    });
    return { success: false, error: "Failed to query sources" };
  }
};

const getUnearthedKeys = async (profile: Profile) => {
  const dbResult = await db.query.unearthedKeys.findMany({
    where: eq(unearthedKeys.userId, profile.userId!),
  });
  const validatedData = z.array(selectUnearthedKeySchema).parse(dbResult);

  return validatedData;
};

export const deleteUnearthedKey = async ({ id }: { id: string }) => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    return { success: false };
  }

  try {
    const result = await db
      .delete(unearthedKeys)
      .where(and(eq(unearthedKeys.id, id), eq(unearthedKeys.userId, userId)));

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};

export const generateAndSaveUnearthedKey = async ({
  name,
}: {
  name: string;
}) => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    return { success: false };
  }

  const newKey = await generateApiKey();
  const newKeyHash = await hashApiKey(newKey as string);

  try {
    const newKeyEntry = await db
      .insert(unearthedKeys)
      .values({
        userId,
        key: newKeyHash,
        name,
      })
      .onConflictDoNothing()
      .returning();

    return { success: true, newKey };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};

export const createEmptyProfile = async ({
  utcOffset = 0,
}: {
  utcOffset?: number;
} = {}) => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const newProfile = await db
      .insert(profiles)
      .values({
        utcOffset,
        userId,
        userStatus: "ACTIVE",
      })
      .onConflictDoNothing()
      .returning();

    return { success: true, profile: newProfile[0] };
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const deleteSource = async ({ source }: { source: Source }) => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    await db
      .delete(notionSourceJobsOne)
      .where(eq(notionSourceJobsOne.sourceId, source.id));

    await db
      .delete(notionSourceJobsTwo)
      .where(eq(notionSourceJobsTwo.sourceId, source.id));

    await db
      .delete(notionSourceJobsThree)
      .where(eq(notionSourceJobsThree.sourceId, source.id));
    // await db
    //   .delete(notionSourceJobsFour)
    //   .where(eq(notionSourceJobsFour.sourceId, source.id));

    // delete daily quotes associated with the source
    const quoteIds = await db
      .select({ id: quotes.id })
      .from(quotes)
      .where(and(eq(quotes.sourceId, source.id), eq(quotes.userId, userId)));

    const quoteIdArray = quoteIds.map((q) => q.id);

    if (quoteIdArray.length > 0) {
      await db
        .delete(dailyQuotes)
        .where(
          and(
            inArray(dailyQuotes.quoteId, quoteIdArray),
            eq(dailyQuotes.userId, userId)
          )
        );
    }

    // delete the source
    await db
      .delete(sources)
      .where(and(eq(sources.id, source.id), eq(sources.userId, userId)));

    // delete any media associated with the source
    if (source.mediaId) {
      await db
        .delete(media)
        .where(and(eq(media.id, source.mediaId), eq(media.userId, userId)));
    }

    return {};
  } catch (error) {
    console.error(error);
    return false;
  }
};
