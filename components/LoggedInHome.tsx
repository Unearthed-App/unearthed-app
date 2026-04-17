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

import { ProductComparisonCard } from "./ProductComparisonCard";
import { Checkout } from "./Checkout";
import { CheckoutLocal } from "./CheckoutLocal";
import { CheckoutMobile } from "./CheckoutMobile";
import Link from "next/link";
import { Smartphone } from "lucide-react";
import { Crimson_Pro } from "next/font/google";

const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

const MobileNestedCard = () => (
  <div className="rounded-xl border-2 border-purple-400 dark:border-purple-500 bg-purple-50/80 dark:bg-purple-950/40 p-5">
    <div className="flex items-center gap-2 mb-3">
      <Smartphone className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0" />
      <span
        className={`${crimsonPro.className} font-black text-xl bg-gradient-to-br from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent`}
      >
        Unearthed Mobile
      </span>
      <span className="ml-auto shrink-0 whitespace-nowrap text-xs font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white">
        Not Included
      </span>
    </div>
    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
      A companion app for Unearthed Local that keeps your full reading library on your phone — synced locally over Wi-Fi. No cloud. No subscription.
    </p>
    <ul className="space-y-1.5 mb-4">
      {[
        "Browse Kindle & KOReader highlights offline",
        "Capture physical book quotes with your camera",
        "RSS feeds & read-it-later",
        "Daily Reflection on your phone",
        "One-time purchase · unlimited personal devices",
      ].map((f) => (
        <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5" />
          {f}
        </li>
      ))}
    </ul>
    <div className="flex flex-wrap gap-2">
      <CheckoutMobile className="border-2 border-purple-900 bg-purple-600 text-white shadow-[3px_3px_0px_rgb(88,28,135)] hover:bg-purple-700 hover:shadow-[1px_1px_0px_rgb(88,28,135)] dark:text-white dark:hover:bg-purple-700 text-sm py-1.5 px-3 h-auto" />
      <Link
        href="/mobile"
        className="ml-2 inline-flex items-center text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline"
      >
        Learn more →
      </Link>
    </div>
  </div>
);

export const LoggedInHome = () => {
  const localProduct = {
    title: "Unearthed Local",
    subtitle: "Privacy-first desktop application",
    pricing: {
      amount: "$13",
      model: "one-time",
      description: "Buy once, keep forever",
    },
    features: [
      "Complete privacy — all data stored locally in SQLite, never leaves your machine",
      "No unearthed.app account required",
      "No monthly fees or subscriptions",
      "Kindle highlights imported via built-in browser — auto-syncs hourly in background",
      "KOReader wireless sync — built-in API server, no USB cable needed",
      "RSS feeds & YouTube channels — subscribe and read full articles in-app",
      "Article highlighting, notes, and copy-to-clipboard",
      "Read It Later — bookmark articles, filter to saved-only view",
      "Obsidian export with customisable Markdown templates",
      "Daily Reflection — random quote inserted into your Obsidian daily note",
      "Global Search — Cmd+K across all books, quotes, notes, and articles",
      "System-wide shortcuts — import a URL from anywhere, even when minimised",
      "55+ keyboard shortcuts for fast navigation and insertion",
      "Cross-platform: Windows, macOS, Linux",
      "Run in background or from the menu bar",
      "Free updates within major version",
    ],
    ctaText: "Get Local",
    ctaLink: "/local",
    colorScheme: "local" as const,
    customCta: (
      <div className="flex flex-col gap-2">
        <Link href="/local" className="text-center text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline">
          Learn more →
        </Link>
        <CheckoutLocal className="w-full text-base md:text-lg font-black min-h-[52px] touch-manipulation border-3 bg-orange-600 hover:bg-orange-700 border-orange-900 shadow-[4px_4px_0px_rgb(154,52,18)] hover:shadow-[2px_2px_0px_rgb(154,52,18)] text-white dark:text-white dark:hover:bg-orange-700" />
      </div>
    ),
    nestedCard: <MobileNestedCard />,
  };

  const onlineProduct = {
    title: "Unearthed Online",
    subtitle: "Full-featured cloud solution",
    pricing: {
      amount: "$5",
      model: "per month",
      description: "Cancel anytime",
    },
    features: [
      "Also download 'Unearthed Local' (keep it forever)",
      "Automatic Kindle Import",
      "No character limit",
      "Global Search",
      "Select which books to sync",
      "Everything synced to Obsidian (including Tags)",
      "Daily Reflection in Unearthed",
      "Daily Reflection sent to Obsidian",
      "Daily Reflection sent to Supernotes",
      "Daily Reflection sent to Capacities",
      "Daily Reflection emailed to you",
      "KOReader highlights and notes imported",
      "Interactive map to visualize connections between books, quotes, notes, and tags",
      "Book recommendations based on similar books",
      "Book recommendations based on opposing viewpoints",
      "Personalised blind spot detection",
      "Notion Sync",
      "Manually add Books/Authors",
      "Manually add Quotes/Notes",
      "Import from CSV files",
      "Import from Kindle Clippings file",
      "Direct link to read on Kindle",
      "AI chat with each book",
      "Auto extract key ideas",
      "Auto generate reflection questions, and have your answers rated",
      "Tag your books and quotes, automatically and manually with inline text detection",
      "Apply tags globally to all relevant quotes/notes",
      "Generate book summary, themes, takeaways, reader's perspective",
      "Help keep this app alive ☺️",
    ],
    ctaText: "Get Online",
    ctaLink: "/dashboard/get-premium",
    colorScheme: "online" as const,
    customCta: (
      <Checkout className="w-full text-base md:text-lg font-black min-h-[52px] touch-manipulation shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all duration-300 border-3" />
    ),
  };

  return (
    <div className="min-h-screen p-4 pt-16 md:pt-24">
      <main className="max-w-6xl mx-auto mt-12">
        <header className="text-center border-b-4 border-black dark:border-white pb-6 md:pb-8 mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold uppercase mb-4 leading-tight text-black dark:text-white">
            Unearthed has changed
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground">
            There are now two options
          </p>
        </header>

        <section
          className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12"
          aria-label="Product comparison between Unearthed Local and Online"
        >
          <ProductComparisonCard {...onlineProduct} />
          <ProductComparisonCard {...localProduct} />
        </section>

        <aside
          className="border-4 border-black dark:border-white p-4 md:p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_rgba(255,255,255,0.3)] bg-gray-50 dark:bg-gray-900 mb-8 md:mb-12"
          role="complementary"
          aria-labelledby="why-change-title"
        >
          <h3
            id="why-change-title"
            className="text-lg sm:text-xl md:text-2xl font-bold uppercase mb-4 text-black dark:text-white"
          >
            Why This Change?
          </h3>
          <p className="text-sm sm:text-base md:text-lg mb-4 leading-relaxed text-gray-800 dark:text-gray-200">
            Unearthed has grown beyond what I expected (thank you! ☺️), but the
            vast majority of users were on the free tier. This meant that my
            hosting costs kept growing.
          </p>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-800 dark:text-gray-200">
            Rather than just shutting down, I&apos;ve tried to create two
            sustainable solutions that still give you control over your data.
          </p>
        </aside>
      </main>
    </div>
  );
};
