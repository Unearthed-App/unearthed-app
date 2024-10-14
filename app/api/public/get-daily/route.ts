import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { z } from "zod";
import { and, eq, isNotNull } from "drizzle-orm";
import {
  dailyQuotes,
  insertDailyQuotesSchema,
  profiles,
  quotes,
  selectProfileSchema,
  selectQuoteSchema,
  selectQuoteWithRelationsSchema,
  selectSourceSchema,
  sources,
} from "@/db/schema";
import bcrypt from "bcrypt";
import { decrypt } from "@/lib/auth/encryptionKey";
import { clerkClient } from "@clerk/nextjs/server";
import { getTodaysDate } from "@/lib/utils";
type QuoteWithRelations = z.infer<typeof selectQuoteWithRelationsSchema>;
type DailyQuote = z.infer<typeof insertDailyQuotesSchema>;
type Source = z.infer<typeof selectSourceSchema>;
type Quote = z.infer<typeof selectQuoteSchema>;
type Profile = z.infer<typeof selectProfileSchema>;

interface DailyReflection {
  source: Source;
  quote: Quote;
}

// Function to verify API key
async function verifyApiKeyGetProfile(providedApiKey: string) {
  // Fetch all profiles with non-null API keys
  const potentialProfiles = await db.query.profiles.findMany({
    where: and(isNotNull(profiles.userId), isNotNull(profiles.unearthedApiKey)),
  });

  console.log("potentialProfiles", potentialProfiles);

  // Check the provided key against each stored hash
  for (const profile of potentialProfiles) {
    const isMatch = await bcrypt.compare(
      providedApiKey,
      profile.unearthedApiKey!
    );
    if (isMatch) {
      return profile;
    }
  }

  return false;
}

export async function GET() {
  const headersList = headers();
  const authHeader = headersList.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = authHeader.split(" ")[1];

  if (!apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await verifyApiKeyGetProfile(apiKey);

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await clerkClient().users.getUser(profile.userId);
    const encryptionKey = user.privateMetadata.encryptionKey as string;

    let dailyReflection = await getDailyReflection(
      profile.userId,
      profile.utcOffset as number,
      encryptionKey
    );

    if (!dailyReflection) {
      dailyReflection = (await createDailyReflection(
        profile,
        encryptionKey
      )) as DailyReflection;
    }

    return NextResponse.json({
      success: true,
      data: { dailyReflection },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
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
      .where(and(eq(dailyQuotes.day, todaysDate), eq(sources.userId, userId)))
      .leftJoin(quotes, eq(quotes.id, dailyQuotes.quoteId))
      .leftJoin(sources, eq(sources.id, quotes.sourceId))) as any;

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
        source: dailyQuoteWithRelationsResult.sources,
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
    let randomSource: Source;
    let randomQuote: QuoteWithRelations;

    if (!profile.userId) {
      throw new Error("Profile not found");
    }

    const todaysDate = await getTodaysDate(
      profile.utcOffset ? profile.utcOffset : 0
    );

    const quotesResult = await db.query.quotes.findMany({
      with: {
        source: true,
      },
      where: and(eq(quotes.userId, profile.userId)),
    });

    // remove any quotes that have sources that are not ignored:true
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
    randomSource = randomQuote.source;

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
    return { source: randomSource, quote: randomQuote };
  } catch (error) {
    console.error(error);
    return {};
  }
};
