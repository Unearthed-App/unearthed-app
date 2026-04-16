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

export const dynamic = "force-dynamic";

import { db } from "@/db";
import { purchasesMobile } from "@/db/schema";
import { eq } from "drizzle-orm";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import type { Metadata } from "next";

import CopyDistinctId from "@/components/CopyDistinctId";
import { PwaInstructions } from "@/components/PwaInstructions";

type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Purchase Successful - Unearthed Mobile",
  description: "Thank you for your purchase.",
};

export default async function MobileSuccess({
  searchParams,
}: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;

  const somethingWentWrong = (
    <main className="p-6 pt-24">
      <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
    </main>
  );

  if (!sessionId) {
    return somethingWentWrong;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const status = session.payment_status;

    const metadata = session.metadata || {};
    const purchaseId = metadata.purchaseId;
    const productName = metadata.productName ?? "Unearthed Mobile";
    const productId = metadata.productId ?? "";
    const priceId = metadata.priceId ?? "";

    const email = session.customer_details?.email
      ? session.customer_details.email
      : typeof session.customer === "object" && session.customer?.email
        ? session.customer.email
        : "Empty";

    // Insert redundantly — webhook may already have done this
    await db
      .insert(purchasesMobile)
      .values({
        purchaseId,
        email,
        sessionId,
        productName,
        productId,
        priceId,
        status,
      })
      .onConflictDoNothing();

    if (status !== "paid") {
      return (
        <main className="p-6 pt-24">
          <h1 className="text-2xl font-bold mb-4">Payment not completed.</h1>
          <p>
            Please email{" "}
            <a
              href="mailto:contact@unearthed.app"
              className="underline font-bold"
            >
              contact@unearthed.app
            </a>{" "}
            if you believe this is an error.
          </p>
        </main>
      );
    }

    // Trigger confirmation email (fire and forget)
    fetch("/api/public/mobile-purchase-success-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    }).catch((err) =>
      console.error("Failed to send mobile purchase email:", err)
    );

    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-16">
        <h1 className="text-3xl font-black mb-2">Purchase Complete</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Thanks for supporting Unearthed! Save your Purchase ID below.
        </p>

        {/* Purchase ID */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 border-b-2 border-black dark:border-white pb-2">
            Your Purchase ID
          </h2>

          <div className="border-2 border-black rounded-md overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-card">
            <div className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Save this Purchase ID — you&apos;ll need it to unlock Unearthed
                Mobile on your devices.
              </p>
              <CopyDistinctId distinctId={purchaseId} />
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is a <strong>one-time payment</strong>. Your Purchase ID
                unlocks the app on all your personal devices.
              </p>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 border-b-2 border-black dark:border-white pb-2">
            Next Steps
          </h2>
          <div className="border-2 border-black rounded-md overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-card p-4 space-y-3">
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-black text-xs border-2 border-black">
                  1
                </span>
                <span>
                  Open{" "}
                  <a
                    href="https://mobile.unearthed.app"
                    className="underline font-bold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    mobile.unearthed.app
                  </a>{" "}
                  on your phone or tablet.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-black text-xs border-2 border-black">
                  2
                </span>
                <span>
                  Enter your Purchase ID above when prompted to unlock the app.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-black text-xs border-2 border-black">
                  3
                </span>
                <span>
                  Connect to the Unearthed Local app that is running on the same
                  network.
                </span>
              </li>
            </ol>

            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Installing the app
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                Unearthed Mobile is a PWA — it installs directly from your
                browser, no App Store required.
              </p>
              <PwaInstructions />
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Need help? Email{" "}
          <a
            href="mailto:contact@unearthed.app"
            className="underline font-bold"
          >
            contact@unearthed.app
          </a>{" "}
          from the same email you used for your purchase.
        </p>
      </main>
    );
  } catch (error) {
    console.error("Stripe session error:", error);
    return somethingWentWrong;
  }
}
