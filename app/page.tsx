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

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getBookTitles } from "@/server/actions";
import { OnboardingCard } from "@/components/OnboardingCard";
import FAQ from "@/components/FAQ";
import { LoggedInHome } from "@/components/LoggedInHome";
import { HomeHero } from "@/components/HomeHero";
import { HomeFeatures } from "@/components/HomeFeatures";
import { HomeDualOptions } from "@/components/HomeDualOptions";
import { useQuery } from "@tanstack/react-query";
import { AnimatedLoader } from "@/components/AnimatedLoader";
import { useState, useEffect } from "react";

export default function App() {
  const { user, isLoaded } = useUser();
  const [isPremium, setIsPremium] = useState(false);

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["bookTitles"],
    queryFn: getBookTitles,
    enabled: !!user,
  });

  const { data: premiumStatus } = useQuery({
    queryKey: ["premiumStatus"],
    queryFn: async () => {
      const response = await fetch('/api/auth/premium-status');
      return response.json();
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (premiumStatus) {
      setIsPremium(premiumStatus.isPremium || false);
    }
  }, [premiumStatus]);

  if (!isLoaded || (user && isLoading)) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <AnimatedLoader />
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        {!isPremium ? (
          <LoggedInHome />
        ) : (
          <main className="w-full flex flex-wrap items-center justify-center px-4 md:px-24 pt-64 pb-24">
            <div className="flex flex-col justify-center items-center space-y-8">
              <h2
                className={`${crimsonPro.className} font-extrabold text-4xl md:text-5xl lg:text-7xl`}
              >
                Welcome! 👋
              </h2>

              {books.length === 0 ? (
                <div className="w-full flex flex-wrap justify-center items-center">
                  <OnboardingCard />
                </div>
              ) : (
                <div className="flex flex-wrap md:space-x-4 items-center justify-center text-center">
                  <h2 className="w-full md:w-auto text-lg md:text-2xl">
                    Check out your{" "}
                  </h2>
                  <Link className="w-full md:w-auto" href="/premium/home">
                    <Button
                      className="mt-2 md:-mt-1 w-full md:w-auto"
                      variant="brutalprimary"
                    >
                      Daily Reflection
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </main>
        )}
      </SignedIn>
      <SignedOut>
        <main className="w-full">
          <HomeHero />
          <HomeFeatures />
          <HomeDualOptions />
          <FAQ />
        </main>
      </SignedOut>
    </>
  );
}
