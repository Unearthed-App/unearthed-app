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
import { insertProfileSchema, profiles, quotes, tags } from "@/db/schema";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { calculateAiUsage } from "@/server/actions-premium";
import PostHogClient from "@/app/posthog";

type Profile = z.infer<typeof insertProfileSchema>;

const IdeasRequestSchema = z.object({
  bookId: z.string(),
  bookTitle: z.string(),
  bookAuthor: z.string(),
});

type IdeasRequest = z.infer<typeof IdeasRequestSchema>;

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
        // Remove any potential BOM or hidden characters
        .replace(/[\uFEFF\u200B]/g, "")
        // Replace any non-standard whitespace
        .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, " ")
        .trim();

      // Try to find complete JSON object
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        cleaned = match[0];
      }

      // Ensure the JSON is complete and valid
      try {
        // First try direct parsing
        return JSON.parse(cleaned);
      } catch {
        // If that fails, try to normalize the structure
        if (cleaned.includes('"ideas"')) {
          // Ensure proper array closure
          const matches = cleaned.match(/\{[^}]*"ideas"\s*:\s*\[([^[\]]*)\]/);
          if (matches) {
            const ideas = matches[1].split("},{").map((idea) => {
              if (!idea.startsWith("{")) idea = "{" + idea;
              if (!idea.endsWith("}")) idea = idea + "}";
              return idea;
            });

            const reconstructed = `{"ideas":[${ideas.join(",")}]}`;
            return JSON.parse(reconstructed);
          }

          // If still invalid, ensure proper closure
          if (!cleaned.endsWith("}")) {
            cleaned += "}";
          }
          if (!cleaned.endsWith("]}")) {
            cleaned += "]}";
          }
          return JSON.parse(cleaned);
        }
      }

      // If all parsing attempts fail, return default structure
      return {
        ideas: [
          {
            tag: "Parsing Error",
            description: "Failed to parse AI response",
          },
        ],
      };
    } catch (e) {
      console.error("JSON parsing error:", e);
      console.error("Failed to parse text:", text);
      return {
        ideas: [
          {
            tag: "Parsing Error",
            description: "Failed to parse AI response",
          },
        ],
      };
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

    const body: IdeasRequest = await request.json();
    const validatedRequest = IdeasRequestSchema.parse(body);

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

    const existingTags = await db
      .select({
        title: tags.title,
      })
      .from(tags)
      .where(eq(tags.userId, userId));

    const existingTagTitles = existingTags.map((tag) => tag.title);

    const systemMessage = `You are a thoughtful literary analyst. Given quotes from "${
      validatedRequest.bookTitle
    }" by ${
      validatedRequest.bookAuthor
    }", extract key ideas, concepts, and themes from the provided quotes and notes.

Here are the existing tags in the system:
${existingTagTitles.join(", ")}

First, consider if any of the existing tags above are relevant to the quotes provided. If they are, use those exact tags. Then, identify any new themes or concepts that aren't covered by existing tags.

Your response MUST be a valid JSON object in this exact format, using only standard double quotes ("):
{
  "ideas": [
    {
      "tag": "concept or theme name",
      "description": "brief explanation of how this idea appears in the quotes",
      "quoteIndices": [0, 1, 2]  // Array of indices referencing the quotes that support this idea
    }
  ]
}

Keep tags concise (1-3 words). Descriptions should be 1-2 sentences. For each idea, include quoteIndices array with the indices of quotes that support this idea (0-based index in the order provided). Return as many ideas as you can find.
Do not use single quotes or smart quotes. Use \\" for quotes within the text. Do not include any markdown formatting or any other formatting outside of this JSON structure.`;

    const userMessage = `Here are some quotes from the book:\n${quotesDecrypted
      .map(
        (q) =>
          `Quote: "${q.content}"\nLocation: ${q.location}\n${
            q.note ? `Reader's Note: ${q.note}\n` : ""
          }`
      )
      .join("\n")}`;

    if (profile.aiApiModel || profile.aiApiKey) {
      posthogClient.capture({
        distinctId: userId,
        event: `book-ideas (BYO) started`,
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
      if (
        !parsedResponse ||
        !parsedResponse.ideas ||
        !Array.isArray(parsedResponse.ideas) ||
        (parsedResponse.ideas.length === 1 &&
          parsedResponse.ideas[0].tag === "Parsing Error" &&
          parsedResponse.ideas[0].description === "Failed to parse AI response")
      ) {
        return NextResponse.json(
          {
            error: "Failed to parse AI response",
            details: "The AI response was not in the expected format",
          },
          { status: 422 }
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
        event: `book-ideas (gemini) complete`,
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

      let parsedResponse = cleanAndParseJSON(result.response.text());
      if (
        !parsedResponse ||
        !parsedResponse.ideas ||
        !Array.isArray(parsedResponse.ideas) ||
        (parsedResponse.ideas.length === 1 &&
          parsedResponse.ideas[0].tag === "Parsing Error" &&
          parsedResponse.ideas[0].description === "Failed to parse AI response")
      ) {
        return NextResponse.json(
          {
            error: "Failed to parse AI response",
            details: "The AI response was not in the expected format",
          },
          { status: 422 }
        );
      }

      return NextResponse.json(parsedResponse, { status: 200 });
    }
  } catch (error) {
    console.error("Top-level error:", error);
    posthogClient.capture({
      distinctId: userId,
      event: `book-ideas ERROR`,
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
      { error: "Failed to generate ideas" },
      { status: 500 }
    );
  }
}
