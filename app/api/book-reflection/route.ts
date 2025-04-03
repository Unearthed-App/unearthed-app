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
import {
  calculateAiUsage,
  cleanAndParseJSONFromAi,
} from "@/server/actions-premium";
import { clerkClient } from "@clerk/nextjs/server";
import PostHogClient from "@/app/posthog";

type Profile = z.infer<typeof insertProfileSchema>;

const ReflectionRequestSchema = z.object({
  bookId: z.string(),
  bookTitle: z.string(),
  bookAuthor: z.string(),
});

type ReflectionRequest = z.infer<typeof ReflectionRequestSchema>;

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
    let profile: Profile;

    const dbResult = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (!dbResult) {
      throw new Error("Profile not found");
    } else {
      profile = dbResult;
    }

    let isPremium = false;
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      isPremium = user.privateMetadata.isPremium as boolean;
    } catch (error) {
      isPremium = false;
    }

    if (!isPremium) {
      throw new Error("User not allowed");
    }

    const body: ReflectionRequest = await request.json();
    const validatedRequest = ReflectionRequestSchema.parse(body);

    // Fetch all quotes for the book
    const dbQuotes = await db.query.quotes.findMany({
      where: and(
        eq(quotes.sourceId, validatedRequest.bookId),
        eq(quotes.userId, userId)
      ),
    });

    // Decrypt notes if they exist
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
      return NextResponse.json(
        {
          question: "No quotes available",
          answer: "Please add some quotes to the book first.",
        },
        { status: 200 }
      );
    }

    const systemMessage = `You are a thoughtful literary analyst. Given quotes from "${validatedRequest.bookTitle}" by ${validatedRequest.bookAuthor}", generate an insightful reflection question about the book's themes, character development, or author's perspective. Then provide a well-reasoned answer based on the available quotes.

Your response MUST be a valid JSON object in this exact format, with NO special characters or escape sequences except for \\" when quoting text:
{
  "question": "Your question here (use \\" for quotes)",
  "answer": "Your answer here (use \\" for quotes)"
}

Do not use markdown formatting or code blocks in your response. Return only the JSON object.`;

    const userMessage = `Here are some quotes from the book:\n${quotesDecrypted
      .map(
        (q) =>
          `Quote: "${q.content}"\nLocation: ${q.location}\n${
            q.note ? `Reader's Note: ${q.note}\n` : ""
          }`
      )
      .join("\n")}`;

    if (profile.aiApiModel || profile.aiApiKey) {
      console.log("Using custom OpenAI configuration");
      posthogClient.capture({
        distinctId: userId,
        event: `book-reflection (BYO) started`,
      });
      profile = {
        ...profile,
        aiApiKey: profile.aiApiKey
          ? await decrypt(profile.aiApiKey as string, encryptionKey)
          : "",
      };

      try {
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

        console.log(
          "OpenAI response structure:",
          JSON.stringify(completion, null, 2)
        );

        if (!completion.choices?.length) {
          console.error("OpenAI response missing choices:", completion);
          throw new Error("Invalid API response structure");
        }

        const responseContent = completion.choices[0]?.message?.content;
        if (!responseContent) {
          console.error(
            "OpenAI response missing content:",
            completion.choices[0]
          );
          throw new Error("Invalid API response content");
        }

        console.log("OpenAI raw response:", responseContent);

        let parsedResponse;
        try {
          parsedResponse = await cleanAndParseJSONFromAi(responseContent);
          if (!parsedResponse) {
            parsedResponse = {
              question: "Failed to parse AI response",
              answer: "Please try again. Response format was invalid.",
            };
          }
        } catch (e) {
          console.error("OpenAI parsing error:", e);
          console.error("Failed to parse response:", responseContent);
          parsedResponse = {
            question: "Failed to parse AI response",
            answer: "Please try again",
          };
        }

        return NextResponse.json(parsedResponse, { status: 200 });
      } catch (error) {
        console.error("OpenAI API error:", error);

        if (error instanceof OpenAI.APIError) {
          return NextResponse.json(
            {
              question: "API Error",
              answer: `OpenAI API error: ${error.message}`,
            },
            { status: 200 }
          );
        }

        return NextResponse.json(
          {
            question: "Error",
            answer:
              "Failed to generate reflection. Please check your API configuration.",
          },
          { status: 200 }
        );
      }
    } else {
      console.log("Using Gemini configuration");
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
          {
            role: "model",
            parts: [{ text: "I understand. I'll help analyze the book." }],
          },
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
        event: `book-reflection (gemini) complete`,
        properties: {
          inputTokens,
          outputTokens,
        },
      });

      await db
        .update(profiles)
        .set({
          aiInputTokensUsed: (profile?.aiInputTokensUsed || 0) + inputTokens,
          aiOutputTokensUsed: (profile.aiOutputTokensUsed || 0) + outputTokens,
        })
        .where(eq(profiles.userId, userId));

      let parsedResponse;
      try {
        parsedResponse = await cleanAndParseJSONFromAi(result.response.text());
        if (!parsedResponse) {
          parsedResponse = {
            question: "Failed to parse AI response",
            answer: "Please try again. Response format was invalid.",
          };
        }
      } catch (e) {
        console.error("Gemini parsing error:", e);
        console.error("Failed to parse response:", result.response.text());
        parsedResponse = {
          question: "Failed to parse AI response",
          answer: "Please try again",
        };
      }
      return NextResponse.json(parsedResponse, { status: 200 });
    }
  } catch (error) {
    console.error("Top-level error:", error);
    posthogClient.capture({
      distinctId: userId,
      event: `book-reflection ERROR`,
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

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        {
          error: "OpenAI service error",
          code: error.code,
          message: error.message,
        },
        { status: 500 }
      );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
function cleanAndParseJSON(arg0: string): any {
  throw new Error("Function not implemented.");
}
