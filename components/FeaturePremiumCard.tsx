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
      <div className="sm:mr-2">
        <div className="p-4 border-2 rounded-lg">
          <h1 className={crimsonPro.className + " font-extrabold text-4xl"}>
            Free
          </h1>
          <Separator className="bg-muted my-2" />
          <div className="flex">
            <h1 className={crimsonPro.className + " font-extrabold text-3xl"}>
              $0
            </h1>
            <div className="pl-4">
              <p className="text-sm">No credit card required</p>
              <p className="text-sm">No commitment</p>
            </div>
          </div>
          <Separator className="bg-muted my-2" />
          <CheckItemSmall content="Automatic Kindle Import" />
          <CheckItemSmall content="No character limit" />
          <CheckItemSmall content="Global Search" />
          <CheckItemSmall content="Select which books to sync" />
          <CheckItemSmall content="Everything synced to Obsidian" />
          <CheckItemSmall content="Daily Reflection in Unearthed" />
          <CheckItemSmall content="Daily Reflection sent to Obsidian" />
          <CheckItemSmall content="Daily Reflection sent to Supernotes" />
          <CheckItemSmall content="Daily Reflection sent to Capacities" />
          <CheckItemSmall
            content="Daily Reflection emailed to you"
            variant="destructive"
          />
          <CheckItemSmall
            content="Everything synced to Notion"
            variant="destructive"
          />
          <CheckItemSmall
            content="Global Search for your notes"
            variant="destructive"
          />
          <CheckItemSmall
            content="Manually add Books/Authors"
            variant="destructive"
          />
          <CheckItemSmall
            content="Manually add Quotes/Notes"
            variant="destructive"
          />
          <CheckItemSmall
            content="Import from CSV files"
            variant="destructive"
          />
          <CheckItemSmall
            content="Import from Kindle Clippings file"
            variant="destructive"
          />
          <CheckItemSmall
            content="Direct link to read on Kindle"
            variant="destructive"
          />
          <CheckItemSmall
            content="AI chat with each book (BYO AI)"
            variant="destructive"
          />
          <CheckItemSmall
            content="Help keep this app alive"
            variant="destructive"
          />
          {showButtons && (
            <SignUpButton>
              <Button className="mt-2 w-full">Alright</Button>
            </SignUpButton>
          )}
        </div>
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-2">
        <div className="p-4 border-2 rounded-lg bg-card">
          <div className="flex space-x-2 items-center text-secondary">
            <Crown className="w-8 h-8 text-primary" />
            <h1 className={crimsonPro.className + " font-extrabold text-4xl"}>
              Premium
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
          <CheckItemSmall content="Automatic Kindle Import" />
          <CheckItemSmall content="No character limit" />
          <CheckItemSmall content="Global Search" />
          <CheckItemSmall content="Select which books to sync" />
          <CheckItemSmall content="Everything synced to Obsidian" />
          <CheckItemSmall content="Daily Reflection in Unearthed" />
          <CheckItemSmall content="Daily Reflection sent to Obsidian" />
          <CheckItemSmall content="Daily Reflection sent to Supernotes" />
          <CheckItemSmall content="Daily Reflection sent to Capacities" />
          <CheckItemSmall content="Daily Reflection emailed to you" />
          <CheckItemSmall content="Everything synced to Notion" />
          <CheckItemSmall content="Global Search for your notes" />
          <CheckItemSmall content="Manually add Books/Authors" />
          <CheckItemSmall content="Manually add Quotes/Notes" />
          <CheckItemSmall content="Import from CSV files" />
          <CheckItemSmall content="Import from Kindle Clippings file" />
          <CheckItemSmall content="Direct link to read on Kindle" />
          <CheckItemSmall content="AI chat with each book (BYO AI)" />
          <CheckItemSmall content="Help keep this app alive" />
          {showButtons && (
            <Link href="/dashboard/get-premium">
              <Button variant="brutalprimary" className="mt-2 w-full">
                <span className="hover:motion-preset-confetti">Sounds Ok</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
