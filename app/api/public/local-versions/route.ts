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
import { purchases, unearthedLocalVersions } from "@/db/schema";
import { eq } from "drizzle-orm";

const RequestSchema = z.object({
  distinctId: z.string().min(3, "distinctId is required"),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => ({}));
    const parse = RequestSchema.safeParse(json);
    if (!parse.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parse.error.format() },
        { status: 400 }
      );
    }

    const { distinctId } = parse.data;

    const purchase = await db.query.purchases.findFirst({
      where: eq(purchases.distinctId, distinctId),
      orderBy: (p, { desc }) => [desc(p.createdAt)],
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "No purchase found for this Purchase ID" },
        { status: 404 }
      );
    }

    const versions = await db.query.unearthedLocalVersions.findMany({
      where: eq(unearthedLocalVersions.productName, purchase.productName),
      orderBy: (t, { desc }) => [desc(t.version)],
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          productName: purchase.productName,
          versions,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("/api/public/local-versions error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

