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

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import PostHogClient from "@/app/posthog";
import { generateUUID } from "@/lib/utils";
import { db } from "@/db";
import { unearthedLocalVersions } from "@/db/schema";
import { desc } from "drizzle-orm";

// import { auth, clerkClient } from "@clerk/nextjs/server";

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(request: NextRequest) {
  const posthogClient = PostHogClient();
  const headersList = await headers();
  const origin = headersList.get("origin");
  const distinctId = generateUUID();

  try {
    posthogClient.capture({
      distinctId: distinctId,
      event: `stripe-checkout-session-local START`,
    });
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    const latestVersionResult = await db
      .select({ version: unearthedLocalVersions.version })
      .from(unearthedLocalVersions)
      .orderBy(desc(unearthedLocalVersions.version))
      .limit(1);

    const latestVersion = latestVersionResult[0]?.version?.toString() || "1";

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/local-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
      line_items: [
        {
          price: process.env.STRIPE_LOCAL_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        distinctId,
        productName: process.env.STRIPE_LOCAL_PRODUCT_NAME,
        productId: process.env.STRIPE_LOCAL_PRODUCT_ID,
        priceId: process.env.STRIPE_LOCAL_PRICE_ID,
        version: latestVersion,
      },
    });

    return NextResponse.json(
      { url: session.url },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error in Stripe checkout:", error);
    posthogClient.capture({
      distinctId,
      event: `stripe-checkout-session-local ERROR`,
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
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}
