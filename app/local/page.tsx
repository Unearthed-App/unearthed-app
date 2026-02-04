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

import { Metadata } from "next";
import React from "react";
import { CheckoutLocal } from "@/components/CheckoutLocal";
import { NonPremiumNavigation } from "@/components/NonPremiumNavigation";
import { LocalScreenshots } from "./LocalScreenshots";

export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata: Metadata = {
  title:
    "Unearthed Local – Privacy-First Readwise Alternative | One-Time Purchase",
  description:
    "Open-source privacy-first Readwise alternative. One-time purchase desktop app for local-only Kindle and KOReader highlight syncing to Obsidian. No subscriptions, no cloud, complete data ownership. Own your reading data forever.",
  keywords: [
    "readwise alternative",
    "privacy-first readwise",
    "local readwise alternative",
    "one-time purchase readwise",
    "kindle to obsidian",
    "local kindle sync",
    "offline kindle highlights",
    "brutalist software",
    "one time purchase",
    "version policy",
    "personal knowledge management",
    "privacy-focused",
    "desktop app",
    "local storage",
    "data ownership",
    "no subscription",
    "KOReader sync",
    "kindle highlights local",
    "readwise without subscription",
    "readwise desktop app",
    "open source readwise",
  ],
  alternates: {
    canonical: "https://unearthed.app/local",
  },
  openGraph: {
    title:
      "Unearthed Local - Privacy-First Readwise Alternative | One-Time Purchase",
    description:
      "Open-source privacy-first Readwise alternative. One-time purchase desktop app for local-only Kindle and KOReader highlight syncing to Obsidian. No subscriptions, complete data ownership.",
    type: "website",
    url: "https://unearthed.app/local",
    siteName: "Unearthed",
    locale: "en_US",
    images: [
      {
        url: "https://unearthed.app/images/banner.webp",
        width: 1200,
        height: 630,
        alt: "Unearthed Local - Privacy-focused desktop app for Kindle sync to Obsidian",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@unearthedapp",
    title: "Unearthed Local – Privacy-First Readwise Alternative",
    description:
      "One-time purchase privacy-first Readwise alternative. Local-only Kindle sync to Obsidian with complete data ownership.",
    images: ["https://unearthed.app/images/banner.webp"],
  },
};

const UnearthedLocal = () => {
  return (
    <>
      <div className="min-h-screen p-4 pt-16 md:pt-24">
        <NonPremiumNavigation currentPage="local" />
        <div className="font-mono flex flex-col items-center justify-center">

          <header className="w-full text-center border-b-4 border-black pb-4 mb-8">
            <h1 className="text-5xl font-extrabold uppercase">
              Unearthed Local
            </h1>
            <p className="text-xl mt-2">Kindle/KOReader → Obsidian</p>
            <p className="text-base mt-2 italic">
              Yes this is different to unearthed.app
            </p>
          </header>

          {/* Docs Link Banner */}
          <a
            href="/local-docs"
            className="group w-full max-w-2xl mb-10 block"
          >
            <div className="relative bg-alternate dark:bg-primary text-primary-foreground border-4 border-black p-5 shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-150">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    <path d="M8 7h6" />
                    <path d="M8 11h8" />
                  </svg>
                  <div>
                    <p className="text-xl font-black uppercase tracking-wide">Read the Docs</p>
                    <p className="text-sm opacity-90">Installation guides, features, troubleshooting</p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>

          <LocalScreenshots />

          <main className="max-w-4xl w-full rounded-xl border-4 border-black p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
            <section className="mb-8">
              <h2 className="text-3xl font-bold underline mb-4">
                Full Local Control.
              </h2>
              <p className="text-lg leading-relaxed">
                Unearthed <strong>Local</strong> syncs your Kindle books and
                highlights <strong>directly</strong> to your computer. No cloud.
                No middleman. No monthly bill. Perfect for{" "}
                <strong>Obsidian</strong>.
                <br />
                <br />
                You don&apos;t need a special Obsidian plugin.
                <br />
                <br />
                You don&apos;t need to plug in a device.
                <br />
                <br />
                You&apos;ll even get a Daily Reflection added to your Obsidian
                daily note.
                <br /> <br />
                <span className="font-bold">
                  Take back your gathered thoughts and store them where{" "}
                  <u>you</u> want them.
                </span>
              </p>
              <p className="text-lg leading-relaxed">
                BTW this also works with KOReader, so get all your notes and
                highlights in one place!
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-3xl font-bold underline mb-4">
                No Subscriptions.
              </h2>
              <p className="text-lg leading-relaxed">
                Buy <strong>once</strong>. Keep <strong>forever</strong>. You
                will get free updates for whatever version that you purchase.{" "}
                <span className="italic">
                  EG. If you buy version <code>1.0.6</code>, you can download
                  every update up to <code>1.9.9</code> for free.
                </span>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-3xl font-bold underline mb-4">
                Cross-Platform.
              </h2>
              <p className="text-lg leading-relaxed">
                Unearthed Local works on <strong>Windows</strong>,{" "}
                <strong>macOS</strong>, and <strong>Linux</strong>.
                One-time purchase across all platforms. Download and run on
                whatever system you prefer.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-3xl font-bold underline mb-4">
                Simple Setup.
              </h2>
              <ul className="list-disc pl-6 text-lg space-y-2">
                <li>
                  Connect Kindle (and/or KOReader) to the app (no Amazon
                  credentials stored or viewed) - note you do{" "}
                  <strong>not</strong> need to plug in a device to your computer
                </li>
                <li>Tell Unearthed where your vault is</li>
                <li>Let the auto sync keep your library up to date</li>
                <li>
                  Done - You can let it run in the background if you&apos;d like
                  - You don&apos;t even need to open the app after that!
                </li>
              </ul>
            </section>

            <section className="mt-12 border-t-4 border-black pt-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Own Your Reading Life</h2>
              <p className="mb-8 text-lg">No subscriptions. No lock-in.</p>
              <CheckoutLocal />
            </section>
          </main>

          <footer className="mt-12 text-sm text-center opacity-70">
            &copy; 2025 Unearthed App. All rights reserved.
          </footer>
        </div>
      </div>
    </>
  );
};

export default UnearthedLocal;
