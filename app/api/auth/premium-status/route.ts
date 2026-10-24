/**
 * Copyright (C) 2026 Unearthed App
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

