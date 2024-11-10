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
import { and, eq, inArray, isNotNull } from "drizzle-orm";
import PostHogClient from "@/app/posthog";
import { clerkClient } from "@clerk/nextjs/server";
import { Resend } from "resend";
import { getTodaysDate } from "@/lib/utils";

import {
  profiles,
  selectProfileSchema,
  sources,
  selectQuoteSchema,
  insertDailyQuotesSchema,
  quotes,
  dailyQuotes,
  selectQuoteWithRelationsSchema,
  selectSourceSchema,
  media,
} from "@/db/schema";
import { decrypt } from "@/lib/auth/encryptionKey";
import { z } from "zod";
import { capacitiesFormatDaily } from "@/server/actions";

type QuoteWithRelations = z.infer<typeof selectQuoteWithRelationsSchema>;
type Source = z.infer<typeof selectSourceSchema>;
type Quote = z.infer<typeof selectQuoteSchema>;
type Profile = z.infer<typeof selectProfileSchema>;
type DailyQuote = z.infer<typeof insertDailyQuotesSchema>;

interface DailyReflection {
  id: string;
  capacitiesUpdated: boolean;
  source: Source;
  quote: Quote;
}

export async function GET() {
  const posthogClient = PostHogClient();
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  const validToken = process.env.CRON_TOKEN;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  if (token !== validToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profileResults = await db.query.profiles.findMany({
    where: and(
      isNotNull(profiles.capacitiesApiKey),
      isNotNull(profiles.capacitiesSpaceId),
      eq(profiles.userStatus, "ACTIVE")
    ),
  });

  let dailyQuoteIdsToUpdate: string[] = [];

  for (const profile of profileResults) {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(profile.userId);

      const encryptionKey = user.privateMetadata.encryptionKey as string;

      if (!encryptionKey) {
        continue;
      }

      if (!profile || !profile.utcOffset) {
        continue;
      }

      const dailyReflectionExisting = (await getDailyReflection(
        profile.userId,
        profile.utcOffset as number,
        encryptionKey
      )) as DailyReflection;

      if (
        dailyReflectionExisting &&
        dailyReflectionExisting.capacitiesUpdated
      ) {
        continue;
      }

      let dailyReflection;
      if (dailyReflectionExisting) {
        dailyReflection = dailyReflectionExisting;
      } else {
        dailyReflection = (await createDailyReflection(
          profile,
          encryptionKey
        )) as DailyReflection;
      }

      profile.capacitiesApiKey = profile.capacitiesApiKey
        ? await decrypt(profile.capacitiesApiKey as string, encryptionKey)
        : "";

      profile.capacitiesSpaceId = profile.capacitiesSpaceId
        ? await decrypt(profile.capacitiesSpaceId as string, encryptionKey)
        : "";

      await addDailyToCapacities(profile, dailyReflection);

      dailyQuoteIdsToUpdate.push(dailyReflection.id);
    } catch (error) {
      console.log("error", error);

      posthogClient.capture({
        distinctId: profile.userId,
        event: `send-email ERROR`,
        properties: {
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
        },
      });
      continue;
    }
  }
  if (dailyQuoteIdsToUpdate.length > 0) {
    await db
      .update(dailyQuotes)
      .set({
        capacitiesUpdated: true,
      })
      .where(inArray(dailyQuotes.id, dailyQuoteIdsToUpdate));
  }

  return NextResponse.json({ success: true }, { status: 200 });
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
        id: dailyQuoteResult.id,
        capacitiesUpdated: dailyQuoteResult.capacitiesUpdated,
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
    return {
      id: newDailyQuote[0].id,
      capacitiesUpdated: newDailyQuote[0].capacitiesUpdated,
      source: randomSource,
      quote: randomQuote,
    };
  } catch (error) {
    console.error(error);
    return {};
  }
};

const addDailyToCapacities = async (
  profile: Profile,
  dailyReflection: DailyReflection
) => {
  const { source, quote } = dailyReflection;
  const sourceTitle = source.title;
  const sourceAuthor = source.author;
  const quoteContent = quote.content;
  const quoteNote = quote.note;
  const quoteLocation = quote.location;

  if (!profile.capacitiesSpaceId) {
    return false;
  }

  const mdText = await capacitiesFormatDaily(
    sourceTitle as string,
    sourceAuthor as string,
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
