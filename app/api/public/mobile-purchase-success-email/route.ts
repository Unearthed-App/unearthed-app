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
import Stripe from "stripe";
import { PurchaseConfirmationError, sendPurchaseConfirmation } from "@/server/purchase-confirmation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json().catch(() => ({}));
    if (typeof sessionId !== "string" || !sessionId || sessionId.length > 255) {
      return NextResponse.json({ error: "Invalid sessionId" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    await sendPurchaseConfirmation(session, "mobile");
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof PurchaseConfirmationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Could not send mobile purchase confirmation");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
