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
import { Crown, LogIn, PlayCircle } from "lucide-react";
import { TextEffect } from "./ui/text-effect";
import Link from "next/link";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";
import Einkle from "./Einkle";

export const HomeHeader = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <header className="w-full pt-24 flex flex-wrap justify-center text-center">
      <div className="scale-50 md:scale-100 motion-blur-in-2xl motion-delay-300 motion-duration-500 mt-8 md:-mt-24 flex items-center justify-center h-[500px] w-[500px] md:h-[1200px] md:w-[1200px]">
        <Einkle />
      </div>

      <nav
        className="w-full flex justify-center -mt-0 md:-mt-20"
        role="navigation"
        aria-label="Product options"
      >
        <div className="grid grid-cols-1 mt-8 max-w-[630px]">
          <Link
            href="/premium/books"
            className="w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 rounded-md"
            aria-label="Learn about Unearthed Online - Full-featured cloud experience"
          >
            <Button
              variant="brutalprimary"
              className="w-full mt-2 flex px-8 sm:px-12 py-6 motion-preset-expand motion-duration-1500 motion-delay-[4000ms] min-h-[56px] touch-manipulation"
              tabIndex={-1}
            >
              <Crown className="mr-2" aria-hidden="true" />
              <span className="text-sm sm:text-base md:text-xl uppercase">
                Get Unearthed Online
              </span>
            </Button>
          </Link>
        </div>
      </nav>

      <section
        className="w-full relative bg-gradient-to-t from-popover via-bg-popover/10 to-transparent lg:px-12 mt-36"
        aria-label="Application preview"
      >
        <div
          className="absolute top-0 left-0 w-full h-[730px] motion-preset-expand motion-duration-1500 motion-delay-[4000ms] -mt-24 rounded-xl overflow-hidden dark:bg-[#ff5c5c47]/40 blur-lg dark:p-8"
          aria-hidden="true"
        ></div>
        <Image
          className="motion-preset-expand motion-duration-1500 motion-delay-[4000ms] -mt-24 rounded-lg overflow-hidden relative"
          src={
            isDesktop ? "/images/banner.webp" : "/images/banner-portrait.webp"
          }
          alt="Screenshot of Unearthed application interface showing quote management and reading insights features"
          width="2700"
          height="1440"
          priority
        />
      </section>
    </header>
  );
};
