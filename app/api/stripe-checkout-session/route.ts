/**
 * Copyright (C) 2024 Unearthed App
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
import { auth, clerkClient } from "@clerk/nextjs/server";

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
  const { userId }: { userId: string | null } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const userEmail = user.emailAddresses[0].emailAddress;

  try {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
      automatic_tax: { enabled: true },
      metadata: {
        userId: userId,
        priceId: process.env.STRIPE_PRICE_ID,
      },
      customer_email: userEmail,
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
      distinctId: "notion-insert-jobs cron",
      event: `notion-insert-jobs cron ERROR`,
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
