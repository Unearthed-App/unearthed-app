import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { db } from "@/db";
import {
  books,
  selectQuoteSchema,
  insertDailyQuotesSchema,
  quotes,
  profiles,
  dailyQuotes,
  selectQuoteWithRelationsSchema,
  selectBookSchema,
  selectProfileSchema,
} from "@/db/schema";
import { decrypt } from "@/lib/auth/encryptionKey";
import { z } from "zod";

type QuoteWithRelations = z.infer<typeof selectQuoteWithRelationsSchema>;
type Book = z.infer<typeof selectBookSchema>;
type Quote = z.infer<typeof selectQuoteSchema>;
type Profile = z.infer<typeof selectProfileSchema>;
type DailyQuote = z.infer<typeof insertDailyQuotesSchema>;

import { clerkClient } from "@clerk/nextjs/server";
import { isNotNull, and, eq } from "drizzle-orm";
import { capacitiesFormatDaily } from "@/server/actions";
import { getTodaysDate } from "@/lib/utils";

interface DailyReflection {
  book: Book;
  quote: Quote;
}

export async function GET() {
  const headersList = headers();
  const authHeader = headersList.get("authorization");

  const validToken = process.env.CRON_TOKEN;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  if (token !== validToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dbResult = await db.query.profiles.findMany({
      where: and(
        isNotNull(profiles.capacitiesApiKey),
        isNotNull(profiles.capacitiesSpaceId)
      ),
    });

    for (const profile of dbResult) {
      try {
        const user = await clerkClient.users.getUser(profile.userId);

        const encryptionKey = user.privateMetadata.encryptionKey as string;

        const dailyReflectionExisting = await getDailyReflection(
          profile.userId,
          profile.utcOffset as number,
          encryptionKey
        );

        if (dailyReflectionExisting) {
          continue;
        }

        const dailyReflection = (await createDailyReflection(
          profile,
          encryptionKey
        )) as DailyReflection;

        profile.capacitiesApiKey = profile.capacitiesApiKey
          ? await decrypt(profile.capacitiesApiKey as string, encryptionKey)
          : "";

        profile.capacitiesSpaceId = profile.capacitiesSpaceId
          ? await decrypt(profile.capacitiesSpaceId as string, encryptionKey)
          : "";

        await addDailyToCapacities(profile, dailyReflection);
      } catch (error) {
        continue;
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

const getDailyReflection = async (
  userId: string,
  utcOffset: number,
  encryptionKey: string
) => {
  try {
    const todaysDate = await getTodaysDate(utcOffset ? utcOffset : 0);

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

    if (dailyQuoteResult) {
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
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return {};
  }
};

const createDailyReflection = async (
  profile: Profile,
  encryptionKey: string
) => {
  try {
    let randomBook: Book;
    let randomQuote: QuoteWithRelations;

    if (!profile.userId) {
      throw new Error("Profile not found");
    }

    const todaysDate = await getTodaysDate(
      profile.utcOffset ? profile.utcOffset : 0
    );

    const quotesResult = await db.query.quotes.findMany({
      with: {
        book: true,
      },
      where: and(eq(quotes.userId, profile.userId)),
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

    const toInsert = {
      quoteId: randomQuote.id,
      day: todaysDate,
      userId: profile.userId,
    } as DailyQuote;

    const newDailyQuote = await db
      .insert(dailyQuotes)
      .values(toInsert)
      .onConflictDoNothing()
      .returning();

    randomQuote.note = randomQuote.note
      ? await decrypt(randomQuote.note, encryptionKey)
      : "";
    return { book: randomBook, quote: randomQuote };
  } catch (error) {
    console.error(error);
    return {};
  }
};

const addDailyToCapacities = async (
  profile: Profile,
  dailyReflection: DailyReflection
) => {
  const { book, quote } = dailyReflection;
  const bookTitle = book.title;
  const bookAuthor = book.author;
  const quoteContent = quote.content;
  const quoteNote = quote.note;
  const quoteLocation = quote.location;

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
    return { mdText: mdText };
  } catch (error) {
    console.error(error);
    return {};
  }
};
