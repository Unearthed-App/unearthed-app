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

import { ObsidianInstructionsDialog } from "./ObsidianInstructionsDialog";
import { Button } from "./ui/button";
import Link from "next/link";

import { VideoDialog } from "@/components/VideoDialog";

export function OnboardingCard() {
  return (
    <>
      <div className="w-full flex justify-center items-center">
        <div className="max-w-[900px]">
          <div className="text-center p-4 rounded-lg backdrop-blur-sm bg-white/30 shadow-xl shadow-red-300/10 dark:shadow-lg dark:shadow-primary/10">
            <h3 className="font-bold text-alternate">
              It looks like you have no books yet.
            </h3>

            <p className="text-sm text-alternate">
              Please install/open the Browser Extension and press the &apos;Get
              Kindle Books&apos; button in the extension
            </p>
            <div className="mt-2">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://chromewebstore.google.com/detail/unearthed-app/aneeklbnnklhdaipicoakebmbedcgmfb?authuser=0&hl=en"
              >
                <Button className=" w-72">Install Chrome Extension</Button>
              </Link>
            </div>
            <div className="mt-4">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://addons.mozilla.org/en-US/firefox/addon/unearthed-app/"
              >
                <Button className=" w-72">Install Firefox Extension</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 w-full flex justify-center items-center">
        <div className="max-w-[900px]">
          <div className="text-center p-4 rounded-lg backdrop-blur-sm bg-white/30 shadow-xl shadow-red-300/10 dark:shadow-lg dark:shadow-primary/10">
            <h3 className="font-bold text-secondary">
              After you import some books
            </h3>
            <h3 className="font-bold text-alternate">Sync to other apps</h3>
            <p className="text-sm text-alternate">
              Click on the settings icon in the navigation bar to setup
              integrations.
            </p>
            <div className="my-2">
              <ObsidianInstructionsDialog />
            </div>{" "}
            <div className="my-2">
              <VideoDialog
                videoUrl="https://www.youtube.com/embed/uilUlt4wRVs?si=5AFVPu8_clj4AeTl"
                videoTitle="Obsidian Instructions"
                videoDescription="Instructions for syncing Kindle to Obsidian"
                videoButtonText="Watch Obsidian Video"
              />{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
