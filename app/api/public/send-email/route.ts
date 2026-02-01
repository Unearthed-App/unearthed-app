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
  selectSourceSchema,
  selectQuoteSchema,
  insertDailyQuotesSchema,
  quotes,
  dailyQuotes,
  selectQuoteWithRelationsSchema,
  selectMediaSchema,
} from "@/db/schema";
import { decrypt } from "@/lib/auth/encryptionKey";
import { z } from "zod";

type QuoteWithRelations = z.infer<typeof selectQuoteWithRelationsSchema>;
type Source = z.infer<typeof selectSourceSchema>;
type Quote = z.infer<typeof selectQuoteSchema>;
type Profile = z.infer<typeof selectProfileSchema>;
type DailyQuote = z.infer<typeof insertDailyQuotesSchema>;

interface DailyReflection {
  id: string;
  emailSent: boolean;
  source: Source & { media?: z.infer<typeof selectMediaSchema> | null };
  quote: Quote;
}

export async function GET() {
  const requestTimeout = new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error('Request timeout - processing took too long')), 60000)
  );

  const processEmails = async () => {
    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] Starting email processing job`);
    
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
      where: and(eq(profiles.userStatus, "ACTIVE")),
    });

    const userIds = profileResults.map((profile) => profile.userId);
    console.log(`[${new Date().toISOString()}] Found ${profileResults.length} active profiles`);
    
    // Fetch all users in parallel with timeout
    const userPromises = userIds.map(async (userId) => {
      try {
        const client = await clerkClient();
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Clerk API timeout')), 10000)
        );
        
        const userPromise = client.users.getUser(userId);
        const user = await Promise.race([userPromise, timeoutPromise]) as any;
        const isPremium = user.privateMetadata.isPremium as boolean;
        
        return isPremium ? user : null;
      } catch (error) {
        console.log(`Error fetching user ${userId}:`, error);
        return null;
      }
    });

    const userResults = await Promise.allSettled(userPromises);
    const premiumUsers = userResults
      .filter((result) => result.status === 'fulfilled' && result.value !== null)
      .map((result) => (result as PromiseFulfilledResult<any>).value);

    const failedUserFetches = userResults.filter((result) => result.status === 'rejected').length;
    console.log(`[${new Date().toISOString()}] Found ${premiumUsers.length} premium users, ${failedUserFetches} failed user fetches`);

    // Process users in parallel with concurrency limit
    const BATCH_SIZE = 5; // Process 5 users at a time to avoid overwhelming APIs
    let dailyQuoteIdsToUpdate: string[] = [];

    const processUser = async (user: any): Promise<string | null> => {
      try {
        const encryptionKey = user.privateMetadata.encryptionKey as string;

        if (!encryptionKey) {
          console.log(`[${new Date().toISOString()}] User ${user.id} missing encryption key`);
          return null;
        }

        const profile = profileResults.find(
          (profile) => profile.userId === user.id
        );

        if (!profile || profile.utcOffset == null || !profile.dailyEmails) {
          console.log(`[${new Date().toISOString()}] User ${user.id} profile invalid or daily emails disabled`);
          return null;
        }

        const dailyReflectionExisting = await getDailyReflection(
          profile.userId,
          profile.utcOffset as number,
          encryptionKey
        );

        if (dailyReflectionExisting && typeof dailyReflectionExisting === 'object' && 'emailSent' in dailyReflectionExisting && dailyReflectionExisting.emailSent) {
          return null;
        }

        let dailyReflection: DailyReflection | null = null;
        if (dailyReflectionExisting && typeof dailyReflectionExisting === 'object' && 'id' in dailyReflectionExisting) {
          dailyReflection = dailyReflectionExisting as DailyReflection;
        } else {
          const newReflection = await createDailyReflection(profile, encryptionKey);
          if (newReflection && typeof newReflection === 'object' && 'id' in newReflection) {
            dailyReflection = newReflection as DailyReflection;
          }
        }

        if (!dailyReflection || !dailyReflection.source) {
          console.log(`[${new Date().toISOString()}] User ${user.id} no source available for daily reflection`);
          return null;
        }

        posthogClient.capture({
          distinctId: user.id,
          event: `send-email ATTEMPTING`,
          properties: {
            sendTo: user.emailAddresses[0].emailAddress,
          },
        });

        const reflection = dailyReflection as DailyReflection;
        const sendData = {
          from: "Unearthed <contact@unearthed.app>",
          to: [user.emailAddresses[0].emailAddress],
          subject: "Daily Reflection",
          react: DailyEmail({
            title: reflection.source.title,
            author: reflection.source.author as string,
            subtitle: reflection.source.subtitle as string,
            imageUrl: reflection.source.media
              ? (reflection.source.media.url as string)
              : "",
            content: reflection.quote.content as string,
            note: reflection.quote.note as string,
            location: reflection.quote.location as string,
            color: reflection.quote.color as string,
          }),
        };

        // Add timeout to email sending
        const emailTimeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Email send timeout')), 15000)
        );
        
        const emailPromise = resend.emails.send(sendData);
        const { data, error } = await Promise.race([emailPromise, emailTimeoutPromise]) as any;

        if (error) {
          posthogClient.capture({
            distinctId: user.id,
            event: `send-email ERROR 1`,
            properties: {
              message:
                error instanceof Error ? error.message : "Unknown error occurred",
            },
          });
          return null;
        } else {
          posthogClient.capture({
            distinctId: user.id,
            event: `send-email SENT`,
            properties: {
              sendTo: user.emailAddresses[0].emailAddress,
            },
          });
          return reflection.id;
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
        return null;
      }
    };

    // Process users in batches
    for (let i = 0; i < premiumUsers.length; i += BATCH_SIZE) {
      const batchStartTime = Date.now();
      const batch = premiumUsers.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(processUser);
      const batchResults = await Promise.allSettled(batchPromises);
      
      const successfulIds = batchResults
        .filter((result) => result.status === 'fulfilled' && result.value !== null)
        .map((result) => (result as PromiseFulfilledResult<string | null>).value as string);
      
      const failedEmails = batchResults.filter((result) => result.status === 'rejected').length;
      const batchDuration = Date.now() - batchStartTime;
      
      console.log(`[${new Date().toISOString()}] Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${successfulIds.length} emails sent, ${failedEmails} failed, took ${batchDuration}ms`);
      
      dailyQuoteIdsToUpdate.push(...successfulIds);
    }

    if (dailyQuoteIdsToUpdate.length > 0) {
      await db
        .update(dailyQuotes)
        .set({
          emailSent: true,
        })
        .where(inArray(dailyQuotes.id, dailyQuoteIdsToUpdate));
      
      console.log(`[${new Date().toISOString()}] Updated ${dailyQuoteIdsToUpdate.length} daily quotes as emailSent=true`);
    }

    const totalDuration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] Email processing job completed in ${totalDuration}ms`);

    return NextResponse.json({ 
      success: true, 
      processed: premiumUsers.length,
      emailsSent: dailyQuoteIdsToUpdate.length,
      duration: totalDuration
    }, { status: 200 });
  };

  try {
    const result = await Promise.race([processEmails(), requestTimeout]);
    return result as NextResponse;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${new Date().toISOString()}] Request timeout or error:`, errorMessage);
    
    return NextResponse.json({ 
      error: 'Request timeout or processing error',
      message: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 504 });
  }
}

const getDailyReflection = async (
  userId: string,
  utcOffset: number,
  encryptionKey: string
): Promise<DailyReflection | false | {}> => {
  try {
    const todaysDate = await getTodaysDate(utcOffset ? utcOffset : 0);

    // Use Drizzle query builder for better optimization
    const dailyQuoteWithRelationsResult = await db.query.dailyQuotes.findFirst({
      where: and(eq(dailyQuotes.day, todaysDate), eq(dailyQuotes.userId, userId)),
      with: {
        quote: {
          with: {
            source: {
              with: {
                media: true,
              },
            },
          },
        },
      },
    });

    if (dailyQuoteWithRelationsResult && dailyQuoteWithRelationsResult.quote) {
      const decryptedNote = dailyQuoteWithRelationsResult.quote.note
        ? await decrypt(dailyQuoteWithRelationsResult.quote.note, encryptionKey)
        : "";

      return {
        id: dailyQuoteWithRelationsResult.id,
        emailSent: dailyQuoteWithRelationsResult.emailSent,
        source: dailyQuoteWithRelationsResult.quote.source as DailyReflection['source'],
        quote: {
          ...dailyQuoteWithRelationsResult.quote,
          note: decryptedNote,
        },
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
): Promise<DailyReflection | {}> => {
  try {
    if (!profile.userId) {
      throw new Error("Profile not found");
    }

    const todaysDate = await getTodaysDate(
      profile.utcOffset ? profile.utcOffset : 0
    );

    // Get quotes and filter by non-ignored sources
    const quotesResult = await db.query.quotes.findMany({
      with: {
        source: {
          with: {
            media: true,
          },
        },
      },
      where: eq(quotes.userId, profile.userId),
    });

    // Filter out quotes with ignored sources
    const quotesResultFiltered = quotesResult.filter((quote) => {
      return quote.source && quote.source.ignored === false;
    });

    if (quotesResultFiltered.length === 0) {
      return {};
    }

    const randomQuoteIndex = Math.floor(Math.random() * quotesResultFiltered.length);
    const randomQuote = quotesResultFiltered[randomQuoteIndex] as QuoteWithRelations;
    const randomSource = randomQuote.source as DailyReflection['source'];

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

    if (newDailyQuote.length === 0) {
      // Handle conflict case - quote already exists for today
      return await getDailyReflection(profile.userId, profile.utcOffset as number, encryptionKey);
    }

    const decryptedNote = randomQuote.note
      ? await decrypt(randomQuote.note, encryptionKey)
      : "";

    return {
      id: newDailyQuote[0].id,
      emailSent: newDailyQuote[0].emailSent,
      source: randomSource,
      quote: {
        ...randomQuote,
        note: decryptedNote,
      },
    };
  } catch (error) {
    console.error(error);
    return {};
  }
};