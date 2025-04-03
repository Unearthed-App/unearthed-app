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
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { calculateAiUsage } from "@/server/actions-premium";
import PostHogClient from "@/app/posthog";
import { profiles, sources } from "@/db/schema";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posthogClient = PostHogClient();

  try {
    // Get user's profile to check AI usage
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Check AI usage limits
    const canUseAI = await calculateAiUsage(profile);
    if (!canUseAI) {
      return NextResponse.json(
        { error: "AI usage limit reached" },
        { status: 429 }
      );
    }

    // Fetch all user's books
    const userBooks = await db.query.sources.findMany({
      where: eq(sources.userId, userId),
    });

    if (userBooks.length === 0) {
      return NextResponse.json(
        { error: "No books found for analysis" },
        { status: 404 }
      );
    }

    const books = userBooks.map(book => ({
      title: book.title,
      author: book.author || "Unknown Author",
      subtitle: book.subtitle || undefined
    }));

    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze these books:
    ${JSON.stringify(books, null, 2)}

    Provide a reading pattern analysis and identify potential blind spots in the reader's book selection.
    Return the response as a JSON object with this exact structure:
    {
      "blindSpots": [
        {
          "category": "string",
          "description": "string",
          "recommendations": [
            {
              "title": "string",
              "author": "string",
              "reason": "string"
            }
          ]
        }
      ],
      "patterns": ["string"],
      "suggestedTopics": ["string"]
    }`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse and validate the JSON response
    const analysis = JSON.parse(text);

    // Track the event in PostHog
    posthogClient.capture({
      distinctId: userId,
      event: 'blind_spots_analysis_generated',
      properties: {
        bookCount: books.length,
      },
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in book-blindspots:', error);
    return NextResponse.json(
      { error: "Failed to generate analysis" },
      { status: 500 }
    );
  }
}