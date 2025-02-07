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
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import OpenAI from "openai";
import { decrypt, getOrCreateEncryptionKey } from "@/lib/auth/encryptionKey";
import { insertProfileSchema, profiles } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
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

const initialInstructions = `You are a quiz master/librarian/psychologist. You love to help people get the most out of the books they read. When you receive the user's quotes and notes, you are able to interpret them and explain what they mean. You can help the user understand the meaning of the quotes and notes they have shared with you. Wait for user prompting before blurting advice but if the prompting is vague, start suggesting quizzes. You can also ask the user questions to help them reflect on their reading.`;

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

    profile = {
      ...profile,
      aiApiKey: profile.aiApiKey
        ? await decrypt(profile.aiApiKey as string, encryptionKey)
        : "",
    };

    const model = profile.aiApiModel!;
    const openai = new OpenAI({
      baseURL: profile.aiApiUrl!,
      apiKey: profile.aiApiKey!,
    });

    const body: ChatRequest = await request.json();
    const validatedRequest = ChatRequestSchema.parse(body);

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: initialInstructions + "" + validatedRequest.systemMessage,
        },
        ...validatedRequest.messages,
      ],
      temperature: 0.7,
    });

    const responseContent = completion.choices[0].message.content;

    return NextResponse.json({ response: responseContent }, { status: 200 });
  } catch (error) {
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
          error: "AI service error",
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
