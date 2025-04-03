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
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { DropdownMenuNav } from "@/components/DropdownMenuNav";
import { ModeToggle } from "@/components/ModeToggle";
import { LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname } from "next/navigation";
import { SearchDialog } from "@/components/premium/SearchDialog";

import { Crimson_Pro } from "next/font/google";
import { QuoteFormDialog } from "./QuoteForm/QuoteFormDialog";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });
import { ConnectionsGraph } from "@/components/premium/ConnectionsGraph";

export function Navbar() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pathname = usePathname();
  const activeStyles =
    "text-foreground text-2xl lg:text-5xl border-b-4 border-primary -mb-[11px] z-5 pb-[16px]";

  const isActive = (href: string) => pathname === href;

  if (isDesktop) {
    return (
      <div className="z-50 fixed w-full">
        <div className="px-12 flex h-24 justify-between bg-white/50 dark:bg-black/40 backdrop-blur-md shadow-2xl shadow-card dark:shadow-black/20 dark:shadow-xl">
          <div className="flex flex-wrap">
            <div className="flex space-x-10 items-end text-base text-muted pb-2">
              <SignedIn>
                <Link href="/premium/home">
                  <h3
                    className={`${
                      crimsonPro.className
                    } transition-all duration-100 animate-all font-semibold hover:text-secondary ${
                      isActive("/premium/home") ? activeStyles : ""
                    }`}
                  >
                    Home
                  </h3>
                </Link>
                <Link href="/premium/books">
                  <h3
                    className={`${
                      crimsonPro.className
                    } transition-all duration-100 font-semibold hover:text-secondary ${
                      isActive("/premium/books") ? activeStyles : ""
                    }`}
                  >
                    Books
                  </h3>
                </Link>
                <Link href="/premium/books-ignored">
                  <h3
                    className={`${
                      crimsonPro.className
                    } transition-all duration-100 font-semibold hover:text-secondary ${
                      isActive("/premium/books-ignored") ? activeStyles : ""
                    }`}
                  >
                    Ignored
                  </h3>
                </Link>{" "}
                <Link href="/premium/tags">
                  <h3
                    className={`${
                      crimsonPro.className
                    } transition-all duration-100 font-semibold hover:text-secondary ${
                      isActive("/premium/tags") ? activeStyles : ""
                    }`}
                  >
                    Tags
                  </h3>
                </Link>
              </SignedIn>
            </div>
          </div>
          <div className="flex space-x-4 items-center justify-end">
            <SearchDialog />
            <QuoteFormDialog onQuoteAdded={() => {}} />
            <DropdownMenuNav />
            <ModeToggle />
            <Link href="/premium/settings">
              <Button size="icon">
                <Settings />
              </Button>
            </Link>
            <ConnectionsGraph />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="z-50 fixed w-full ">
      <div className=" flex justify-center">
        <div className="mt-2 bg-card rounded-lg border-2 border-black inset-0 flex space-x-2 p-4 justify-center">
          <SignedIn>
            <SearchDialog />
            <QuoteFormDialog onQuoteAdded={() => {}} />
            <DropdownMenuNav />
            <ModeToggle />
            <Link href="/premium/settings">
              <Button size="icon">
                <Settings />
              </Button>
            </Link>
            <ConnectionsGraph />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
