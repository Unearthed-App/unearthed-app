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



import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function App() {
  return (
    <>
      <main className=" w-full flex flex-wrap items-center justify-center px-4 md:px-24 pt-64 pb-24">
        <div className="flex flex-col justify-center items-center space-y-8">
          <h2
            className={
              crimsonPro.className +
              " font-extrabold text-4xl md:text-5xl lg:text-7xl"
            }
          >
            Success! 👍
          </h2>
          <div className="flex flex-wrap md:space-x-4 item-center justicy-center lg:px-64 xl:px-96 text-center">
            <h2 className="w-full text-lg md:text-2xl text-secondary">
              Notion is currently syncing to Unearthed in the background. You
              should have a new Private Page in Notion with the Unearthed
              sources, quotes, and notes
            </h2>

            <p className="w-full text-base">
              The syncing process with happen every 24 hours, but you can force
              a sync in the settings any time. New sources will be added along
              with any new quotes for each existing source.
            </p>
          </div>
          <Link
            className="w-full md:w-auto"
            href="https://notion.so"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className="mt-2 md:-mt-1 w-full md:w-auto"
              variant="brutalprimary"
            >
              Take Me To Notion
            </Button>
          </Link>
        </div>
      </main>
    </>
  );
}
