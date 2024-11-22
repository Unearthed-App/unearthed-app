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

"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

import {
  LogOut,
  BookOpenText,
  Frown,
  Menu,
  Home,
  User,
  LogIn,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getIsPremium } from "@/lib/utils";
import { ContactFormDialog } from "./ContactForm/ContactFormDialog";

export function DropdownMenuNav() {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      const isPremium = await getIsPremium();
      setIsPremium(isPremium);
    };

    fetchPremiumStatus();
  }, []);

  return (
    <>
      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"}>
              <Menu />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            {isPremium ? (
              <>
                <DropdownMenuGroup>
                  <Link href="/premium/home">
                    <DropdownMenuItem>
                      <Home className="mr-2 h-4 w-4" />
                      <span>Home</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/premium/books">
                    <DropdownMenuItem>
                      <BookOpenText className="mr-2 h-4 w-4" />
                      <span>Books</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/premium/books-ignored">
                    <DropdownMenuItem>
                      <Frown className="mr-2 h-4 w-4" />
                      <span>Ignored</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://chromewebstore.google.com/detail/unearthed-app/aneeklbnnklhdaipicoakebmbedcgmfb?authuser=0&hl=en"
                  >
                    <DropdownMenuItem>
                      <span>Install Chrome Extension</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://addons.mozilla.org/en-US/firefox/addon/unearthed-app/"
                  >
                    <DropdownMenuItem>
                      <span>Install Firefox Extension</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href="/privacy" passHref>
                    <DropdownMenuItem>Privacy Policy</DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href="/dashboard/user-profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <ContactFormDialog isMenuItem />
                  <SignOutButton>
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </SignOutButton>{" "}
                </DropdownMenuGroup>
              </>
            ) : (
              <>
                <DropdownMenuGroup>
                  <Link href="/dashboard/home">
                    <DropdownMenuItem>
                      <Home className="mr-2 h-4 w-4" />
                      <span>Home</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard/books">
                    <DropdownMenuItem>
                      <BookOpenText className="mr-2 h-4 w-4" />
                      <span>Books</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard/books-ignored">
                    <DropdownMenuItem>
                      <Frown className="mr-2 h-4 w-4" />
                      <span>Ignored Books</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://chromewebstore.google.com/detail/unearthed-app/aneeklbnnklhdaipicoakebmbedcgmfb?authuser=0&hl=en"
                  >
                    <DropdownMenuItem>
                      <span>Install Chrome Extension</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://addons.mozilla.org/en-US/firefox/addon/unearthed-app/"
                  >
                    <DropdownMenuItem>
                      <span>Install Firefox Extension</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>{" "}
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href="/privacy" passHref>
                    <DropdownMenuItem>Privacy Policy</DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href="/dashboard/user-profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <ContactFormDialog isMenuItem />
                  <SignOutButton>
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </SignOutButton>
                </DropdownMenuGroup>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>
      <SignedOut>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"}>
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <Link href="/">
                <DropdownMenuItem>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Home</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <SignInButton>
                <DropdownMenuItem>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Sign In</span>
                </DropdownMenuItem>
              </SignInButton>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/privacy" passHref>
                <DropdownMenuItem>Privacy Policy</DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedOut>
    </>
  );
}
