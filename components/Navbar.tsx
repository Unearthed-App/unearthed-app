"use client";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { DropdownMenuNav } from "@/components/DropdownMenuNav";
import { ModeToggle } from "@/components/ModeToggle";
import { ProfileDialog } from "./ProfileDialog";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname } from "next/navigation";
import { SearchDialog } from "./SearchDialog";

import { Crimson_Pro } from "next/font/google";

const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

export function Navbar() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pathname = usePathname();
  const activeStyles =
    "text-foreground text-2xl lg:text-5xl border-b-4 border-primary -mb-[11px] z-5 pb-[16px]";

  // Function to check if the current path is active
  const isActive = (href: string) => pathname === href;

  if (isDesktop) {
    return (
      <div className="z-50 fixed w-full">
        <div className="px-12 flex border-b-2 border-muted h-24 justify-between bg-background">
          <div className="flex flex-wrap">
            <div className="flex space-x-10 items-end text-base text-muted pb-2">
              <SignedIn>
                <Link href="/dashboard/home">
                  <h3
                    className={`${
                      crimsonPro.className
                    } transition-all duration-100 animate-all font-semibold hover:text-secondary ${
                      isActive("/dashboard/home") ? activeStyles : ""
                    }`}
                  >
                    Home
                  </h3>
                </Link>
                <Link href="/dashboard/books">
                  <h3
                    className={`${
                      crimsonPro.className
                    } transition-all duration-100 font-semibold hover:text-secondary ${
                      isActive("/dashboard/books") ? activeStyles : ""
                    }`}
                  >
                    Books
                  </h3>
                </Link>
                <Link href="/dashboard/books-ignored">
                  <h3
                    className={`${
                      crimsonPro.className
                    } transition-all duration-100 font-semibold hover:text-secondary ${
                      isActive("/dashboard/books-ignored") ? activeStyles : ""
                    }`}
                  >
                    Ignored Books
                  </h3>
                </Link>
              </SignedIn>
            </div>
          </div>
          <div className="flex space-x-4 items-center justify-end">
            <SearchDialog />
            <ModeToggle />
            <ProfileDialog />
            <SignOutButton>
              <Button size="icon">
                <LogOut />
              </Button>
            </SignOutButton>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="z-50 fixed w-full ">
      <div className=" flex justify-center">
        <div className="mt-2 bg-card rounded-lg border-2 border-black inset-0 flex space-x-4 p-4 justify-center">
          <SignedIn>
            <SearchDialog />

            <DropdownMenuNav />
            <ModeToggle />
            <ProfileDialog />
            <SignOutButton>
              <Button size="icon">
                <LogOut />
              </Button>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
