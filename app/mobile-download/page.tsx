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
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PwaInstructions } from "@/components/PwaInstructions";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function MobileDownload() {
  const [purchaseId, setPurchaseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valid, setValid] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValid(false);

    if (!purchaseId.trim()) {
      setError("Please enter your Purchase ID.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/public/validate-mobile-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseId: purchaseId.trim() }),
      });

      const data = await res.json();

      if (!data?.valid) {
        setError(
          "Purchase ID not found. Double-check your ID or email contact@unearthed.app for help."
        );
        return;
      }

      setValid(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-16">
      <h1 className="text-3xl font-black mb-2">Access Unearthed Mobile</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Enter your Purchase ID to verify your purchase and get instructions for
        accessing the app.
      </p>

      <form
        onSubmit={onSubmit}
        className="flex flex-col sm:flex-row gap-2 mb-8 w-full"
      >
        <Input
          type="text"
          value={purchaseId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPurchaseId(e.target.value)
          }
          placeholder="Enter your Purchase ID"
          className="w-full sm:flex-1"
        />
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Checking..." : "Verify"}
        </Button>
      </form>

      {error && (
        <div className="mb-6 p-3 border-2 border-red-500 text-red-700 dark:text-red-400 rounded-md bg-red-50 dark:bg-red-950/30">
          {error}
        </div>
      )}

      {valid && (
        <div className="border-2 border-black rounded-md overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-card">
          <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-black bg-muted/50">
            <span className="text-lg font-black">Purchase Verified</span>
            <span className="text-xs font-bold px-2 py-0.5 bg-primary text-primary-foreground rounded border border-black">
              VALID
            </span>
          </div>
          <div className="p-4 space-y-4 text-sm">
            <p>
              Your Purchase ID is valid. Here&apos;s how to access Unearthed
              Mobile:
            </p>
            <ol className="space-y-3">
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
                  Enter your Purchase ID when prompted to unlock the app.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-black text-xs border-2 border-black">
                  3
                </span>
                <span>
                  Connect to your Unearthed Local instance (running on your
                  desktop/home network)
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
      )}
    </main>
  );
}
