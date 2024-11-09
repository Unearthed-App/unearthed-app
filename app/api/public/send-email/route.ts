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
import { and, eq, inArray } from "drizzle-orm";
import PostHogClient from "@/app/posthog";
import { clerkClient } from "@clerk/nextjs/server";
import DailyEmail from "@/emails/daily-email";
import { Resend } from "resend";
import { getTodaysDate } from "@/lib/utils";
const resend = new Resend(process.env.RESEND_API_KEY);

import {
  profiles,
  selectProfileSchema,
  sources,
  selectQuoteSchema,
  insertDailyQuotesSchema,
  quotes,
  dailyQuotes,
  selectQuoteWithRelationsSchema,
  selectSourceWithRelationsSchema,
  media,
} from "@/db/schema";
import { decrypt } from "@/lib/auth/encryptionKey";
import { z } from "zod";

type QuoteWithRelations = z.infer<typeof selectQuoteWithRelationsSchema>;
type Source = z.infer<typeof selectSourceWithRelationsSchema>;
type Quote = z.infer<typeof selectQuoteSchema>;
type Profile = z.infer<typeof selectProfileSchema>;
type DailyQuote = z.infer<typeof insertDailyQuotesSchema>;

interface DailyReflection {
  id: string;
  emailSent: boolean;
  source: Source;
  quote: Quote;
}

export async function GET() {
  const posthogClient = PostHogClient();

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

  const profileResults = await db.query.profiles.findMany({
    where: and(eq(profiles.userStatus, "ACTIVE")),
  });

  const userIds = profileResults.map((profile) => profile.userId);
  let premiumUsers: any[] = [];
  for (const userId of userIds) {
    try {
      const user = await clerkClient().users.getUser(userId);
      const isPremium = user.privateMetadata.isPremium as boolean;

      if (isPremium) {
        premiumUsers.push(user);
      }
    } catch (error) {
      console.log(error);
    }
  }

  let dailyQuoteIdsToUpdate: string[] = [];

  for (const user of premiumUsers) {
    try {
      const encryptionKey = user.privateMetadata.encryptionKey as string;

      if (!encryptionKey) {
        continue;
      }

      posthogClient.capture({
        distinctId: user.id,
        event: `send-email ATTEMPTING`,
        properties: {
          sendTo: user.emailAddresses[0].emailAddress,
        },
      });

      const profile = profileResults.find(
        (profile) => profile.userId === user.id
      );

      if (!profile || !profile.utcOffset) {
        continue;
      }

      const dailyReflectionExisting = (await getDailyReflection(
        profile.userId,
        profile.utcOffset as number,
        encryptionKey
      )) as DailyReflection;

      if (dailyReflectionExisting && dailyReflectionExisting.emailSent) {
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

      const sendData = {
        from: "Unearthed <contact@unearthed.app>",
        to: [user.emailAddresses[0].emailAddress],
        subject: "Daily Reflection",
        react: DailyEmail({
          title: dailyReflection.source.title,
          author: dailyReflection.source.author as string,
          subtitle: dailyReflection.source.subtitle as string,
          imageUrl: dailyReflection.source.media
            ? (dailyReflection.source.media.url as string)
            : "",
          content: dailyReflection.quote.content as string,
          note: dailyReflection.quote.note as string,
          location: dailyReflection.quote.location as string,
          color: dailyReflection.quote.color as string,
        }),
      };

      const { data, error } = await resend.emails.send(sendData);

      dailyQuoteIdsToUpdate.push(dailyReflection.id);
      if (error) {
        posthogClient.capture({
          distinctId: user.id,
          event: `send-email ERROR 1`,
          properties: {
            message:
              error instanceof Error ? error.message : "Unknown error occurred",
          },
        });
        continue;
      } else {
        posthogClient.capture({
          distinctId: user.id,
          event: `send-email SENT`,
          properties: {
            sendTo: user.emailAddresses[0].emailAddress,
          },
        });
      }
    } catch (error) {
      console.log("error", error);

      posthogClient.capture({
        distinctId: user.id,
        event: `send-email ERROR 2`,
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
        emailSent: true,
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
        emailSent: dailyQuoteResult.emailSent,
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
        source: {
          with: {
            media: true,
          },
        },
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
    randomSource = randomQuote.source as Source;

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
      emailSent: newDailyQuote[0].emailSent,
      source: randomSource,
      quote: randomQuote,
    };
  } catch (error) {
    console.error(error);
    return {};
  }
};
