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

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import PostHogClient from "@/app/posthog";
import { generateUUID } from "@/lib/utils";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  const posthogClient = PostHogClient();
  const headersList = await headers();
  const origin = headersList.get("origin");
  const purchaseId = generateUUID();

  try {
    posthogClient.capture({
      distinctId: purchaseId,
      event: `stripe-checkout-session-mobile START`,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/mobile-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/mobile`,
      line_items: [
        {
          price: process.env.STRIPE_MOBILE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        purchaseId,
        productName: process.env.STRIPE_MOBILE_PRODUCT_NAME,
        productId: process.env.STRIPE_MOBILE_PRODUCT_ID,
        priceId: process.env.STRIPE_MOBILE_PRICE_ID,
      },
    });

    return NextResponse.json(
      { url: session.url },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in mobile Stripe checkout:", error);
    posthogClient.capture({
      distinctId: purchaseId,
      event: `stripe-checkout-session-mobile ERROR`,
      properties: {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    });

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
