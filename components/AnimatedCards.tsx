/**
 * Copyright (C) 2024 Unearthed App
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

import { motion } from "motion/react";
import { Crimson_Pro } from "next/font/google";
import { Separator } from "./ui/separator";
import { HeadingBlur } from "./HeadingBlur";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

const cardContents = [
  {
    title:
      '"I\'m sick of <span class="text-secondary italic">manually</span> backing up my kindle highlights"',
    description:
      'Unearthed will <span class="text-secondary font-semibold">automatically</span> download and sync your data for you.',
  },

  {
    title:
      '"My notes are <span class="text-secondary italic">all over</span> the place"',
    description:
      'Unearthed can act as a <span class="text-secondary font-semibold">bridge</span> to get your quotes and notes to whatever note taking app you use.',
  },
  {
    title: '"I need <span class="text-secondary italic">inspiration</span>"',
    description:
      'Unearthed will serve you a <span class="text-secondary font-semibold">Daily Reflection</span>, via the browser extension, web app, Capacities, and the mobile app (soon).<br /><br />This is not some random quote from the web, this is something that you have <span class="text-secondary font-semibold">enjoyed</span> in the past enough to highlight and maybe even make a note about.',
  },
  {
    title:
      '"I <span class="text-secondary italic">know</span> that I read something about that, but I have no idea <span class="text-secondary italic">where</span>."',
    description:
      'Unearthed will help you find it with its <span class="text-secondary font-semibold">global search</span> giving you the book, author, page number, and any notes you took on it.',
  },

  {
    title:
      '"I love that book, but it was so <span class="text-secondary italic">overwhelming</span>. I couldn\'t take it all in!"',
    description:
      'Unearthed allows you to revisit that book when it suits you. It will remind you of it slowly via the <span class="text-secondary font-semibold">daily reflection</span> to help you digest every part of what you read.',
  },
  {
    title:
      '"My collection is full of books I <span class="text-secondary italic">no longer care</span> about"',
    description:
      "Unearthed lets you ignore books so that they don't show up in your reflections or searches",
  },
];

// Map of grid positions to content indices
const gridContentMap = {
  "col-span-2 row-span-2 col-start-2 row-start-1": 0,
  "col-span-3 row-span-2 col-start-3 row-start-3": 1,
  "col-span-2 row-span-3 col-start-1 row-start-3": 2,
  "col-span-3 row-span-3 col-start-2 row-start-6": 3,
  "col-span-2 row-span-4 col-start-5 row-start-5": 4,
  "col-span-2 row-span-2 col-start-5 row-start-1": 5,
};

export const AnimatedCards = () => {
  return (
    <div className="w-full flex flex-wrap items-center justify-center p-4 md:px-12 lg:px-0 ">
      <div className="w-full flex justify-center max-w-6xl mb-8">
        <HeadingBlur content="You won't be thinking any of this anymore..." />
        <h2 className={"opacity-50 mb-2 text-base lg:text-xl "}></h2>
      </div>

      <div className="lg:grid grid-cols-6 grid-rows-8 gap-4 w-full max-w-6xl lg:h-[850px]">
        <div className="hidden lg:block z-10 row-span-2 col-start-1 row-start-1">
          <NoiseCard />{" "}
        </div>
        <div className="hidden lg:block z-10 row-span-2 col-start-4 row-start-1">
          <NoiseCard />{" "}
        </div>
        <div className="hidden lg:block z-10 col-span-2 col-start-3 row-start-5">
          <NoiseCard />{" "}
        </div>
        <div className="hidden lg:block z-10 row-span-2 col-start-6 row-start-3">
          <NoiseCard />{" "}
        </div>
        <div className="hidden lg:block z-10 row-span-3 col-start-1 row-start-6">
          <NoiseCard />{" "}
        </div>

        {Object.entries(gridContentMap).map(([gridClass, contentIndex]) => (
          <motion.div
            key={contentIndex}
            className={`${gridClass} z-20`}
            whileHover={{
              scale: 1.03,
              zIndex: 1,
              boxShadow: "0px 0px 0px rgba(0,0,0,1)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="mt-2 lg:mt-0 w-full h-full p-4 border-2 border-black rounded-lg bg-card transition-all duration-200 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <h3
                className={`${crimsonPro.className} font-extrabold text-2xl`}
                dangerouslySetInnerHTML={{
                  __html: cardContents[contentIndex].title,
                }}
              />
              <Separator className="my-2 bg-muted" />
              <p
                className="text-sm"
                dangerouslySetInnerHTML={{
                  __html: cardContents[contentIndex].description,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const NoiseCard = () => {
  return (
    <div className="h-full w-full opacity-90 dark:opacity-10 backdrop-blur-sm bg-primary/20 dark:bg-white/90 rounded-lg border-2 dark:border-black">
      <svg className="w-full h-full rounded-lg">
        <filter id="noiseFilter2">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.5"
            stitchTiles="stitch"
            numOctaves="1"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#noiseFilter2)"
          fill="rgba(255, 0, 0, 1)"
        />
      </svg>
    </div>
  );
};

export default AnimatedCards;
