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
import { Crown, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname } from "next/navigation";
import { SearchDialog } from "./SearchDialog";

import { useEffect, useState } from "react";
import { getIsPremium } from "@/lib/utils";
import { QuoteFormDialog } from "./premium/QuoteForm/QuoteFormDialog";

import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

export function Navbar() {
  const [isPremium, setIsPremium] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pathname = usePathname();
  const activeStyles =
    "text-foreground text-2xl lg:text-5xl border-b-4 border-primary -mb-[11px] z-5 pb-[16px]";

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      const isPremium = await getIsPremium();
      setIsPremium(isPremium);
    };

    fetchPremiumStatus();
  }, []);

  if (isDesktop) {
    return (
      <div className="z-50 fixed w-full">
        <div className="px-12 flex h-24 justify-between bg-white/50 dark:bg-black/40 backdrop-blur-md shadow-2xl shadow-card dark:shadow-black/20 dark:shadow-xl">
          <div className="flex flex-wrap">
            <div className="flex space-x-10 items-end text-base text-muted pb-2">
              <SignedIn>
                {isPremium ? (
                  <>
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
                    </Link>
                  </>
                ) : (
                  <>
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
                          isActive("/dashboard/books-ignored")
                            ? activeStyles
                            : ""
                        }`}
                      >
                        Ignored Books
                      </h3>
                    </Link>
                  </>
                )}
              </SignedIn>
            </div>
          </div>
          <div className="flex space-x-4 items-center justify-end">
            {!isPremium && pathname !== "/dashboard/get-premium" && (
              <Link href="/dashboard/get-premium">
                <Button variant="brutalprimary">
                  <Crown className="mr-0 md:mr-2" />
                  <span className="">Get Premium</span>
                </Button>
              </Link>
            )}
            <SearchDialog />
            {isPremium && <QuoteFormDialog onQuoteAdded={() => {}} />}
            <DropdownMenuNav />
            <ModeToggle />
            <ProfileDialog />
            <SignOutButton>
              <Button size="icon">
                <LogOut />
              </Button>
            </SignOutButton>
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
            {!isPremium && (
              <Link href="/dashboard/get-premium">
                <Button size="icon" className="" variant="brutalprimary">
                  <Crown />
                </Button>
              </Link>
            )}

            <SearchDialog />
            {isPremium && <QuoteFormDialog onQuoteAdded={() => {}} />}
            <DropdownMenuNav />
            <ModeToggle />
            <ProfileDialog />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
