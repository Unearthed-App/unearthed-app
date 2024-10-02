"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";

import {
  LogOut,
  BookOpenText,
  ImportIcon,
  Frown,
  Menu,
  Home,
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

export function DropdownMenuNav() {
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
              <Link href="/privacy">
                <DropdownMenuItem>
                  <span>Privacy Policy</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <SignOutButton>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </SignOutButton>
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
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/privacy">
                <DropdownMenuItem>
                  <span>Privacy Policy</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedOut>
    </>
  );
}
