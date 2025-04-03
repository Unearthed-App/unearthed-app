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

import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { calculateAiUsage } from "@/server/actions-premium";
import PostHogClient from "@/app/posthog";
import { profiles, sources } from "@/db/schema";
import { decrypt, getOrCreateEncryptionKey } from "@/lib/auth/encryptionKey";

const RecommendationsRequestSchema = z.object({
  sourceId: z.string().uuid(),
});

function cleanAIResponse(response: string): string {
  return response
    .replace(/```json\s*/g, "") // Remove ```json marker at start
    .replace(/```\s*$/g, "") // Remove ``` marker at end
    .replace(/[""]/g, '"') // Replace smart quotes
    .replace(/['']/g, "'") // Replace smart single quotes
    .replace(/—/g, "-") // Replace em dashes
    .replace(/\*/g, "") // Remove asterisks
    .replace(/`/g, "") // Remove backticks
    .replace(/\\n/g, " ") // Replace newline escapes with space
    .trim();
}

export async function POST(request: NextRequest) {
  const posthogClient = PostHogClient();

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const encryptionKey = await getOrCreateEncryptionKey();
    if (!encryptionKey) {
      throw new Error("User not authenticated");
    }

    // Check if user is premium
    let isPremium = false;
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      isPremium = user.privateMetadata.isPremium as boolean;
    } catch (error) {
      isPremium = false;
    }

    if (!isPremium) {
      return NextResponse.json({ error: "Premium required" }, { status: 403 });
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const { sourceId } = RecommendationsRequestSchema.parse(
      await request.json()
    );

    // Get book details including quotes and tags
    const book = await db.query.sources.findFirst({
      where: and(eq(sources.id, sourceId), eq(sources.userId, userId)),
      with: {
        quotes: true,
        tags: {
          with: {
            tag: true,
          },
        },
      },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Get all user's sources
    const userSources = await db.query.sources.findMany({
      where: and(eq(sources.userId, userId), eq(sources.type, "BOOK")),
    });

    // Decrypt notes
    const quotesWithDecryptedNotes = await Promise.all(
      book.quotes.map(async (quote) => ({
        ...quote,
        note: quote.note
          ? await decrypt(quote.note as string, encryptionKey)
          : "",
      }))
    );

    const aiPercentageUsed = await calculateAiUsage(profile);
    if (aiPercentageUsed >= 100) {
      throw new Error("Quota used up");
    }

    const modelName = process.env.AI_GOOGLE_MODEL!;
    const apiKey = process.env.AI_GOOGLE_KEY!;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    const existingBooks = userSources
      .map((source) => `${source.title} by ${source.author}`)
      .join("\n");

    const systemMessage = `You are a book recommendation expert specializing in finding opposing viewpoints. Based on the provided book information, suggest books that present contrasting perspectives, challenge the original book's assumptions, or offer opposing ideologies. Look for works that provide thoughtful counterarguments or alternative frameworks to the themes and ideas presented.

Book details:
Title: ${book.title}
Author: ${book.author}
Tags: ${book.tags.map((t) => t.tag.title).join(", ") || "None"}
${
  quotesWithDecryptedNotes.length > 0
    ? `\nSome notable quotes and notes:\n${quotesWithDecryptedNotes
        .slice(0, 20)
        .map((q) => `Quote: "${q.content}"${q.note ? `\nNote: ${q.note}` : ""}`)
        .join("\n\n")}`
    : ""
}

User's existing book collection:
${existingBooks}

Please provide recommendations for NEW books that present opposing viewpoints and are NOT in the user's existing collection. Provide recommendations in this JSON format, using plain text only (no markdown, no special characters, no em dashes):
{
  "recommendations": [
    {
      "title": "Book Title",
      "author": "Author Name",
      "reason": "Brief explanation of how this book challenges or provides an alternative perspective to the original book's ideas (use regular quotes, no italics or special formatting)"
    }
  ]
}`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: systemMessage }],
        },
      ],
      generationConfig: { temperature: 0.7 },
    });

    const inputTokens = result.response.usageMetadata?.promptTokenCount || 0;
    const outputTokens =
      result.response.usageMetadata?.candidatesTokenCount || 0;
    const groundingMetadata =
      result.response.candidates?.[0]?.groundingMetadata;

    // Parse the response
    let parsedRecommendations;
    try {
      console.log("Raw response:", result.response.text());
      const cleanedResponse = cleanAIResponse(result.response.text());
      parsedRecommendations = JSON.parse(cleanedResponse);
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 422 }
      );
    }

    posthogClient.capture({
      distinctId: userId,
      event: "book-recommendations-contrasting complete",
      properties: {
        inputTokens,
        outputTokens,
        hasGroundingMetadata: !!groundingMetadata,
      },
    });

    await db
      .update(profiles)
      .set({
        aiInputTokensUsed: (profile?.aiInputTokensUsed || 0) + inputTokens,
        aiOutputTokensUsed: (profile.aiOutputTokensUsed || 0) + outputTokens,
      })
      .where(eq(profiles.userId, userId));

    return NextResponse.json(
      {
        recommendations: parsedRecommendations.recommendations,
        groundingMetadata: groundingMetadata || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
