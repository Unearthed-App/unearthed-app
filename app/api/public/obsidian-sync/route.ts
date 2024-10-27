import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { and, eq, isNotNull } from "drizzle-orm";
import { profiles, sources, unearthedKeys } from "@/db/schema";
import bcrypt from "bcrypt";
import { decrypt } from "@/lib/auth/encryptionKey";
import { clerkClient } from "@clerk/nextjs/server";

// Function to verify API key
async function verifyApiKeyGetProfile(providedApiKey: string) {
  const potentialProfiles = await db.query.unearthedKeys.findMany({
    where: and(isNotNull(unearthedKeys.userId), isNotNull(unearthedKeys.key)),
  });

  for (const unearthedKey of potentialProfiles) {
    const isMatch = await bcrypt.compare(providedApiKey, unearthedKey.key!);
    if (isMatch) {
      const profile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, unearthedKey.userId),
      });
      return profile;
    }
  }

  return false;
}

export async function GET() {
  const headersList = headers();
  const authHeader = headersList.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = authHeader.split(" ")[1];

  if (!apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await verifyApiKeyGetProfile(apiKey);

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await clerkClient().users.getUser(profile.userId);
    const encryptionKey = user.privateMetadata.encryptionKey as string;

    const dbResult = await db.query.sources.findMany({
      with: {
        quotes: true,
      },
      where: and(
        eq(sources.type, "BOOK"),
        eq(sources.ignored, false),
        eq(sources.userId, profile.userId)
      ),
    });

    // decrypt each dbResult->quotes->note
    for (const source of dbResult) {
      for (const quote of source.quotes) {
        if (quote.note) {
          quote.note = await decrypt(quote.note as string, encryptionKey);
        }
      }
    }

    return NextResponse.json({ success: true, data: dbResult });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}