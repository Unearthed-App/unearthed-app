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

import { db } from "@/db";
import { purchases, unearthedLocalVersions } from "@/db/schema";
import { eq } from "drizzle-orm";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import CopyDistinctId from "@/components/CopyDistinctId";
type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Purchase Successful - Unearthed",
  description: "Thank you for your purchase.",
};

export default async function UnearthedLocalSuccess({
  searchParams,
}: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;

  const somethingWentWrong = (
    <main className="p-6 pt-24">
      <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
    </main>
  );

  function formatVersion(versionNum: number) {
    // Convert the number to a string
    let s = versionNum.toString();

    // Pad with a leading zero if the length is less than 3
    if (s.length < 3) {
      s = "0" + s;
    }

    // Insert periods between the digits
    let formattedString = s.split("").join(".");

    return formattedString;
  }

  if (!sessionId) {
    return somethingWentWrong;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const status = session.payment_status;

    const metadata = session.metadata || {};
    const version = metadata.version;
    const distinctId = metadata.distinctId;
    const productName = metadata.productName ?? "Empty";
    const productId = metadata.productId ?? "Empty";
    const priceId = metadata.priceId ?? "Empty";

    const email = session.customer_details?.email
      ? session.customer_details.email
      : typeof session.customer === "object" && session.customer?.email
        ? session.customer.email
        : "Empty";

    await db
      .insert(purchases)
      .values({
        version,
        productName,
        productId,
        priceId,
        email,
        sessionId,
        distinctId,
        status,
      })
      .onConflictDoNothing();

    if (status !== "paid") {
      return (
        <main className="p-6 pt-24">
          <h1 className="text-2xl font-bold mb-4">Payment not completed.</h1>
          <p>
            Please email contact@unearthed.com if you believe this is an error.
          </p>
        </main>
      );
    }

    const unearthedLocalVersionsList =
      await db.query.unearthedLocalVersions.findFirst({
        where: eq(unearthedLocalVersions.productName, productName),
        orderBy: (versions, { desc }) => [desc(versions.version)],
      });
    console.log("unearthedLocalVersionsList", unearthedLocalVersionsList);
    console.log("productName", productName);

    return (
      <>
        {unearthedLocalVersionsList ? (
          <main className="min-h-screen flex items-center justify-center px-4 sm:px-6   text-black dark:text-white pt-24 pb-12">
            <div className="w-full max-w-3xl space-y-6">
              {/* Header */}
              <section className="border-4 border-black dark:border-white p-6 rounded-lg shadow-[6px_6px_0_0_rgba(0,0,0,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)]">
                <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight mb-4 text-center">
                  Purchase Complete
                </h1>
                <p className="text-lg font-medium text-center">
                  Thanks for supporting Unearthed! Your files are ready to
                  download.
                </p>
              </section>

              {/* Download Section */}
              <section className="border-4 border-black dark:border-white p-6 rounded-lg shadow-[6px_6px_0_0_rgba(0,0,0,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)]">
                <h2 className="text-2xl font-bold uppercase mb-4 text-center">
                  Download Version{" "}
                  {formatVersion(unearthedLocalVersionsList.version)}
                </h2>
                <p className="mb-6 text-base font-medium text-center">
                  Choose your platform
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild>
                    <a
                      href={unearthedLocalVersionsList.productLinkWindows!}
                      target="_blank"
                    >
                      Windows
                    </a>
                  </Button>
                  <Button asChild>
                    <a
                      href={unearthedLocalVersionsList.productLinkMacIntel!}
                      target="_blank"
                    >
                      Mac (Intel)
                    </a>
                  </Button>
                  <Button asChild>
                    <a
                      href={unearthedLocalVersionsList.productLinkMacSilicon!}
                      target="_blank"
                    >
                      Mac (Apple Silicon)
                    </a>
                  </Button>
                  <Button asChild>
                    <a
                      href={unearthedLocalVersionsList.productLinkLinux!}
                      target="_blank"
                    >
                      Linux
                    </a>
                  </Button>
                </div>
              </section>

              {/* Purchase ID */}
              <section className="border-4 border-black dark:border-white p-6 rounded-lg shadow-[6px_6px_0_0_rgba(0,0,0,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)]">
                <h3 className="text-xl font-bold uppercase mb-3 text-center">
                  Your Purchase ID
                </h3>
                <p className="text-sm font-medium mb-4 text-center">
                  Save this Purchase ID in a safe place — you&apos;ll need it
                  for future updates.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-6 w-full px-2">
                  <div className="w-full sm:w-auto max-w-full sm:max-w-none">
                    <CopyDistinctId distinctId={distinctId} />
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-center px-2">
                  This is a <strong>one-time payment</strong> for this version
                  of Unearthed Local. For Example: if you purchase version one,
                  you can download updates from <code>1.0.0</code> up to{" "}
                  <code>1.9.9</code> by returning to{" "}
                  <a
                    href="https://unearthed.app/local-download"
                    className="underline decoration-2 decoration-black dark:decoration-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                  >
                    unearthed.app/local-download
                  </a>{" "}
                  and entering your Purchase ID.
                </p>
              </section>

              {/* Support Info */}
              <footer className="mt-6 text-xs font-mono text-center px-2">
                If your download doesn’t work, email{" "}
                <a
                  href="mailto:contact@unearthed.com"
                  className="underline decoration-2 decoration-black dark:decoration-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                  contact@unearthed.com
                </a>{" "}
                from the same email you used for your purchase.
              </footer>
            </div>
          </main>
        ) : (
          <main className="p-6 pt-24">
            <h1 className="text-2xl font-bold mb-4">
              bbbb Something went wrong.
            </h1>
            <p>
              Please email contact@unearthed.com if you believe this is an
              error.
            </p>
          </main>
        )}
      </>
    );
  } catch (error) {
    console.error("Stripe session error:", error);
    return somethingWentWrong;
  }
}
