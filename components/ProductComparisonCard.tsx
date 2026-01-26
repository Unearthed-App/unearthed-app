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
  colorScheme: "local" | "online";
  className?: string;
}

const colorSchemes = {
  local: {
    background: "bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-green-950/30",
    border: "border-green-600 dark:border-green-500",
    accent: "text-green-600 dark:text-green-400",
    accentGradient: "bg-gradient-to-br from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400",
    shadow: "shadow-[8px_8px_0px_rgba(22,163,74,1)]",
    hoverShadow: "hover:shadow-[12px_12px_0px_rgba(22,163,74,1)]",
    activeShadow: "active:shadow-[6px_6px_0px_rgba(22,163,74,1)]",
    checkIcon: "text-white",
    checkBg: "bg-gradient-to-br from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500",
    glowColor: "from-green-500/20 to-emerald-500/20",
  },
  online: {
    background: "bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-blue-950/30",
    border: "border-blue-600 dark:border-blue-500",
    accent: "text-blue-600 dark:text-blue-400",
    accentGradient: "bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400",
    shadow: "shadow-[8px_8px_0px_rgba(37,99,235,1)]",
    hoverShadow: "hover:shadow-[12px_12px_0px_rgba(37,99,235,1)]",
    activeShadow: "active:shadow-[6px_6px_0px_rgba(37,99,235,1)]",
    checkIcon: "text-white",
    checkBg: "bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500",
    glowColor: "from-blue-500/20 to-cyan-500/20",
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
          ${colorScheme === "local" ? "focus-within:ring-green-500" : "focus-within:ring-blue-500"}
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

          <div className="mb-6 p-4 rounded-xl border-2 border-black bg-card/50 backdrop-blur-sm" role="region" aria-label={`Pricing for ${title}`}>
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

      <section className="flex-grow mb-8 relative" aria-label={`Features of ${title}`}>
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

      <footer className="mt-auto relative">
        <Link
          href={ctaLink}
          className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background rounded-xl"
          aria-label={`${ctaText} for ${title}`}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={buttonVariant}
              className="w-full text-base md:text-lg font-black min-h-[52px] touch-manipulation shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all duration-300 border-3"
              tabIndex={-1}
            >
              {ctaText}
            </Button>
          </motion.div>
        </Link>
      </footer>
    </motion.article>
    </div>
  );
}
