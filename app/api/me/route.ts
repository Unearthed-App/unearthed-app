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

import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let isPremium = false;
  try {
    if (userId) {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      isPremium = user.privateMetadata.isPremium as boolean;
    }
  } catch (error) {
    isPremium = false;
  }

  return NextResponse.json({ userId, isPremium }, { status: 200 });
}
