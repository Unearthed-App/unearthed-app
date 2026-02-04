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

export const dynamic = 'force-dynamic';

import { db } from "@/db";
import { purchases, unearthedLocalVersions } from "@/db/schema";
import { eq } from "drizzle-orm";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import CopyDistinctId from "@/components/CopyDistinctId";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
            Please email contact@unearthed.app if you believe this is an error.
          </p>
        </main>
      );
    }

    const versions = await db.query.unearthedLocalVersions.findMany({
      where: eq(unearthedLocalVersions.productName, productName),
      orderBy: (v, { desc }) => [desc(v.version)],
    });

    if (!versions.length) {
      return (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-16">
          <h1 className="text-3xl font-black mb-2">Something went wrong.</h1>
          <p className="text-sm text-muted-foreground">
            Please email contact@unearthed.app if you believe this is an error.
          </p>
        </main>
      );
    }

    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-16">
        <h1 className="text-3xl font-black mb-2">Purchase Complete</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Thanks for supporting Unearthed! Your files are ready to download.
        </p>

        {/* Purchase ID */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 border-b-2 border-black dark:border-white pb-2">
            Your Purchase ID
          </h2>

          <div className="border-2 border-black rounded-md overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-card">
            <div className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Save this Purchase ID in a safe place — you&apos;ll need it
                for future updates.
              </p>
              <CopyDistinctId distinctId={distinctId} />
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is a <strong>one-time payment</strong> for this version
                of Unearthed Local. For Example: if you purchase version one,
                you can download updates from <code className="text-xs bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded">1.0.0</code> up to{" "}
                <code className="text-xs bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded">1.9.9</code> by returning to{" "}
                <a
                  href="https://unearthed.app/local-download"
                  className="underline font-bold"
                >
                  unearthed.app/local-download
                </a>{" "}
                and entering your Purchase ID.
              </p>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 border-b-2 border-black dark:border-white pb-2">
            {productName}
          </h2>

          <div className="space-y-6">
            {versions.map((v, index) => (
              <div
                key={v.id}
                className={`border-2 border-black rounded-md overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-card ${
                  index === 0 ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                }`}
              >
                <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-black bg-muted/50">
                  <span className="text-lg font-black">
                    Version {v.version}
                  </span>
                  {index === 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 bg-primary text-primary-foreground rounded border border-black">
                      LATEST
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-4">
                  {v.changes && (
                    <div className="text-sm border-2 border-black/20 dark:border-white/20 rounded-md p-3 bg-muted/30">
                      <h4 className="font-bold text-xs uppercase tracking-wide text-muted-foreground mb-2">
                        Changes
                      </h4>
                      <ReactMarkdown
                        className="prose prose-sm dark:prose-invert max-w-none [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-0.5 [&_p]:my-1 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_code]:text-xs [&_code]:bg-black/10 [&_code]:dark:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded"
                        remarkPlugins={[remarkGfm]}
                      >
                        {v.changes}
                      </ReactMarkdown>
                    </div>
                  )}

                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wide text-muted-foreground mb-2">
                      Downloads
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {v.productLinkWindows && (
                        <Button asChild className="w-full">
                          <a href={v.productLinkWindows} target="_blank">
                            Windows
                          </a>
                        </Button>
                      )}
                      {v.productLinkMacIntel && (
                        <Button asChild className="w-full">
                          <a href={v.productLinkMacIntel} target="_blank">
                            macOS (Intel)
                          </a>
                        </Button>
                      )}
                      {v.productLinkMacSilicon && (
                        <Button asChild className="w-full">
                          <a href={v.productLinkMacSilicon} target="_blank">
                            macOS (ARM)
                          </a>
                        </Button>
                      )}
                      {v.productLinkLinux && (
                        <Button asChild className="w-full">
                          <a href={v.productLinkLinux} target="_blank">
                            Linux (DEB)
                          </a>
                        </Button>
                      )}
                      {v.productLinkLinuxRpm && (
                        <Button asChild className="w-full">
                          <a href={v.productLinkLinuxRpm} target="_blank">
                            Linux (RPM)
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Info */}
        <p className="text-xs text-muted-foreground">
          If your download doesn&apos;t work, email{" "}
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
