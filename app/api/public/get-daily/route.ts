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

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { z } from "zod";
import { and, eq, isNotNull } from "drizzle-orm";
import {
  dailyQuotes,
  insertDailyQuotesSchema,
  media,
  profiles,
  quotes,
  selectProfileSchema,
  selectQuoteSchema,
  selectQuoteWithRelationsSchema,
  selectSourceSchema,
  sources,
  unearthedKeys,
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

async function verifyApiKeyGetProfile(providedApiKey: string) {
  const potentialProfiles = await db.query.unearthedKeys.findMany({
    where: and(isNotNull(unearthedKeys.userId), isNotNull(unearthedKeys.key)),
  });

  for (const unearthedKey of potentialProfiles) {
    const isMatch = await bcrypt.compare(providedApiKey, unearthedKey.key!);
    if (isMatch) {
      const profile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, unearthedKey.userId),
      });
      return profile;
    }
  }

  return false;
}

export async function GET() {
  const headersList = await headers();
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

    const client = await clerkClient();
    const user = await client.users.getUser(profile.userId);
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
