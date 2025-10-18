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

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Crimson_Pro } from "next/font/google";
import Link from "next/link";

const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

export interface ProductComparisonCardProps {
  title: string;
  subtitle: string;
  pricing: {
    amount: string;
    model: string;
    description: string;
  };
  features: string[];
  ctaText: string;
  ctaLink: string;
  colorScheme: "local" | "online";
  className?: string;
}

const colorSchemes = {
  local: {
    background: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-600 dark:border-green-500",
    accent: "text-green-600 dark:text-green-400",
    shadow:
      "shadow-[8px_8px_0px_rgba(22,163,74,1)] dark:shadow-[8px_8px_0px_rgba(34,197,94,0.3)]",
    hoverShadow:
      "hover:shadow-[4px_4px_0px_rgba(22,163,74,1)] dark:hover:shadow-[4px_4px_0px_rgba(34,197,94,0.3)]",
    activeShadow:
      "active:shadow-[2px_2px_0px_rgba(22,163,74,1)] dark:active:shadow-[2px_2px_0px_rgba(34,197,94,0.3)]",
    checkIcon: "text-green-600 dark:text-green-400",
    checkBg: "bg-green-600 dark:bg-green-500",
  },
  online: {
    background: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-600 dark:border-blue-500",
    accent: "text-blue-600 dark:text-blue-400",
    shadow:
      "shadow-[8px_8px_0px_rgba(37,99,235,1)] dark:shadow-[8px_8px_0px_rgba(59,130,246,0.3)]",
    hoverShadow:
      "hover:shadow-[4px_4px_0px_rgba(37,99,235,1)] dark:hover:shadow-[4px_4px_0px_rgba(59,130,246,0.3)]",
    activeShadow:
      "active:shadow-[2px_2px_0px_rgba(37,99,235,1)] dark:active:shadow-[2px_2px_0px_rgba(59,130,246,0.3)]",
    checkIcon: "text-blue-600 dark:text-blue-400",
    checkBg: "bg-blue-600 dark:bg-blue-500",
  },
} as const;

export function ProductComparisonCard({
  title,
  subtitle,
  pricing,
  features,
  ctaText,
  ctaLink,
  colorScheme,
  className = "",
}: ProductComparisonCardProps) {
  const colors = colorSchemes[colorScheme];
  const buttonVariant = colorScheme === "local" ? "brutal" : "brutalprimary";

  return (
    <article
      className={`
        ${colors.background} 
        ${colors.border} 
        ${colors.shadow}
        ${colors.hoverShadow}
        ${colors.activeShadow}
        border-2 rounded-lg p-4 sm:p-6 transition-all duration-200 
        hover:translate-x-[4px] hover:translate-y-[4px]
        active:translate-x-[6px] active:translate-y-[6px]
        flex flex-col h-full
        focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-background
        ${colorScheme === "local" ? "focus-within:ring-green-500" : "focus-within:ring-blue-500"}
        ${className}
      `}
      role="article"
      aria-labelledby={`${colorScheme}-title`}
      aria-describedby={`${colorScheme}-description`}
    >
      {/* Header */}
      <header className="mb-4">
        <h3
          id={`${colorScheme}-title`}
          className={`${crimsonPro.className} font-extrabold text-xl sm:text-2xl md:text-3xl ${colors.accent} mb-2 leading-tight`}
        >
          {title}
        </h3>
        <p
          id={`${colorScheme}-description`}
          className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed"
        >
          {subtitle}
        </p>

        {/* Pricing */}
        <div className="mb-4" role="region" aria-label={`Pricing for ${title}`}>
          <div className="flex items-baseline space-x-2 mb-1">
            <span
              className={`${crimsonPro.className} font-extrabold text-xl sm:text-2xl md:text-3xl ${colors.accent}`}
              aria-label={`Price: ${pricing.amount} ${pricing.model}`}
            >
              {pricing.amount}
            </span>
            <span className="text-sm text-muted-foreground">
              {pricing.model}
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">
            {pricing.description}
          </p>
        </div>
      </header>

      {/* Features List */}
      <section className="flex-grow mb-6" aria-label={`Features of ${title}`}>
        <ul className="space-y-2 sm:space-y-3" role="list">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start space-x-3"
              role="listitem"
            >
              <div
                className={`${colors.checkBg} rounded-full p-0.5 flex-shrink-0 mt-0.5 sm:mt-1`}
                aria-hidden="true"
              >
                <CheckCircle className={`w-3 h-3 md:w-4 md:h-4 text-white`} />
              </div>
              <span className="text-xs sm:text-sm md:text-base leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA Button */}
      <footer className="mt-auto">
        <Link
          href={ctaLink}
          className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background rounded-md"
          aria-label={`${ctaText} for ${title}`}
        >
          <Button
            variant={buttonVariant}
            className="w-full text-sm md:text-base font-bold min-h-[44px] touch-manipulation"
            tabIndex={-1}
          >
            {ctaText}
          </Button>
        </Link>
      </footer>
    </article>
  );
}
