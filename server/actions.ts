"use server";

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
} from "@/db/schema";
import {
  decrypt,
  generateApiKey,
  getOrCreateEncryptionKey,
} from "@/lib/auth/encryptionKey";
import { getTodaysDate } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { and, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

const { Client } = require("@notionhq/client");

type SourceWithRelations = z.infer<typeof selectSourceWithRelationsSchema>;
type QuoteWithRelations = z.infer<typeof selectQuoteWithRelationsSchema>;
type Quote = z.infer<typeof selectQuoteSchema>;
type Source = z.infer<typeof selectSourceSchema>;
type Profile = z.infer<typeof insertProfileSchema>;
type DailyQuote = z.infer<typeof insertDailyQuotesSchema>;

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
      unearthedApiKey: toReturn.unearthedApiKey
        ? await decrypt(toReturn.unearthedApiKey as string, encryptionKey)
        : "",
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

export const generateNewUnearthedApiKey = async () => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const unearthedApiKey = await generateApiKey();

    return unearthedApiKey;
  } catch (error) {
    console.error(error);
    return { error: "Error occurred" };
  }
};

export const capicitiesGetSpaces = async () => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const profile = await getProfile();

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
  const capicitiesSpaces = await capicitiesGetSpaces();

  const notionAuthData = JSON.parse(profile.notionAuthData || "{}");

  return {
    profile,
    capicitiesSpaces,
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
        })
        .onConflictDoNothing()
        .returning();

      profile = newProfile[0];
    }

    const todaysDate = await getTodaysDate(
      profile.utcOffset ? profile.utcOffset : 0
    );

    let dailyQuoteWithRelationsResult = (await db
      .select()
      .from(dailyQuotes)
      .where(and(eq(dailyQuotes.day, todaysDate), eq(sources.userId, userId)))
      .leftJoin(quotes, eq(quotes.id, dailyQuotes.quoteId))
      .leftJoin(sources, eq(sources.id, quotes.sourceId))) as any;

    if (dailyQuoteWithRelationsResult.length > 0) {
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
        source: true,
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

  const booksResult = await db
    .select()
    .from(sources)
    .where(
      and(
        or(
          ilike(sources.title, `%${query}%`),
          ilike(sources.subtitle, `%${query}%`),
          ilike(sources.author, `%${query}%`)
        ),
        eq(sources.type, "BOOK"),
        eq(sources.ignored, false),
        eq(sources.userId, userId)
      )
    );

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

export const syncToNotion = async ({
  newConnection,
}: {
  newConnection?: true | false | "";
}) => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    return { success: false };
  }
  const profile = await getProfile();
  if (!profile) {
    return { success: false };
  }

  const encryptionKey = await getOrCreateEncryptionKey();
  if (!encryptionKey) {
    return { success: false };
  }

  const notionAuthData = JSON.parse(profile.notionAuthData || "{}");
  if (!notionAuthData || !notionAuthData.access_token) {
    return { success: false };
  }

  const notion = new Client({ auth: notionAuthData.access_token });
  const notionUserId = notionAuthData.owner?.user?.id;
  if (!notionUserId) {
    return { success: false };
  }

  let notionBooksDatabaseId;

  if (!profile.notionDatabaseId || newConnection) {
    const newDatabase = await notion.databases.create({
      parent: {
        type: "page_id",
        page_id: notionAuthData.duplicated_template_id,
      },
      icon: {
        type: "emoji",
        emoji: "📚",
      },
      cover: {
        type: "external",
        external: {
          url: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
        },
      },
      title: [
        {
          type: "text",
          text: {
            content: "Sources",
            link: null,
          },
        },
      ],
      properties: {
        Title: { title: {} },
        Subtitle: { rich_text: {} },
        Author: { rich_text: {} },
        Image: { files: {} },
        Origin: { rich_text: {} },
      },
    });

    if (newDatabase.id) {
      notionBooksDatabaseId = newDatabase.id;

      const result = await db
        .update(profiles)
        .set({
          notionDatabaseId: notionBooksDatabaseId,
        })
        .where(eq(profiles.userId, userId));
    }
  } else {
    notionBooksDatabaseId = profile.notionDatabaseId;
  }

  if (!notionBooksDatabaseId) {
    return { success: false };
  }

  const books = await getBooks({
    ignored: false,
  });

  if (!books || books.length === 0) {
    return { success: true, message: "No books to sync" };
  }

  const response = await notion.databases.query({
    database_id: notionBooksDatabaseId,
  });

  let booksInNotionAlreadyKeys: string[] = [];
  let notionBookContentPerBook: any[] = [];
  for (const page of response.results) {
    const key: string = `${page.properties.Title.title[0].plain_text} ${page.properties.Subtitle.rich_text[0].plain_text}`;
    booksInNotionAlreadyKeys.push(key);

    let allQuotePlainText: string[] = [];
    let hasMore = true;
    let startCursor = undefined;

    while (hasMore) {
      const {
        results,
        has_more,
        next_cursor,
      }: {
        results: any[];
        has_more: boolean;
        next_cursor: string | undefined;
      } = await notion.blocks.children.list({
        block_id: page.id,
        start_cursor: startCursor,
        page_size: 100,
      });

      const quotePlainText = results
        .filter((block) => block.type === "quote")
        .map((block) =>
          block.quote.rich_text
            .map(
              (richTextObject: { plain_text: string }) =>
                richTextObject.plain_text
            )
            .join("")
        );
      allQuotePlainText = allQuotePlainText.concat(quotePlainText);

      hasMore = has_more;
      startCursor = next_cursor;
    }

    notionBookContentPerBook.push({
      blockId: page.id,
      key: key,
      allQuotePlainText: allQuotePlainText,
    });
  }

  const booksInNotionAlready = [];

  const MAX_CHILDREN = 100; // Notion child block limit

  for (const book of books) {
    if (booksInNotionAlreadyKeys.includes(`${book.title} ${book.subtitle}`)) {
      booksInNotionAlready.push(book);
      continue;
    }

    let childQuotes = [];

    childQuotes.push({
      type: "heading_2",
      heading_2: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "Quotes and Notes",
            },
          },
        ],
      },
    });

    for (const quote of book.quotes) {
      let notionColor = "gray";
      const lowerCaseColor = quote.color?.toLowerCase();

      if (lowerCaseColor?.includes("grey")) {
        notionColor = "gray";
      } else if (lowerCaseColor?.includes("yellow")) {
        notionColor = "yellow";
      } else if (lowerCaseColor?.includes("blue")) {
        notionColor = "blue";
      } else if (lowerCaseColor?.includes("pink")) {
        notionColor = "pink";
      } else if (lowerCaseColor?.includes("orange")) {
        notionColor = "orange";
      }

      childQuotes.push({
        type: "quote",
        quote: {
          rich_text: [
            {
              type: "text",
              text: {
                content: quote.content || "No quote...",
              },
            },
          ],
          color: notionColor,
          children: [],
        },
      });

      if (quote.note) {
        childQuotes.push({
          type: "callout",
          callout: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: await decrypt(quote.note, encryptionKey),
                  link: null,
                },
              },
            ],
            icon: {
              emoji: "📝",
            },
            color: "default",
          },
        });
      }
      childQuotes.push({
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: ("📍 " + quote.location) as string,
                link: null,
              },
            },
          ],
          color: "gray",
        },
      });

      childQuotes.push({
        type: "divider",
        divider: {},
      });
    }

    const notionBook = await notion.pages.create({
      parent: { database_id: notionBooksDatabaseId },
      cover: {
        type: "external",
        external: {
          url: book.imageUrl || null,
        },
      },
      properties: {
        Title: {
          title: [
            {
              type: "text",
              text: {
                content: book.title || "Untitled",
              },
            },
          ],
        },
        Subtitle: {
          rich_text: [
            {
              type: "text",
              text: {
                content: book.subtitle || "",
              },
            },
          ],
        },
        Author: {
          rich_text: [
            {
              type: "text",
              text: {
                content: book.author || "Unknown",
              },
            },
          ],
        },
        Image: {
          files: [
            {
              name: "Book Cover",
              type: "external",
              external: {
                url: book.imageUrl || null,
              },
            },
          ],
        },
        Origin: {
          rich_text: [
            {
              type: "text",
              text: {
                content: book.origin || "",
              },
            },
          ],
        },
      },
    });

    for (let i = 0; i < childQuotes.length; i += MAX_CHILDREN) {
      const childBatch = childQuotes.slice(i, i + MAX_CHILDREN);

      await notion.blocks.children.append({
        block_id: notionBook.id,
        children: childBatch,
      });
    }
  }

  // now check the existing books and add in any quotes that are not there already
  for (const book of booksInNotionAlready) {
    // find the corresponding notion book
    const key = `${book.title} ${book.subtitle}`;

    let matchingNotionBook: {
      blockId: string;
      key: string;
      allQuotePlainText: string[];
    } = { blockId: "", key: "", allQuotePlainText: [] };

    notionBookContentPerBook.forEach((book) => {
      if (key === book.key) {
        matchingNotionBook = book;
        return;
      }
    });

    let moreQuotesToAdd = [];

    for (const quote of book.quotes) {
      if (matchingNotionBook.allQuotePlainText.includes(quote.content)) {
        continue;
      }

      let notionColor = "gray";
      const lowerCaseColor = quote.color?.toLowerCase();

      if (lowerCaseColor?.includes("grey")) {
        notionColor = "gray";
      } else if (lowerCaseColor?.includes("yellow")) {
        notionColor = "yellow";
      } else if (lowerCaseColor?.includes("blue")) {
        notionColor = "blue";
      } else if (lowerCaseColor?.includes("pink")) {
        notionColor = "pink";
      } else if (lowerCaseColor?.includes("orange")) {
        notionColor = "orange";
      }

      moreQuotesToAdd.push({
        type: "quote",
        quote: {
          rich_text: [
            {
              type: "text",
              text: {
                content: quote.content || "No quote...",
              },
            },
          ],
          color: notionColor,
          children: [],
        },
      });

      if (quote.note) {
        moreQuotesToAdd.push({
          type: "callout",
          callout: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: await decrypt(quote.note, encryptionKey),
                  link: null,
                },
              },
            ],
            icon: {
              emoji: "📝",
            },
            color: "default",
          },
        });
      }

      moreQuotesToAdd.push({
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: ("📍 " + quote.location) as string,
                link: null,
              },
            },
          ],
          color: "gray",
        },
      });

      moreQuotesToAdd.push({
        type: "divider",
        divider: {},
      });
    }

    if (moreQuotesToAdd.length > 0) {
      const response = await notion.blocks.children.append({
        block_id: matchingNotionBook.blockId,
        children: moreQuotesToAdd,
      });
    }
  }

  return { success: true };
};
