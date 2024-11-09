"use client";

import { Button } from "@/components/ui/button";
import { Crown, LogIn } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { Crimson_Pro } from "next/font/google";
import { TextEffect } from "./ui/text-effect";
import Link from "next/link";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

export const HomeHeader = () => {
  return (
    <div className="w-full py-24 px-4 md:px-12 flex flex-wrap justify-center text-center ">
      <div className="mb-24 w-full flex flex-wrap justify-center opacity-100 text-center ">
        <div className="w-full flex justify-center">
          <svg
            className="text-red-500 motion-blur-in-xl motion-duration-[6000ms] h-20 w-20"
            fill="currentColor"
            version="1.2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400 400"
            width="400"
            height="400"
          >
            <title>Unearthed Logo</title>
            <g id="g4">
              <path
                id="path2"
                fill-rule="evenodd"
                className="s0"
                d="m101.8 41.3c12.3-12.8 32.7-13.2 45.5-0.9 12.9 12.3 13.3 32.7 0.9 45.6-37.4 38.9-61.1 93.1-60.9 139.8 0.1 25.3 7.3 48.3 26.3 62.4 18.3 13.6 36.8 18.3 53.7 15 27.4-5.3 49.6-29.1 61.5-59.5 6.5-16.5 25.2-24.7 41.8-18.1 16.5 6.5 24.7 25.2 18.2 41.7-20.6 52.3-62 89.9-109.2 99.1-32.8 6.3-69-0.2-104.3-26.4-35.3-26.1-52.3-67.2-52.4-114-0.2-61.4 29.6-133.4 78.9-184.7z"
              />
            </g>
            <g id="g8">
              <path
                id="path6"
                fill-rule="evenodd"
                className="s0"
                d="m243.3 189.6c-7.6-3.2-11.1-11.8-8-19.3 3.1-7.5 11.8-11.1 19.3-8 22.1 9.2 59.7 28.8 80.7 45.1 6.4 5 7.6 14.2 2.6 20.7-5 6.4-14.2 7.6-20.7 2.6-19.2-14.8-53.7-32.7-73.9-41.1z"
              />
            </g>
            <g id="g12">
              <path
                id="path10"
                fill-rule="evenodd"
                className="s0"
                d="m280 107.1c-7.5-3.1-11.1-11.8-7.9-19.3 3.1-7.5 11.8-11.1 19.3-7.9 22.1 9.2 59.7 28.8 80.7 45 6.4 5 7.6 14.3 2.6 20.7-5 6.5-14.3 7.6-20.7 2.7-19.2-14.9-53.8-32.7-74-41.2z"
              />
            </g>
            <g id="g16">
              <path
                id="path14"
                fill-rule="evenodd"
                className="s0"
                d="m261.1 148.6c-7.5-3.1-11.1-11.8-7.9-19.3 3.1-7.5 11.8-11.1 19.3-7.9 22.1 9.2 59.7 28.8 80.7 45 6.4 5 7.6 14.3 2.6 20.7-5 6.5-14.3 7.6-20.7 2.7-19.2-14.9-53.8-32.7-74-41.2z"
              />
            </g>
          </svg>
        </div>
        <div className="w-full flex justify-center">
          <h1
            className={
              crimsonPro.className +
              " motion-blur-in-2xl motion-duration-[6000ms] motion-delay-500 font-black text-xl bg-clip-text text-transparent bg-gradient-to-t from-[rgb(238,157,138)] to-red-700"
            }
          >
            unearthed
          </h1>
        </div>
      </div>

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

      <div className="w-full flex justify-center my-12 pb-4">
        <div className="max-w-[420px] text-xs md:text-base text-alternate dark:text-foreground font-semibold">
          <TextEffect per="word" as="h3" preset="blur">
            Transform your Kindle highlights and manual notes into a constant
            stream of inspiration. Receive daily reflections built using your
            past quotes and notes. Globally search for anything with ease.
            Automatic Kindle retrieval or import via file upload. Seamless
            syncing to popular note-taking apps
          </TextEffect>
        </div>
      </div>

      <div className="w-full flex flex-wrap sm:flex-nowrap justify-center">
        <SignUpButton>
          <Button className="mt-2 flex px-12 py-6 motion-preset-expand motion-duration-1500 motion-delay-[4000ms]">
            <span className="">Join for Free</span>
            <LogIn className="ml-2" />
          </Button>
        </SignUpButton>
        <Link href="/dashboard/get-premium">
          <Button
            variant="brutalprimary"
            className="mt-2 sm:ml-2 flex px-12 py-6 motion-preset-expand motion-duration-1500 motion-delay-[4000ms]"
          >
            <span className="hover:motion-preset-confetti">Get Premium</span>
            <Crown className="ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
