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
import { Resend } from "resend";
import PurchaseConfirmation from "@/emails/purchase-confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const metadata = session.metadata || {};
    const productName = metadata.productName ?? "Unearthed Local";
    const distinctId = metadata.distinctId ?? "";

    const email = session.customer_details?.email
      ? session.customer_details.email
      : typeof session.customer === "object" && session.customer?.email
        ? session.customer.email
        : undefined;

    if (!email) {
      return NextResponse.json(
        { error: "Customer email not found" },
        { status: 400 }
      );
    }

    const subject = `Your ${productName} Purchase Confirmation`;
    const downloadUrl = "https://unearthed.app/local-download";

    const { data, error } = await resend.emails.send({
      from: "Unearthed <contact@unearthed.app>",
      to: [email],
      subject,
      react: PurchaseConfirmation({
        productName,
        purchaseId: distinctId,
        downloadUrl,
      }),
    });

    if (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Resend error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("purchase-success-email error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
