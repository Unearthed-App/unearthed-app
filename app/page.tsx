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

import { SignedIn, SignedOut } from "@clerk/nextjs";

import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

import { Button } from "@/components/ui/button";
import { Crown, LogIn } from "lucide-react";

import Link from "next/link";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getBookTitles } from "@/server/actions";
import { OnboardingCard } from "@/components/OnboardingCard";
import { Metadata } from "next";
import FAQ from "@/components/FAQ";
import { LoggedInHome } from "@/components/LoggedInHome";
import { DualOptionSection } from "@/components/DualOptionSection";

export const metadata: Metadata = {
  title: "Unearthed - Kindle Auto Sync, AI-Powered Reading Insights",
  description:
    "Open-source tool with AI-powered analysis of your Kindle highlights, notes, and reading patterns. Get personalised insights, daily reflections, and seamless integration with Notion, Obsidian, and Capacities.",
  keywords: [
    "kindle highlights",
    "AI reading analysis",
    "reading insights",
    "book analytics",
    "digital notes",
    "knowledge management",
    "personal library",
    "daily reflections",
    "open source",
    "productivity tool",
    "notion integration",
    "kindle to notion",
    "kindle to obsidian",
    "kindle to capacities",
    "capacities integration",
    "kindle sync",
    "reading patterns",
    "book recommendations",
    "readwise alternative",
    "readwise",
  ],
  openGraph: {
    title: "Unearthed - Kindle Auto Sync, AI-Powered Reading Insights",
    description:
      "Open-source tool with AI-powered analysis of your Kindle highlights, notes, and reading patterns. Get personalised insights, daily reflections, and seamless integration with Notion, Obsidian, and Capacities.",
    type: "website",
    url: "https://unearthed.app",
    images: [
      {
        url: "https://unearthed.app/images/banner.webp",
        width: 1200,
        height: 630,
        alt: "Unearthed app interface showing AI-powered reading insights and Kindle integration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unearthed - AI-Powered Reading Insights",
    description:
      "Transform your reading with AI analysis and seamless integration",
    images: ["https://unearthed.app/images/banner.webp"],
  },
};

export default async function App() {
  const { userId }: { userId: string | null } = await auth();

  let isPremium = false;
  try {
    if (userId) {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      isPremium = user.privateMetadata.isPremium as boolean;
    }
  } catch (error) {
    isPremium = false;
  }

  const books = userId ? await getBookTitles() : [];

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
        <main className="w-full flex flex-wrap items-center justify-center">
          <header className="w-full pt-24 flex flex-wrap justify-center text-center">
            <div className="w-full">
              <h1 className="px-2">
                <span
                  className={`
                      text-primary
                      py-4 leading-tight
                      motion-blur-in-2xl motion-delay-300 motion-duration-500 
                      font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-8xl
                      [text-shadow:8px_8px_0_#14524d,1px_1px_0_#14524d,2px_2px_0_#14524d,3px_3px_0_#14524d,4px_4px_0_#14524d,5px_5px_0_#14524d,6px_6px_0_#14524d,7px_7px_0_#14524d]
                    `}
                >
                  PAST INSIGHTS
                </span>
                <br />
                <span
                  className={`
                      text-red-500
                      py-4 leading-tight
                      motion-blur-in-2xl motion-delay-300 motion-duration-500 
                      font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-8xl
                      [text-shadow:8px_8px_0_#74342D,1px_1px_0_#74342D,2px_2px_0_#74342D,3px_3px_0_#74342D,4px_4px_0_#74342D,5px_5px_0_#74342D,6px_6px_0_#74342D,7px_7px_0_#74342D]
                    `}
                >
                  NEW REVELATIONS
                </span>
              </h1>
            </div>
          </header>
          
          <div className="w-full">
            <DualOptionSection />
          </div>

          <FAQ />
        </main>
      </SignedOut>
    </>
  );
}
