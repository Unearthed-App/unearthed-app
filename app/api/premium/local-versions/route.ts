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
import { z } from "zod";
import { db } from "@/db";
// import { purchases, unearthedLocalVersions } from "@/db/schema";
// import { eq } from "drizzle-orm";
import { auth, clerkClient } from "@clerk/nextjs/server";

// const RequestSchema = z.object({
//   distinctId: z.string().min(3, "distinctId is required"),
// });

async function checkPremiumStatus(userId: string): Promise<boolean> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user.privateMetadata.isPremium as boolean;
  } catch (error) {
    console.error("Error checking premium status:", error);
    return false;
  }
}

// GET endpoint - Premium users get ALL versions without needing Purchase ID
export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and has premium status
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const isPremium = await checkPremiumStatus(userId);
    if (!isPremium) {
      return NextResponse.json(
        { error: "Premium subscription required" },
        { status: 403 }
      );
    }

    // Get all versions grouped by product
    const allVersions = await db.query.unearthedLocalVersions.findMany({
      orderBy: (t, { desc, asc }) => [desc(t.version), asc(t.productName)],
    });

    // Group versions by product name
    const productVersionsMap = new Map<string, typeof allVersions>();
    allVersions.forEach((version) => {
      if (!productVersionsMap.has(version.productName)) {
        productVersionsMap.set(version.productName, []);
      }
      productVersionsMap.get(version.productName)!.push(version);
    });

    // Convert to array format and ensure versions are sorted newest first
    const productVersions = Array.from(productVersionsMap.entries()).map(
      ([productName, versions]) => ({
        productName,
        versions: versions.sort((a, b) => b.version - a.version), // Newest first
      })
    );

    return NextResponse.json(
      {
        success: true,
        data: productVersions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("/api/premium/local-versions GET error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// // POST endpoint - For backward compatibility with Purchase ID
// export async function POST(req: NextRequest) {
//   try {
//     // Check if user is authenticated and has premium status
//     const { userId } = await auth();
//     if (!userId) {
//       return NextResponse.json(
//         { error: "Authentication required" },
//         { status: 401 }
//       );
//     }

//     const isPremium = await checkPremiumStatus(userId);
//     if (!isPremium) {
//       return NextResponse.json(
//         { error: "Premium subscription required" },
//         { status: 403 }
//       );
//     }

//     const json = await req.json().catch(() => ({}));
//     const parse = RequestSchema.safeParse(json);
//     if (!parse.success) {
//       return NextResponse.json(
//         { error: "Invalid request body", details: parse.error.format() },
//         { status: 400 }
//       );
//     }

//     const { distinctId } = parse.data;

//     const purchase = await db.query.purchases.findFirst({
//       where: eq(purchases.distinctId, distinctId),
//       orderBy: (p, { desc }) => [desc(p.createdAt)],
//     });

//     if (!purchase) {
//       return NextResponse.json(
//         { error: "No purchase found for this Purchase ID" },
//         { status: 404 }
//       );
//     }

//     // Premium users get ALL versions, ordered by newest first
//     const versions = await db.query.unearthedLocalVersions.findMany({
//       where: eq(unearthedLocalVersions.productName, purchase.productName),
//       orderBy: (t, { desc }) => [desc(t.version)], // Newest first
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         data: {
//           productName: purchase.productName,
//           versions,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("/api/premium/local-versions POST error", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
