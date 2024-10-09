import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { encrypt, getOrCreateEncryptionKey } from "@/lib/auth/encryptionKey";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { syncToNotion } from "@/server/actions";

export async function GET(request: NextRequest): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const encryptionKey = await getOrCreateEncryptionKey();
  if (!encryptionKey) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const encodedIdAndSecret = Buffer.from(
      `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_SECRET}`
    ).toString("base64");

    const body = {
      code: code,
      grant_type: "authorization_code",
      redirect_uri: "https://unearthed.app/api/notion-redirect",
    };

    const response = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${encodedIdAndSecret}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!data.access_token) {
      return NextResponse.json({ error: "Error" }, { status: 500 });
    }

    const encryptedAuthData = await encrypt(
      JSON.stringify(data),
      encryptionKey
    );

    try {
      const result = await db
        .update(profiles)
        .set({
          notionAuthData: encryptedAuthData,
        })
        .where(eq(profiles.userId, userId));

      if (result.length === 0) {
        await db
          .insert(profiles)
          .values({
            notionAuthData: encryptedAuthData,
            userId: userId,
          })
          .onConflictDoNothing();
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { success: false, message: "Could not update or insert profile" },
        { status: 500 }
      );
    }

    syncToNotion({ newConnection: true });

    const redirectUrl = new URL(
      "https://unearthed.app/dashboard/notion-setup-began",
      request.url
    );
    redirectUrl.searchParams.set("redirect", "true");
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
