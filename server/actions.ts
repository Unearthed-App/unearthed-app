"use server";

import { db } from "@/db";
import {
  books,
  insertBookSchema,
  insertQuoteSchema,
  selectBookWithRelationsSchema,
  selectQuoteSchema,
  insertDailyQuotesSchema,
  quotes,
  selectBookSchema,
  insertProfileSchema,
  profiles,
  selectProfileSchema,
  dailyQuotes,
  selectQuoteWithRelationsSchema,
} from "@/db/schema";
import {
  decrypt,
  encrypt,
  generateApiKey,
  getOrCreateEncryptionKey,
} from "@/lib/auth/encryptionKey";
import { getTodaysDate } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { and, eq, ilike, like, or } from "drizzle-orm";
import { z } from "zod";

type BookWithRelations = z.infer<typeof selectBookWithRelationsSchema>;
type QuoteWithRelations = z.infer<typeof selectQuoteWithRelationsSchema>;
type Quote = z.infer<typeof selectQuoteSchema>;
type Book = z.infer<typeof selectBookSchema>;
type Profile = z.infer<typeof insertProfileSchema>;
type DailyQuote = z.infer<typeof insertDailyQuotesSchema>;

const InsertQuotesArraySchema = z.array(insertQuoteSchema);
const BATCH_SIZE = 100;

export const getBook = async (
  bookId: string
): Promise<BookWithRelations | { error: string }> => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const encryptionKey = await getOrCreateEncryptionKey();
  if (!encryptionKey) {
    throw new Error("User not authenticated");
  }

  try {
    const dbResult = await db.query.books.findFirst({
      with: {
        quotes: true,
      },
      where: and(eq(books.id, bookId), eq(books.userId, userId)),
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

    const validatedData = selectBookWithRelationsSchema.parse(decryptedResult);

    return validatedData;
  } catch (error) {
    console.error(error);
    return { error: "Error occurred" };
  }
};

export const syncBooks = async () => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const allBooks = await getBooks({ status: "" });

    const pendingBooks = allBooks.filter(
      (book) => book.status === "PENDING" && book.userId === userId
    );

    if (pendingBooks.length == 0) {
      return { error: "No pending books" };
    }

    const activeBooks = allBooks.filter(
      (book) => book.status === "ACTIVE" && book.userId === userId
    );

    const BooksArraySchema = z.array(insertBookSchema);
    const pendingBooksStripped = BooksArraySchema.parse(
      pendingBooks.map(
        ({ title, subtitle, author, status, imageUrl, ...book }) => ({
          title,
          subtitle,
          author,
          imageUrl,
          status: "ACTIVE",
          userId: userId,
          ignored: false,
        })
      )
    );

    const result = await db
      .insert(books)
      .values(pendingBooksStripped)
      .onConflictDoNothing()
      .returning();

    let bookIdLookup: any = [];
    activeBooks.forEach(async (book) => {
      let key = `${book.title}|${book.author}`;
      bookIdLookup[key] = book.id;
    });

    result.forEach(async (book) => {
      let key = `${book.title}|${book.author}`;
      bookIdLookup[key] = book.id;
    });

    const allQuotes = pendingBooks.flatMap((book) =>
      book.quotes.map(({ content, note, color, location }) => ({
        content,
        note, // note does not need to be encrypted here because it was already encrypted from the quotes-insert api route
        color,
        location,
        bookId: bookIdLookup[`${book.title}|${book.author}`],
        userId: userId,
        status: "ACTIVE",
      }))
    );

    const validatedQuotes = InsertQuotesArraySchema.parse(allQuotes);

    // Split the quotes into batches
    const batches: any = [];
    for (let i = 0; i < validatedQuotes.length; i += BATCH_SIZE) {
      batches.push(validatedQuotes.slice(i, i + BATCH_SIZE));
    }

    // Use a transaction for all inserts
    await db.transaction(async (tx) => {
      for (const batch of batches) {
        await tx.insert(quotes).values(batch).onConflictDoNothing();
      }
    });

    await db
      .delete(books)
      .where(and(eq(books.status, "PENDING"), eq(books.userId, userId)));

    return { status: "OK" };
  } catch (error) {
    console.error(error);
    return { error: "Error occured" };
  }
};

export const getBooks = async ({
  status,
  ignored,
}: {
  status?: "PENDING" | "ACTIVE" | "";
  ignored?: true | false | "";
}): Promise<BookWithRelations[]> => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    let where;

    // Handle the case where 'ignored' is not provided or is an empty string
    if (ignored === "" || ignored === null || ignored === undefined) {
      where = status
        ? and(eq(books.status, status), eq(books.userId, userId))
        : eq(books.userId, userId);
    } else {
      where = status
        ? and(
            eq(books.status, status),
            eq(books.ignored, ignored),
            eq(books.userId, userId)
          )
        : and(eq(books.ignored, ignored), eq(books.userId, userId));
    }

    const dbResult = await db.query.books.findMany({
      with: {
        quotes: true,
      },
      where,
    });
    const validatedData = z
      .array(selectBookWithRelationsSchema)
      .parse(dbResult);

    return validatedData;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getBookTitles = async (
  status?: "PENDING" | "ACTIVE" | ""
): Promise<Book[]> => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    return [];
  }
  try {
    const where = status
      ? and(eq(books.status, status), eq(books.userId, userId))
      : eq(books.userId, userId);

    const dbResult = await db.query.books.findMany({
      where,
    });
    const validatedData = z.array(selectBookSchema).parse(dbResult);

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
      .update(books)
      .set({ ignored: ignored })
      .where(and(eq(books.id, bookId), eq(books.userId, userId)));
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

  console.log("profile", profile);

  return { profile, capicitiesSpaces };
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
    let randomBook: Book;
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
      .where(and(eq(dailyQuotes.day, todaysDate), eq(books.userId, userId)))
      .leftJoin(quotes, eq(quotes.id, dailyQuotes.quoteId))
      .leftJoin(books, eq(books.id, quotes.bookId))) as any;

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
        book: dailyQuoteWithRelationsResult.books,
        quote: dailyQuoteWithRelationsResult.quotes,
      };
    }

    const quotesResult = await db.query.quotes.findMany({
      with: {
        book: true,
      },
      where: and(eq(quotes.userId, userId)),
    });

    // remove any quotes that have books that are not status:'ACTIVE' and are not ignored:true
    const quotesResultFiltered = quotesResult.filter((quote) => {
      if (quote.book) {
        return quote.book.status === "ACTIVE" && quote.book.ignored === false;
      }
    });

    if (quotesResultFiltered.length == 0) {
      return {};
    }

    const randomQuoteIndex = Math.floor(
      Math.random() * quotesResultFiltered.length
    );
    randomQuote = quotesResultFiltered[randomQuoteIndex] as QuoteWithRelations;

    randomBook = randomQuote.book;

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
        // userId: userId,
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
  book: Book;
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
  books: Book[];
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
    .from(books)
    .where(
      and(
        or(
          ilike(books.title, `%${query}%`),
          ilike(books.subtitle, `%${query}%`),
          ilike(books.author, `%${query}%`)
        ),
        eq(books.status, "ACTIVE"),
        eq(books.ignored, false),
        eq(books.userId, userId)
      )
    );

  const dbResult = await db.query.quotes.findMany({
    with: {
      book: true,
    },
    where: eq(quotes.userId, userId),
  });

  // Decrypt and filter quotes asynchronously based on decrypted note and content
  const filteredResults = await Promise.all(
    dbResult.map(async (quote) => {
      if (quote.book.ignored) {
        return null;
      }

      if (quote.book.status == "PENDING") {
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
