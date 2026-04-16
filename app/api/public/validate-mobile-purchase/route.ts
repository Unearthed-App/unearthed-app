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

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { purchasesMobile } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

const ALLOWED_ORIGINS = [
  "https://mobile.unearthed.app",
  "http://localhost:5173",
];

function getCorsHeaders(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin)
      ? origin
      : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

const RequestSchema = z.object({
  purchaseId: z.string().min(3, "purchaseId is required"),
});

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(request),
  });
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => ({}));
    const parse = RequestSchema.safeParse(json);
    if (!parse.success) {
      return NextResponse.json(
        { valid: false, error: "Invalid request body" },
        { status: 400, headers: getCorsHeaders(req) }
      );
    }

    const { purchaseId } = parse.data;

    const purchase = await db.query.purchasesMobile.findFirst({
      where: eq(purchasesMobile.purchaseId, purchaseId),
    });

    if (!purchase) {
      return NextResponse.json(
        { valid: false },
        { status: 200, headers: getCorsHeaders(req) }
      );
    }

    if (purchase.status === "paid") {
      await db
        .update(purchasesMobile)
        .set({
          validationSuccessCount: sql`${purchasesMobile.validationSuccessCount} + 1`,
        })
        .where(eq(purchasesMobile.purchaseId, purchaseId));

      return NextResponse.json(
        { valid: true },
        { status: 200, headers: getCorsHeaders(req) }
      );
    } else {
      await db
        .update(purchasesMobile)
        .set({
          validationFailCount: sql`${purchasesMobile.validationFailCount} + 1`,
        })
        .where(eq(purchasesMobile.purchaseId, purchaseId));

      return NextResponse.json(
        { valid: false },
        { status: 200, headers: getCorsHeaders(req) }
      );
    }
  } catch (error) {
    console.error("/api/public/validate-mobile-purchase error", error);
    return NextResponse.json(
      { valid: false, error: "Internal Server Error" },
      { status: 500, headers: getCorsHeaders(req) }
    );
  }
}
