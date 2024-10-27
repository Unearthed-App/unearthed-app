"use server";

import { db } from "@/db";
import {
  sources,
  selectSourceSchema,
  notionSourceJobsOne,
  quotes,
  // notionSourceJobsTwo,
  // notionSourceJobsThree,
  // notionSourceJobsFour
} from "@/db/schema";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
type Source = z.infer<typeof selectSourceSchema>;

export const deleteSource = async ({ source }: { source: Source }) => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await clerkClient().users.getUser(userId!);
  const isPremium = user.privateMetadata.isPremium as boolean;

  if (!isPremium) {
    throw new Error("User not allowed");
  }

  try {
    await db
      .delete(notionSourceJobsOne)
      .where(eq(notionSourceJobsOne.sourceId, source.id));
    // await db
    //   .delete(notionSourceJobsTwo)
    //   .where(eq(notionSourceJobsTwo.sourceId, source.id));
    // await db
    //   .delete(notionSourceJobsThree)
    //   .where(eq(notionSourceJobsThree.sourceId, source.id));
    // await db
    //   .delete(notionSourceJobsFour)
    //   .where(eq(notionSourceJobsFour.sourceId, source.id));

    await db
      .delete(sources)
      .where(and(eq(sources.id, source.id), eq(sources.userId, userId)));

    return {};
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const deleteQuote = async ({ quoteId }: { quoteId: string }) => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await clerkClient().users.getUser(userId!);
  const isPremium = user.privateMetadata.isPremium as boolean;

  if (!isPremium) {
    throw new Error("User not allowed");
  }

  try {
    await db
      .delete(quotes)
      .where(and(eq(quotes.id, quoteId), eq(quotes.userId, userId)));
    return {};
  } catch (error) {
    console.error(error);
    return false;
  }
};
