import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { and, eq, isNotNull } from "drizzle-orm";
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
  selectSourceSchema,
} from "@/db/schema";
import { decrypt } from "@/lib/auth/encryptionKey";
import { z } from "zod";

type QuoteWithRelations = z.infer<typeof selectQuoteWithRelationsSchema>;
type Source = z.infer<typeof selectSourceSchema>;
type Quote = z.infer<typeof selectQuoteSchema>;
type Profile = z.infer<typeof selectProfileSchema>;
type DailyQuote = z.infer<typeof insertDailyQuotesSchema>;

interface DailyReflection {
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
    where: and(
      isNotNull(profiles.capacitiesApiKey),
      isNotNull(profiles.capacitiesSpaceId),
      eq(profiles.userStatus, "ACTIVE")
    ),
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

  console.log("premiumUsers", premiumUsers);

  for (const user of premiumUsers) {
    console.log("user.emailAddresses", user.emailAddresses);
    try {
      const encryptionKey = user.privateMetadata.encryptionKey as string;

      if (!encryptionKey) {
        continue;
      }

      const profile = profileResults.find(
        (profile) => profile.userId === user.id
      );

      if (!profile) {
        continue;
      }

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


      const sendData = {
        from: "Unearthed <contact@unearthed.app>",
        to: [user.emailAddresses[0].emailAddress],
        subject: "Daily Reflection",
        react: DailyEmail({
          title: dailyReflection.source.title,
          author: dailyReflection.source.author as string,
          subtitle: dailyReflection.source.subtitle as string,
          imageUrl: dailyReflection.source.imageUrl as string,
          content: dailyReflection.quote.content as string,
          note: dailyReflection.quote.note as string,
          location: dailyReflection.quote.location as string,
          color: dailyReflection.quote.color as string,
        }),
      };

      console.log("dailyReflection", dailyReflection);
      console.log("sendData", sendData);
      const { data, error } = await resend.emails.send(sendData);

      if (error) {
        return Response.json({ error }, { status: 500 });
      }

      return Response.json(data);
    } catch (error) {
      posthogClient.capture({
        distinctId: user.id,
        event: `send-email ERROR`,
        properties: {
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
        },
      });
      return Response.json({ error }, { status: 500 });
    }
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
