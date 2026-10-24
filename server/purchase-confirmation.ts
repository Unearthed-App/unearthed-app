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

import "server-only";

import type Stripe from "stripe";
import { Resend } from "resend";
import PurchaseConfirmation from "@/emails/purchase-confirmation";
import MobilePurchaseConfirmation from "@/emails/mobile-purchase-confirmation";

export class PurchaseConfirmationError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

export async function sendPurchaseConfirmation(session: Stripe.Checkout.Session, edition: "local" | "mobile") {
  if (session.mode !== "payment" || session.status !== "complete" || session.payment_status !== "paid") {
    throw new PurchaseConfirmationError("Payment not completed", 409);
  }

  const productId = edition === "local" ? process.env.STRIPE_LOCAL_PRODUCT_ID : process.env.STRIPE_MOBILE_PRODUCT_ID;
  if (!productId || session.metadata?.productId !== productId) {
    throw new PurchaseConfirmationError("Invalid purchase", 400);
  }

  const purchaseId = edition === "local" ? session.metadata.distinctId : session.metadata.purchaseId;
  const email = session.customer_details?.email;
  if (!email || !purchaseId) {
    throw new PurchaseConfirmationError("Purchase details not found", 400);
  }

  const productName = session.metadata.productName || (edition === "local" ? "Unearthed Local" : "Unearthed Mobile");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "Unearthed <contact@unearthed.app>",
    to: [email],
    subject: `Your ${productName} Purchase Confirmation`,
    react: edition === "local"
      ? PurchaseConfirmation({ productName, purchaseId, downloadUrl: "https://unearthed.app/local-download" })
      : MobilePurchaseConfirmation({ productName, purchaseId }),
  }, { idempotencyKey: `purchase-confirmation-${edition}-${session.id}` });

  if (error) throw new PurchaseConfirmationError("Could not send purchase confirmation", 502);
}
