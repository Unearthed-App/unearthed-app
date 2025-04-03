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
import { SignUpButton } from "@clerk/nextjs";
import { TextEffect } from "./ui/text-effect";
import Link from "next/link";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";

export const HomeHeader = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="w-full pt-24 flex flex-wrap justify-center text-center ">
      <div className="relative w-full flex justify-center">
        <div className="max-w-[910px]">
          <h1>
            <span
              className={`
                text-primary
                py-4 leading-tigh
                motion-blur-in-2xl motion-delay-300 motion-duration-500 
                font-extrabold text-5xl md:text-8xl
                [text-shadow:8px_8px_0_#14524d,1px_1px_0_#14524d,2px_2px_0_#14524d,3px_3px_0_#14524d,4px_4px_0_#14524d,5px_5px_0_#14524d,6px_6px_0_#14524d,7px_7px_0_#14524d]

              `}
            >
              PAST INSIGHTS
            </span>
            <br />
            <span
              className={`
                text-red-500
                py-4 leading-tigh
                motion-blur-in-2xl motion-delay-300 motion-duration-500 
                font-extrabold text-5xl md:text-8xl
                [text-shadow:8px_8px_0_#74342D,1px_1px_0_#74342D,2px_2px_0_#74342D,3px_3px_0_#74342D,4px_4px_0_#74342D,5px_5px_0_#74342D,6px_6px_0_#74342D,7px_7px_0_#74342D]
              `}
            >
              NEW REVELATIONS
            </span>
          </h1>
        </div>
      </div>

      <div className="w-full flex justify-center mt-12 pb-4">
        <div className="max-w-[700px] text-xs md:text-base text-alternate dark:text-foreground font-semibold px-4">
          <TextEffect per="word" as="h3" preset="blur">
            Transform your Kindle highlights into daily revelations. Unearthed
            analyses your reading history to surface forgotten insights, detect
            blind spots, generate personalized reflection questions, and deliver
            daily reflections to your favorite platforms. With automatic Kindle
            sync, instant global search, and seamless integration with popular
            note-taking apps like Notion, Obsidian, Supernotes, and Capacities,
            your past knowledge becomes a constant stream of inspiration.
          </TextEffect>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8  max-w-[630px]">
          <SignUpButton>
            <Button className="w-full mt-2 flex px-12 py-6 motion-preset-expand motion-duration-1500 motion-delay-[4000ms]">
              <LogIn className="mr-2" />
              <span className="text-base md:text-xl uppercase">
                Join for Free
              </span>
            </Button>
          </SignUpButton>
          <Link href="/dashboard/get-premium" className="w-full md:w-auto">
            <Button
              variant="brutalprimary"
              className="w-full mt-2 flex px-12 py-6 motion-preset-expand motion-duration-1500 motion-delay-[4000ms]"
            >
              <Crown className="mr-2" />
              <span className="hover:ml-2 hover:motion-preset-confetti text-base md:text-xl uppercase group">
                Get Premium{" "}
                <span className="hidden group-hover:inline-block ml-1">✨</span>
              </span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="w-full relative bg-gradient-to-t from-popover via-bg-popover/10 to-transparent lg:px-12 mt-36">
        <Image
          className="motion-preset-expand motion-duration-1500 motion-delay-[4000ms] -mt-24 rounded-lg overflow-hidden relative"
          src={
            isDesktop ? "/images/banner.webp" : "/images/banner-portrait.webp"
          }
          alt="app screen"
          width="2700"
          height="1440"
        />
      </div>
    </div>
  );
};
