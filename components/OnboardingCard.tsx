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


import { Button } from "./ui/button";
import Link from "next/link";

export function OnboardingCard() {
  return (
    <>
      <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center">
        <div className="p-8 rounded-lg border-2 max-w-64 text-center">
          It looks like you have no books yet. Please install/open the Browser
          Extension and press the &apos;Get Kindle Books&apos; button in the
          extension
        </div>
      </div>
      <div className="w-full md:w-1/2 flex justify-center md:justify-start items-center">
        <div className="mt-4 md:mt-0 md:ml-4">
          <div>
            <div>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://chromewebstore.google.com/detail/unearthed-app/aneeklbnnklhdaipicoakebmbedcgmfb?authuser=0&hl=en"
              >
                <Button className="w-full md:w-auto md:min-w-96 p-4 md:p-8 border-2 rounded-lg text-lg md:text-2xl">
                  Install Chrome Extension
                </Button>
              </Link>
            </div>
            <div className="mt-4">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://addons.mozilla.org/en-US/firefox/addon/unearthed-app/"
              >
                <Button className="w-full md:w-auto md:min-w-96 p-4 md:p-8 border-2 rounded-lg text-lg md:text-2xl">
                  Install Firefox Extension
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
