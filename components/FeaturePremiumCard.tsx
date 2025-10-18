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

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SignUpButton } from "@clerk/nextjs";
import { Crown } from "lucide-react";
import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });
import Link from "next/link";
import { CheckItemSmall } from "./CheckItemSmall";

export function FeaturePremiumCard({
  showButtons = false,
}: {
  showButtons?: boolean;
}) {
  return (
    <div className="flex flex-wrap sm:flex-nowrap justify-center">
      <div className="mt-4 sm:mt-0 sm:ml-2">
        <div className="p-4 border-2 rounded-lg md:max-w-[600px] bg-card">
          <div className="flex space-x-2 items-center text-secondary">
            <Crown className="w-8 h-8 text-primary" />
            <h1 className={crimsonPro.className + " font-extrabold text-4xl"}>
              Unearthed Online
            </h1>
          </div>
          <Separator className="bg-muted my-2" />
          <div className="flex">
            <h1 className={crimsonPro.className + " font-extrabold text-3xl"}>
              $5/mo
            </h1>
            <div className="pl-4">
              <p className="text-sm">Secure Stripe payments</p>
              <p className="text-sm">Cancel anytime</p>
            </div>
          </div>
          <Separator className="bg-muted my-2" />
          <CheckItemSmall content="Also download 'Unearthed Local' (keep it forever)" />
          <CheckItemSmall content="Automatic Kindle Import" />
          <CheckItemSmall content="No character limit" />
          <CheckItemSmall content="Global Search" />
          <CheckItemSmall content="Select which books to sync" />
          <CheckItemSmall content="Everything synced to Obsidian (including Tags)" />
          <CheckItemSmall content="Daily Reflection in Unearthed" />
          <CheckItemSmall content="Daily Reflection sent to Obsidian" />
          <CheckItemSmall content="Daily Reflection sent to Supernotes" />
          <CheckItemSmall content="Daily Reflection sent to Capacities" />
          <CheckItemSmall content="Daily Reflection emailed to you" />
          <CheckItemSmall content="KOReader highlights and notes imported" />
          <CheckItemSmall content="Interactive map to visualize connections between books, quotes, notes, and tags" />
          <CheckItemSmall content="Book recommendations based on similar books" />
          <CheckItemSmall content="Book recommendations based on opposing viewpoints" />
          <CheckItemSmall content="Personalised blind spot detection" />
          <CheckItemSmall content="Notion Sync" />
          <CheckItemSmall content="Global Search for your notes and tags" />
          <CheckItemSmall content="Manually add Books/Authors" />
          <CheckItemSmall content="Manually add Quotes/Notes" />
          <CheckItemSmall content="Import from CSV files" />
          <CheckItemSmall content="Import from Kindle Clippings file" />
          <CheckItemSmall content="Direct link to read on Kindle" />
          <CheckItemSmall content="AI chat with each book" />
          <CheckItemSmall content="Auto extract key ideas" />
          <CheckItemSmall content="Auto generate reflection questions, and have your answers rated" />
          <CheckItemSmall content="Tag your books and quotes, automatically and manually with inline text detection" />
          <CheckItemSmall content="Apply tags globally to all relevant quotes/notes" />
          <CheckItemSmall content="Generate book summary, themes, takeaways, reader's perspective" />
          <CheckItemSmall content="Help keep this app alive ☺️" />
          {showButtons && (
            <Link href="/dashboard/get-premium">
              <Button variant="brutalprimary" className="mt-2 w-full">
                <span className="hover:motion-preset-confetti">
                  Get Unearthed Online
                </span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
