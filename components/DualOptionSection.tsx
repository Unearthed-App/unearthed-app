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

import {
  ProductComparisonCard,
  ProductComparisonCardProps,
} from "./ProductComparisonCard";
import { Crimson_Pro } from "next/font/google";

const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

interface DualOptionSectionProps {
  className?: string;
}

// Product data structure with features, pricing, and CTA information
const productOptions: Omit<ProductComparisonCardProps, "className">[] = [
  {
    title: "Unearthed Local",
    subtitle: "Privacy-first desktop app with one-time purchase",
    pricing: {
      amount: "$13",
      model: "one-time",
      description: "Own it forever, no subscriptions",
    },
    features: [
      "Auto sync - no need to plug in your device",
      "Complete privacy - your data stays on your device",
      "Desktop app for Windows, Mac, and Linux (soon)",
      "Import from Kindle and KOReader",
      "Local search and filtering",
      "Daily Reflection within the app and synced to Obsidian",
      "Auto sync by running in the background",
      "Direct sync to your local Obsidian vault",
      "No Amazon credentials stored or viewed",
      "No recurring fees or subscriptions - keep it forever",
      "Free updates for your major version (e.g., 1.x.x)",
      "Keep it forever",
    ],
    ctaText: "Learn More",
    ctaLink: "/local",
    colorScheme: "local" as const,
  },
  {
    title: "Unearthed Online",
    subtitle: "Full-featured cloud experience with premium benefits",
    pricing: {
      amount: "$5",
      model: "per month",
      description: "Cancel anytime",
    },
    features: [
      "Sync across all your devices seamlessly",
      "AI powered blind spot detection and insights (opt-in)",
      "AI chat with each book individually (opt-in)",
      "Advanced book analysis with themes and takeaways",
      "Auto-generate reflection questions",
      "Book recommendations (similar and contrasting viewpoints)",
      "Auto extract key ideas from highlights",
      "Interactive map to visualize book connections",
      "Daily email with personalised quotes",
      "Integrations with Obsidian, Notion, Capacities, and Supernotes",
      "Global search across all notes and tags",
      "Manual book/quote entry and CSV import",
      "Tag management with auto-detection",
      "No character limits on content",
      "Includes Unearthed Local download (keep forever)",
    ],
    ctaText: "Learn More",
    ctaLink: "/online",
    colorScheme: "online" as const,
  },
];

export function DualOptionSection({ className = "" }: DualOptionSectionProps) {
  return (
    <section
      className={`py-12 md:py-16 lg:py-20 ${className}`}
      aria-labelledby="dual-options-heading"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <header className="text-center mb-12 md:mb-16">
          <h2
            id="dual-options-heading"
            className={`${crimsonPro.className} font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 leading-tight`}
          >
            Choose Your Unearthed Experience
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Unearthed now comes in two varieties. Choose the option that best
            fits your needs.
          </p>
        </header>

        {/* Product Comparison Cards */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16"
          role="region"
          aria-label="Product comparison options"
        >
          {productOptions.map((product) => (
            <ProductComparisonCard
              key={product.colorScheme}
              {...product}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
