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

"use client";

import { ProductComparisonCard } from "./ProductComparisonCard";
import { NonPremiumNavigation } from "./NonPremiumNavigation";

export const LoggedInHome = () => {
  // Product data for the comparison cards
  const localProduct = {
    title: "Unearthed Local",
    subtitle: "Privacy-first desktop application",
    pricing: {
      amount: "$13",
      model: "one-time",
      description: "Buy once, keep forever",
    },
    features: [
      "No unearthed.app required",
      "Daily Reflections",
      "Kindle and KOReader input",
      "Sync with Obsidian (may expand later)",
      "Complete privacy - runs on your computer",
      "No monthly fees or subscriptions",
      "Cross-platform: Windows, macOS, Linux (soon)",
      "Free updates within major version",
    ],
    ctaText: "Learn More",
    ctaLink: "/local",
    colorScheme: "local" as const,
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
      "Daily Reflections",
      "Kindle, KOReader, and manual input",
      "Sync with Obsidian, Notion, Capacities, Supernotes",
      "Not device dependent",
      "Includes Unearthed Local download",
      "Book recommendations based on similar books and opposing viewpoints",
      "Comprehensive tagging system",
      "AI features to help you learn (and not to replace your brain)",
    ],
    ctaText: "Get Online",
    ctaLink: "/dashboard/get-premium",
    colorScheme: "online" as const,
  };

  return (
    <div className="min-h-screen p-4 pt-16 md:pt-24">
      {/* Enhanced Navigation Header */}
      <NonPremiumNavigation currentPage="home" />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto font-mono">
        <header className="text-center border-b-4 border-black dark:border-white pb-6 md:pb-8 mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold uppercase mb-4 leading-tight text-black dark:text-white">
            Unearthed has changed
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground">
            You Have Two Options
          </p>
        </header>

        {/* Product Comparison using ProductComparisonCard */}
        <section
          className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12"
          aria-label="Product comparison between Unearthed Local and Online"
        >
          <ProductComparisonCard {...localProduct} />
          <ProductComparisonCard {...onlineProduct} />
        </section>

        {/* Why This Change */}
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
