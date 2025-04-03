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
import { insertProfileSchema, profiles } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { calculateAiUsage } from "@/server/actions-premium";
import { clerkClient } from "@clerk/nextjs/server";
import PostHogClient from "@/app/posthog";

type Profile = z.infer<typeof insertProfileSchema>;

const ChatRequestSchema = z.object({
  systemMessage: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(["system", "user", "assistant"]),
      content: z.string(),
    })
  ),
});

type ChatRequest = z.infer<typeof ChatRequestSchema>;

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

    const body: ChatRequest = await request.json();
    const validatedRequest = ChatRequestSchema.parse(body);

    if (profile.aiApiModel || profile.aiApiKey) {
      posthogClient.capture({
        distinctId: userId,
        event: `chat (BYO) started`,
      });
      profile = {
        ...profile,
        aiApiKey: profile.aiApiKey
          ? await decrypt(profile.aiApiKey as string, encryptionKey)
          : "",
      };

      const openai = new OpenAI({
        baseURL: profile.aiApiUrl!,
        apiKey: profile.aiApiKey!,
      });

      const completion = await openai.chat.completions.create({
        model: profile.aiApiModel!,
        messages: [
          {
            role: "system",
            content: `${validatedRequest.systemMessage}`,
          },
          ...validatedRequest.messages,
        ],
        temperature: 0.7,
      });

      const responseContent = completion.choices[0].message.content;

      return NextResponse.json({ response: responseContent }, { status: 200 });
    } else {
      const aiPercentageUsed = await calculateAiUsage(profile);

      if (aiPercentageUsed >= 100) {
        throw new Error("Quota used up");
      }
      const modelName = process.env.AI_GOOGLE_MODEL!;
      const apiKey = process.env.AI_GOOGLE_KEY!;

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: modelName });

      const geminiMessages = [
        {
          role: "user",
          parts: [
            {
              text: `${validatedRequest.systemMessage}`,
            },
          ],
        },
        ...validatedRequest.messages.map((msg) => ({
          role: msg.role === "assistant" ? "model" : msg.role,
          parts: [{ text: msg.content }],
        })),
      ];

      const result = await model.generateContent({
        contents: geminiMessages,
        generationConfig: { temperature: 0.7 },
      });

      const inputTokens = result.response.usageMetadata?.promptTokenCount || 0;
      const outputTokens =
        result.response.usageMetadata?.candidatesTokenCount || 0;

      posthogClient.capture({
        distinctId: userId,
        event: `chat (gemini) complete`,
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

      return NextResponse.json(
        { response: result.response.text() },
        { status: 200 }
      );
    }
  } catch (error) {
    posthogClient.capture({
      distinctId: userId,
      event: `chat ERROR`,
      properties: {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    });
    console.error("Error:", error);
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
