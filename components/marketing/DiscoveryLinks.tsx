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

import Link from "next/link";
import { readingGuides } from "@/lib/reading-guides";

export function DiscoveryLinks({
  isGuidePage = false,
}: {
  isGuidePage?: boolean;
}) {
  return (
    <section
      aria-labelledby="reading-guides-title"
      className="w-full min-w-0 shrink-0 border-y border-foreground/20 bg-[#f8f3e9] px-5 py-12 text-foreground dark:bg-[#101815] sm:py-16"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Reading guides
        </p>
        <h2
          id="reading-guides-title"
          className="my-4 font-serif text-3xl sm:text-4xl"
        >
          Get your highlights into your notes
        </h2>
        <p className="mb-8 max-w-2xl leading-7 text-muted-foreground">
          Find setup instructions for your reading and note taking apps, or
          compare Local, Online and Mobile.
        </p>
        <ol className="grid gap-x-10 sm:grid-cols-2">
          {readingGuides.map((guide, index) => (
            <li key={guide.slug} className="border-t border-foreground/20">
              <Link
                className="group flex h-full min-h-16 items-center gap-3 py-4 text-sm leading-6 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                href={`/guides/${guide.slug}`}
              >
                <span aria-hidden="true" className="self-start font-mono text-xs leading-6 text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">
                  {!isGuidePage && guide.slug === "readwise-alternative"
                    ? "Readwise alternative: compare Unearthed features and pricing"
                    : guide.title}
                </span>
                <span aria-hidden="true" className="text-lg text-primary">↗</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
