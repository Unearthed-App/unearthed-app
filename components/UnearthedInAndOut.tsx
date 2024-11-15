/*
 * Copyright (C) 2024 Unearthed App
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

"use client";

import { DisclosureCard } from "./DisclosureCard";
import { HeadingBlur } from "./HeadingBlur";

export function UnearthedInAndOut() {
  return (
    <div className="w-full flex flex-wrap">
      <div className="w-full">
        <div className=" flex flex-col items-center justify-center px-5 py-2">
          <div className="-mt-20">
            <HeadingBlur content="Sync your Kindle to these apps" />
          </div>
          <div className="w-full flex justify-center px-4 md:px-12 xl:px-64">
            <div className="w-full grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              <div className="w-full  flex justify-center">
                <DisclosureCard
                  title="Notion"
                  content="Send all of your books to Notion with ease. The sync will happen every 24 hours but you can also force a sync whenever you like."
                  image={{
                    src: "/notion-logo-no-background.png",
                    alt: "Notion Logo",
                    className: "",
                    width: 100,
                    height: 100,
                  }}
                />
              </div>
              <div className="w-full flex justify-center">
                <DisclosureCard
                  title="Obsidian"
                  content="All your books, quotes, notes, AND Daily Reflection synced to your local file system! It even works with the Obsidian mobile app."
                  image={{
                    src: "/obsidian.svg",
                    alt: "Obsidian Logo",
                    className: "rounded-full bg-white p-3",
                    width: 100,
                    height: 100,
                  }}
                />
              </div>
              <div className="w-full flex justify-center">
                <DisclosureCard
                  title="Supernotes"
                  content="Wake up to a new Daily Reflection added automatically to your Daily Card in Supernotes."
                  image={{
                    src: "/supernotes.png",
                    alt: "Supernotes Logo",
                    className: "rounded-md",
                    width: 100,
                    height: 100,
                  }}
                />{" "}
              </div>
              <div className="w-full flex justify-center">
                <DisclosureCard
                  title="Capacities"
                  content="Wake up to a new Daily Reflection added automatically to your Daily Note in Capacities."
                  image={{
                    src: "/capacities-logo.png",
                    alt: "Capacities Logo",
                    className: "rounded-full",
                    width: 100,
                    height: 100,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
