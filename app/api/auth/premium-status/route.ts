import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ isPremium: false }, { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        }
      });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const isPremium = user.privateMetadata.isPremium as boolean || false;

    return NextResponse.json({ isPremium }, { 
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=60',
      }
    });
  } catch (error) {
    console.error('Error fetching premium status:', error);
    return NextResponse.json({ isPremium: false }, { status: 200 });
  }
}

