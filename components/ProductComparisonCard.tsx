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
import { CheckCircle } from "lucide-react";
import { Crimson_Pro } from "next/font/google";
import Link from "next/link";
import { motion } from "motion/react";

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
  colorScheme: "local" | "online" | "mobile";
  className?: string;
  customCta?: React.ReactNode;
  nestedCard?: React.ReactNode;
}

const colorSchemes = {
  online: {
    background:
      "bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-50 dark:from-teal-950/30 dark:via-cyan-950/30 dark:to-teal-950/30",
    border: "border-teal-500 dark:border-teal-400",
    accent: "text-teal-600 dark:text-teal-400",
    accentGradient:
      "bg-gradient-to-br from-teal-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-400",
    shadow: "shadow-[8px_8px_0px_rgba(37,177,166,1)]",
    hoverShadow: "hover:shadow-[12px_12px_0px_rgba(37,177,166,1)]",
    activeShadow: "active:shadow-[6px_6px_0px_rgba(37,177,166,1)]",
    checkIcon: "text-white",
    checkBg:
      "bg-gradient-to-br from-teal-500 to-cyan-500 dark:from-teal-500 dark:to-cyan-500",
    glowColor: "from-teal-500/20 to-cyan-500/20",
    focusRing: "focus-within:ring-teal-500",
  },
  local: {
    background:
      "bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-orange-950/30",
    border: "border-orange-500 dark:border-orange-400",
    accent: "text-orange-600 dark:text-orange-400",
    accentGradient:
      "bg-gradient-to-br from-orange-600 via-orange-500 to-red-600 dark:from-orange-400 dark:to-red-400",
    shadow: "shadow-[8px_8px_0px_rgba(246,110,27,1)]",
    hoverShadow: "hover:shadow-[12px_12px_0px_rgba(246,110,27,1)]",
    activeShadow: "active:shadow-[6px_6px_0px_rgba(246,110,27,1)]",
    checkIcon: "text-white",
    checkBg:
      "bg-gradient-to-br from-orange-600 to-red-600 dark:from-orange-500 dark:to-red-500",
    glowColor: "from-orange-500/20 to-red-500/20",
    focusRing: "focus-within:ring-orange-500",
  },
  mobile: {
    background:
      "bg-gradient-to-br from-purple-50 via-violet-50 to-purple-50 dark:from-purple-950/30 dark:via-violet-950/30 dark:to-purple-950/30",
    border: "border-purple-500 dark:border-purple-400",
    accent: "text-purple-600 dark:text-purple-400",
    accentGradient:
      "bg-gradient-to-br from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400",
    shadow: "shadow-[8px_8px_0px_rgba(124,58,237,1)]",
    hoverShadow: "hover:shadow-[12px_12px_0px_rgba(124,58,237,1)]",
    activeShadow: "active:shadow-[6px_6px_0px_rgba(124,58,237,1)]",
    checkIcon: "text-white",
    checkBg:
      "bg-gradient-to-br from-purple-600 to-violet-600 dark:from-purple-500 dark:to-violet-500",
    glowColor: "from-purple-500/20 to-violet-500/20",
    focusRing: "focus-within:ring-purple-500",
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
  customCta,
  nestedCard,
}: ProductComparisonCardProps) {
  const colors = colorSchemes[colorScheme];
  const buttonVariant = colorScheme === "online" ? "brutalprimary" : "brutal";

  return (
    <div className="group relative h-full">
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${colors.glowColor} rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <motion.article
        className={`
          relative
          ${colors.background}
          ${colors.border}
          ${colors.shadow}
          ${colors.hoverShadow}
          ${colors.activeShadow}
          border-3 rounded-2xl p-6 sm:p-8 transition-all duration-300
          flex flex-col h-full
          focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-background
          ${colors.focusRing}
          overflow-hidden
          ${className}
        `}
        role="article"
        aria-labelledby={`${colorScheme}-title`}
        aria-describedby={`${colorScheme}-description`}
        whileHover={{
          translateX: 4,
          translateY: 4,
          transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        }}
        whileTap={{
          translateX: 6,
          translateY: 6,
        }}
      >
        <motion.div
          className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${colors.glowColor} rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500`}
        />

        <header className="mb-6 relative">
          <h3
            id={`${colorScheme}-title`}
            className={`${crimsonPro.className} font-black text-2xl sm:text-3xl md:text-4xl mb-3 leading-tight`}
          >
            <span className={`${colors.accentGradient} bg-clip-text text-transparent`}>
              {title}
            </span>
          </h3>
          <p
            id={`${colorScheme}-description`}
            className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed font-medium"
          >
            {subtitle}
          </p>

          <div
            className="mb-6 p-4 rounded-xl border-2 border-black bg-card/50 backdrop-blur-sm"
            role="region"
            aria-label={`Pricing for ${title}`}
          >
            <div className="flex items-baseline space-x-2 mb-2">
              <span
                className={`${crimsonPro.className} font-black text-3xl sm:text-4xl md:text-5xl ${colors.accentGradient} bg-clip-text text-transparent`}
                aria-label={`Price: ${pricing.amount} ${pricing.model}`}
              >
                {pricing.amount}
              </span>
              <span className="text-base font-bold text-muted-foreground">
                {pricing.model}
              </span>
            </div>
            <p className="text-sm md:text-base text-muted-foreground font-medium">
              {pricing.description}
            </p>
          </div>
        </header>

        <section
          className="flex-grow mb-6 relative"
          aria-label={`Features of ${title}`}
        >
          <ul className="space-y-3 sm:space-y-4" role="list">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                className="flex items-start space-x-3 group/item"
                role="listitem"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03, duration: 0.4 }}
              >
                <div
                  className={`${colors.checkBg} rounded-full p-1 flex-shrink-0 mt-0.5 shadow-md group-hover/item:scale-110 transition-transform duration-200`}
                  aria-hidden="true"
                >
                  <CheckCircle className={`w-4 h-4 ${colors.checkIcon}`} />
                </div>
                <span className="text-sm sm:text-base md:text-base leading-relaxed font-medium text-foreground/90">
                  {feature}
                </span>
              </motion.li>
            ))}
          </ul>
        </section>

        {nestedCard && (
          <div className="mb-6 relative">
            {nestedCard}
          </div>
        )}

        <footer className="mt-auto relative">
          {customCta ? (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {customCta}
            </motion.div>
          ) : (
            <Link
              href={ctaLink}
              className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background rounded-xl"
              aria-label={`${ctaText} for ${title}`}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant={buttonVariant}
                  className="w-full text-base md:text-lg font-black min-h-[52px] touch-manipulation shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all duration-300 border-3"
                  tabIndex={-1}
                >
                  {ctaText}
                </Button>
              </motion.div>
            </Link>
          )}
        </footer>
      </motion.article>
    </div>
  );
}
