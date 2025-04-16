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
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Crimson_Pro } from "next/font/google";
import { useMediaQuery } from "@/hooks/use-media-query";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

const Einkle = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div
      className={cn(
        "relative flex justify-center items-center",
        isDesktop ? "group" : ""
      )}
    >
      <div
        className={cn(
          "z-10 absolute transition-all duration-1000 bg-gradient-to-r from-[#25b1a5] via-[#ff9af5] to-[#ef4444] rounded-[70px] blur-lg",
          isDesktop
            ? "opacity-0 -inset-px group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-1000"
            : "opacity-100 -inset-1"
        )}
      ></div>
      <div
        className={cn(
          "z-20 transition-all duration-700",
          isDesktop ? "hover:-translate-y-3" : "-translate-y-3",
          "shadow-inset-gradient rounded-[70px] p-12",
          "h-[900px] w-[600px]",
          "flex flex-col",
          "radial-gradient-custom from-gray-600 to-neutral-900"
        )}
      >
        <div
          className={cn(
            "z-10 absolute transition-all duration-1000 bg-gradient-to-r from-white/5 via-white/20 to-white/5 rounded-[20px] blur-lg",
            isDesktop
              ? "opacity-0 -inset-px group-hover:opacity-100 group-hover:-inset-1"
              : "opacity-100 -inset-1"
          )}
        ></div>

        <ScrollArea
          className={cn(
            "z-20 transition-all duration-700 flex-1 w-full rounded-[20px]",
            "shadow-inset-lg ring-[1px]",
            isDesktop
              ? "bg-gradient-to-br from-neutral-600 to-neutral-800 group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-neutral-100 ring-neutral-200/10 group-hover:ring-neutral-100/60"
              : "bg-gradient-to-br from-white to-neutral-100 ring-neutral-100/60"
          )}
        >
          <div
            className={`${crimsonPro.className} p-4 text-black text-2xl leading-tight pb-12`}
          >
            <h1 className="text-6xl font-bold">UNEARTHED</h1>
            <h1 className="text-sm mb-4">Scroll...</h1>
            <p className=" mb-4">
              Transform your Kindle highlights into daily revelations. Unearthed
              analyses your reading history to surface forgotten insights,
              detect blind spots, generate personalised reflection questions,
              and deliver daily reflections to your favorite platforms.
            </p>
            <p className=" mb-4">
              With automatic Kindle sync, instant global search, and seamless
              integration with popular note-taking apps like Notion, Obsidian,
              Supernotes, and Capacities, your past knowledge becomes a constant
              stream of inspiration.
            </p>
            <p className="mb-4 font-black italic uppercase text-4xl">
              NO AMAZON CREDENTIALS
              <br />
              REQUIRED!
            </p>
            <h2 className="text-lg font-semibold mb-2">STEPS</h2>
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className="w-10 h-10 border-2 border-black rounded-md flex items-center justify-center">
                1
              </div>
              <div className="w-10 h-10 border-2 border-black rounded-md flex items-center justify-center">
                2
              </div>{" "}
              <div className="w-10 h-10 border-2 border-black rounded-md flex items-center justify-center">
                3
              </div>{" "}
              <div className="w-10 h-10 border-2 border-black rounded-md flex items-center justify-center">
                4
              </div>
            </div>
            <ul className="space-y-2 px-8">
              <li className="flex items-center gap-2">
                <span className="font-bold text-3xl">1.</span>{" "}
                <span className="font-bold">Sign up</span> - it&apos;s free
              </li>
              <li className="flex items-center gap-2">
                <span className="font-bold text-3xl">2.</span>{" "}
                <span className="font-bold">Get browser extension</span>- for
                auto-sync
              </li>
              <li className="flex items-center gap-2">
                <span className="font-bold text-3xl">3.</span>{" "}
                <span className="font-bold">Enjoy daily insights</span> - dive
                deep
              </li>
              <li className="flex items-center gap-2">
                <span className="font-bold text-3xl">4.</span>{" "}
                <span className="font-bold">Connect note apps</span> - optional
              </li>
            </ul>
            <p className="mt-12 text-sm">
              Well I guess it&apos;s all optional...
            </p>
          </div>
        </ScrollArea>
        <div className="text-center text-neutral-400 text-xs h-24 flex items-center justify-center">
          <h3 className="text-4xl font-semibold mt-4 text-neutral-600">
            e-inkle
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Einkle;
