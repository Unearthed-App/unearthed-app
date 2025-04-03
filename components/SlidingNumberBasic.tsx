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

import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { AnimatedNumber } from "./motion-primitives/animated-number";
import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });
import Image from "next/image";

interface SlidingNumberBasicProps {
  totalQuotes: number;
}

export function SlidingNumberBasic({ totalQuotes }: SlidingNumberBasicProps) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref);

  if (isInView && value === 0) {
    setValue(totalQuotes);
  }

  return (
    <div
      className="text-center bg-card py-8 px-4 md:px-24 rounded-lg"
      ref={ref}
    >
      <div className="inline-flex flex-col items-center gap-2">
        <div
          className={`${crimsonPro.className} pb-2 font-semibold text-xl sm:text-4xl inline-flex items-center text-secondary`}
        >
          Serving &nbsp;
          <AnimatedNumber
            className={`${crimsonPro.className} font-extrabold text-2xl md:text-4xl inline-flex items-center text-foreground`}
            springOptions={{
              bounce: 0,
              duration: 3000,
            }}
            value={value}
          />{" "}
          &nbsp; quotes{" "}
          <span className="hidden md:inline">&nbsp;right now</span>
        </div>
        <p className="text-sm text-muted-foreground max-w-md">
          This represents the total number of quotes/highlights that Unearthed
          has helped users collect and organize from their books. Each quote is
          a piece of wisdom waiting to be rediscovered.
        </p>
        <div className="py-8 flex items-center">
          <Image
            src="/images/falling-books.webp"
            width={446}
            height={160}
            alt="Falling Books"
            className="dark:invert -rotate-12"
          />
        </div>
      </div>
    </div>
  );
}
