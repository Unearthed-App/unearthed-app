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
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import OpenAI from "openai";
import { decrypt, getOrCreateEncryptionKey } from "@/lib/auth/encryptionKey";
import { insertProfileSchema, profiles, quotes } from "@/db/schema";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { calculateAiUsage } from "@/server/actions-premium";
import PostHogClient from "@/app/posthog";

type Profile = z.infer<typeof insertProfileSchema>;

const ExamineRequestSchema = z.object({
  bookId: z.string(),
  bookTitle: z.string(),
  bookAuthor: z.string(),
});

type ExamineRequest = z.infer<typeof ExamineRequestSchema>;

function cleanAndParseJSON(text: string | null | undefined) {
  if (!text) return null;

  // First: remove any markdown code block indicators and trim
  text = text
    .replace(/```json\s*/g, "")
    .replace(/```\s*$/g, "")
    .trim();

  try {
    return JSON.parse(text);
  } catch (e) {
    try {
      // If first parse fails, try additional cleaning
      let cleaned = text
        .replace(/\\\"/g, '"') // Replace escaped quotes
        .replace(/\\n/g, "\n") // Replace escaped newlines
        .replace(/\\\\/g, "\\") // Replace escaped backslashes
        .replace(/\\'/g, "'") // Replace escaped single quotes
        .replace(/[\u2018\u2019]/g, "'") // Replace smart single quotes
        .replace(/[\u201C\u201D]/g, '"') // Replace smart double quotes
        .trim();

      return JSON.parse(cleaned);
    } catch (e) {
      console.error("JSON parsing error:", e);
      console.error("Failed to parse text:", text);
      return null;
    }
  }
}

export async function POST(request: NextRequest) {
  const { userId }: { userId: string | null } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const encryptionKey = await getOrCreateEncryptionKey();
  if (!encryptionKey) {
    throw new Error("User not authenticated");
  }

  const posthogClient = PostHogClient();

  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    const body: ExamineRequest = await request.json();
    const validatedRequest = ExamineRequestSchema.parse(body);

    // Fetch all quotes for the book
    const dbQuotes = await db.query.quotes.findMany({
      where: and(
        eq(quotes.sourceId, validatedRequest.bookId),
        eq(quotes.userId, userId)
      ),
    });

    // Decrypt notes
    const quotesDecrypted = await Promise.all(
      dbQuotes.map(async (quote) => ({
        content: quote.content,
        note: quote.note
          ? await decrypt(quote.note as string, encryptionKey)
          : "",
        location: quote.location || "",
      }))
    );

    if (quotesDecrypted.length === 0) {
      return NextResponse.json({
        summary: "No quotes found in this book.",
        themes: [],
        takeaways: [],
        readerPerspective: "Unable to analyze without any quotes or notes.",
      });
    }

    const systemMessage = `You are a literary analyst and reading coach. Examine the provided book quotes, notes, and locations to create a comprehensive analysis report. Structure your response in this exact JSON format:

{
  "summary": "Overall analysis of what the book appears to be about based on the reader's notes and quotes",
  "themes": ["List of main themes identified"],
  "takeaways": ["List of key lessons or insights the reader appears to have gained"],
  "readerPerspective": "Analysis of what aspects of the book the reader focused on most, based on their quote selections and notes. Put higher weight on the notes, over the quotes"
}

Base your analysis solely on the provided content. Be specific and reference actual quotes/notes where relevant.`;

    const userMessage = `Book: "${validatedRequest.bookTitle}" by ${validatedRequest.bookAuthor}
Quotes and Notes:
${quotesDecrypted
  .map(
    (q) =>
      `Quote: "${q.content}"
Location: ${q.location || "N/A"}
${q.note ? `Reader's Note: ${q.note}` : ""}`
  )
  .join("\n\n")}`;

    if (profile.aiApiModel || profile.aiApiKey) {
      posthogClient.capture({
        distinctId: userId,
        event: `book-examine (BYO) started`,
      });

      profile.aiApiKey = profile.aiApiKey
        ? await decrypt(profile.aiApiKey as string, encryptionKey)
        : "";

      const openai = new OpenAI({
        baseURL: profile.aiApiUrl!,
        apiKey: profile.aiApiKey!,
      });

      const completion = await openai.chat.completions.create({
        model: profile.aiApiModel!,
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
      });

      const responseContent = completion.choices[0].message.content;
      console.log("OpenAI raw response:", responseContent);

      let parsedResponse = cleanAndParseJSON(responseContent);
      if (!parsedResponse) {
        return NextResponse.json(
          {
            summary: "Failed to analyze the book content.",
            themes: ["Parsing Error"],
            takeaways: ["Failed to parse AI response"],
            readerPerspective: "Error in analysis.",
          },
          { status: 200 }
        );
      }

      return NextResponse.json(parsedResponse, { status: 200 });
    } else {
      const aiPercentageUsed = await calculateAiUsage(profile);

      if (aiPercentageUsed >= 100) {
        throw new Error("Quota used up");
      }

      const modelName = process.env.AI_GOOGLE_MODEL!;
      const apiKey = process.env.AI_GOOGLE_KEY!;

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent({
        contents: [
          { role: "user", parts: [{ text: systemMessage }] },
          { role: "user", parts: [{ text: userMessage }] },
        ],
        generationConfig: { temperature: 0.7 },
      });

      console.log("Gemini raw response:", result.response.text());

      const inputTokens = result.response.usageMetadata?.promptTokenCount || 0;
      const outputTokens =
        result.response.usageMetadata?.candidatesTokenCount || 0;

      posthogClient.capture({
        distinctId: userId,
        event: `book-examine (gemini) complete`,
        properties: {
          inputTokens,
          outputTokens,
          totalTokens: inputTokens + outputTokens,
        },
      });

      await db
        .update(profiles)
        .set({
          aiInputTokensUsed: (profile?.aiInputTokensUsed || 0) + inputTokens,
          aiOutputTokensUsed: (profile.aiOutputTokensUsed || 0) + outputTokens,
        })
        .where(eq(profiles.userId, userId));

      let parsedResponse = cleanAndParseJSON(result.response.text());
      if (!parsedResponse) {
        return NextResponse.json(
          {
            summary: "Failed to analyze the book content.",
            themes: ["Parsing Error"],
            takeaways: ["Failed to parse AI response"],
            readerPerspective: "Error in analysis.",
          },
          { status: 200 }
        );
      }

      return NextResponse.json(parsedResponse, { status: 200 });
    }
  } catch (error) {
    console.error("Top-level error:", error);
    posthogClient.capture({
      distinctId: userId,
      event: `book-examine ERROR`,
      properties: {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to examine book" },
      { status: 500 }
    );
  }
}
