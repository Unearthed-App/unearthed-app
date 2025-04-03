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

import { Badge } from "@/components/ui/badge";

interface QuoteCardProps {
  quote: string;
  note?: string;
  location: string;
  color: string;
}

const colorLookup = {
  grey: {
    foreground: "bg-neutral-300 dark:bg-neutral-500 bg-opacity-100",
    background: "bg-neutral-300 bg-opacity-10",
    text: "text-neutral-700 dark:text-neutral-100",
    line: "border-neutral-300 dark:border-neutral-500",
    shadow: "",
    border: "border border-neutral-500/10 dark:border-neutral-500/10",
  },
  yellow: {
    foreground: "bg-yellow-300 dark:bg-yellow-500 bg-opacity-100",
    background: "bg-yellow-300 bg-opacity-10",
    text: "text-yellow-900 dark:text-yellow-100",
    line: "border-yellow-300 dark:border-yellow-500",
    shadow: "shadow-yellow-500/10 dark:shadow-yellow-700/10",
    border: "border border-yellow-500/10 dark:border-yellow-500/10",
  },
  blue: {
    foreground: "bg-blue-300 dark:bg-blue-500 bg-opacity-100",
    background: "bg-blue-600 bg-opacity-10",
    text: "text-blue-900 dark:text-blue-100",
    line: "border-blue-300 dark:border-blue-500",
    shadow: "shadow-blue-500/10 dark:shadow-blue-700/10",
    border: "border border-blue-500/10 dark:border-blue-500/10",
  },
  pink: {
    foreground: "bg-pink-300 dark:bg-pink-500 bg-opacity-100",
    background: "bg-pink-600 bg-opacity-10",
    text: "text-pink-900 dark:text-pink-100",
    line: "border-pink-300 dark:border-pink-500",
    shadow: "shadow-pink-500/10 dark:shadow-pink-700/10",
    border: "border border-pink-500/10 dark:border-pink-500/10",
  },
  orange: {
    foreground: "bg-orange-300 dark:bg-orange-500 bg-opacity-100",
    background: "bg-orange-600 bg-opacity-10",
    text: "text-orange-900 dark:text-orange-100",
    line: "border-orange-300 dark:border-orange-500",
    shadow: "shadow-orange-500/10 dark:shadow-orange-700/10",
    border: "border border-orange-500/10 dark:border-orange-500/10",
  },
} as const;

type ColorKey = keyof typeof colorLookup;

export function QuoteCard({ quote, note, location, color }: QuoteCardProps) {
  const matchingColor = Object.keys(colorLookup).find((key) =>
    color.toLowerCase().includes(key)
  ) as ColorKey | undefined;

  const colorScheme = colorLookup[matchingColor || "grey"];

  return (
    <div className="flex flex-col justify-between">
      <div>
        <div
          className={`shadow-xl ${colorScheme.shadow} ${colorScheme.border} h-full p-4 flex ${colorScheme.background} rounded-lg`}
        >
          <div className={`border-l-4 ${colorScheme.line} pl-4 h-full`}>
            <p className={`text-sm md:text-base ${colorScheme.text}`}>
              {quote}
            </p>
          </div>
        </div>

        {note && (
          <div className="flex my-2">
            <p className="ml-2 text-sm text-muted-foreground pt-2">
              <span className="text-sm md:text-base font-bold text-primary">
                Notes:{" "}
              </span>
              {note}
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-end py-2">
        <Badge variant="default">{location}</Badge>
      </div>
    </div>
  );
}
