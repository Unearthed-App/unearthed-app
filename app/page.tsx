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

import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";

import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

import { Button } from "@/components/ui/button";
import { Crown, LogIn } from "lucide-react";

import Link from "next/link";
import { UnearthedInAndOut } from "@/components/UnearthedInAndOut";
import { AnimatedCards } from "@/components/AnimatedCards";
import { HomeHeader } from "@/components/HomeHeader";
import { HomeCarousel } from "@/components/HomeCarousel";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { FeaturePremiumCard } from "@/components/FeaturePremiumCard";
import { getBookTitles, getTotalQuotesCount } from "@/server/actions";
import { OnboardingCard } from "@/components/OnboardingCard";
import { SlidingNumberBasic } from "@/components/SlidingNumberBasic";
import { Metadata } from "next";
import FeatureSection from "@/components/FeatureSection";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "Unearthed - Kindle Auto Sync, AI-Powered Reading Insights",
  description:
    "Free, open-source tool with AI-powered analysis of your Kindle highlights, notes, and reading patterns. Get personalized insights, daily reflections, and seamless integration with Notion, Obsidian, and Capacities.",
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
      "Free, open-source tool with AI-powered analysis of your Kindle highlights, notes, and reading patterns. Get personalized insights, daily reflections, and seamless integration with Notion, Obsidian, and Capacities.",
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
  const totalQuotes = await getTotalQuotesCount();

  return (
    <>
      <SignedIn>
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
                <Link
                  className="w-full md:w-auto"
                  href={isPremium ? "/premium/home" : "/dashboard/home"}
                >
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
      </SignedIn>
      <SignedOut>
        <main className="w-full flex flex-wrap items-center justify-center">
          <div className="absolute top-0 right-0 flex items-center justify-center space-x-2 p-3">
            <div className="flex justify-center">
              <h1
                className={
                  crimsonPro.className +
                  " select-none motion-blur-in-2xl motion-duration-[6000ms] motion-delay-500 font-black text-xl bg-clip-text text-transparent bg-gradient-to-t from-[rgb(238,157,138)] to-red-700"
                }
              >
                unearthed
              </h1>
            </div>
            <div className="flex justify-center">
              <svg
                className="text-red-500 motion-blur-in-xl motion-duration-[6000ms] h-8 w-8"
                fill="currentColor"
                version="1.2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 400 400"
                width="400"
                height="400"
              >
                <title>Unearthed Logo</title>
                <g id="g4">
                  <path
                    id="path2"
                    fillRule="evenodd"
                    className="s0"
                    d="m101.8 41.3c12.3-12.8 32.7-13.2 45.5-0.9 12.9 12.3 13.3 32.7 0.9 45.6-37.4 38.9-61.1 93.1-60.9 139.8 0.1 25.3 7.3 48.3 26.3 62.4 18.3 13.6 36.8 18.3 53.7 15 27.4-5.3 49.6-29.1 61.5-59.5 6.5-16.5 25.2-24.7 41.8-18.1 16.5 6.5 24.7 25.2 18.2 41.7-20.6 52.3-62 89.9-109.2 99.1-32.8 6.3-69-0.2-104.3-26.4-35.3-26.1-52.3-67.2-52.4-114-0.2-61.4 29.6-133.4 78.9-184.7z"
                  />
                </g>
                <g id="g8">
                  <path
                    id="path6"
                    fillRule="evenodd"
                    className="s0"
                    d="m243.3 189.6c-7.6-3.2-11.1-11.8-8-19.3 3.1-7.5 11.8-11.1 19.3-8 22.1 9.2 59.7 28.8 80.7 45.1 6.4 5 7.6 14.2 2.6 20.7-5 6.4-14.2 7.6-20.7 2.6-19.2-14.8-53.7-32.7-73.9-41.1z"
                  />
                </g>
                <g id="g12">
                  <path
                    id="path10"
                    fillRule="evenodd"
                    className="s0"
                    d="m280 107.1c-7.5-3.1-11.1-11.8-7.9-19.3 3.1-7.5 11.8-11.1 19.3-7.9 22.1 9.2 59.7 28.8 80.7 45 6.4 5 7.6 14.3 2.6 20.7-5 6.5-14.3 7.6-20.7 2.7-19.2-14.9-53.8-32.7-74-41.2z"
                  />
                </g>
                <g id="g16">
                  <path
                    id="path14"
                    fillRule="evenodd"
                    className="s0"
                    d="m261.1 148.6c-7.5-3.1-11.1-11.8-7.9-19.3 3.1-7.5 11.8-11.1 19.3-7.9 22.1 9.2 59.7 28.8 80.7 45 6.4 5 7.6 14.3 2.6 20.7-5 6.5-14.3 7.6-20.7 2.7-19.2-14.9-53.8-32.7-74-41.2z"
                  />
                </g>
              </svg>
            </div>
          </div>

          <div className="w-full">
            <HomeHeader />
          </div>

          <div className="w-full">
            <FeatureSection />
          </div>

          <div className="w-full flex justify-center py-12">
            <SlidingNumberBasic totalQuotes={totalQuotes} />
          </div>

          <div className="w-full bg-red-600/10 py-12 backdrop-saturate-200">
            <UnearthedInAndOut />
          </div>

          <div className="my-12 px-4 md:px-16">
            <div className="mt-4 mb-10">
              <FeaturePremiumCard showButtons />
            </div>

            <div className="mt-12">
              <AnimatedCards />
            </div>

            <div className="mt-24 w-full flex justify-center">
              <HomeCarousel />
            </div>

            <div className="w-full flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8  max-w-[630px]">
                <SignUpButton>
                  <Button className="w-full mt-2 flex px-12 py-6 motion-preset-expand motion-duration-1500 motion-delay-[4000ms]">
                    <LogIn className="mr-2" />
                    <span className="text-base md:text-xl uppercase">
                      Join for Free
                    </span>
                  </Button>
                </SignUpButton>
                <Link
                  href="/dashboard/get-premium"
                  className="w-full md:w-auto"
                >
                  <Button
                    variant="brutalprimary"
                    className="w-full mt-2 flex px-12 py-6 motion-preset-expand motion-duration-1500 motion-delay-[4000ms]"
                  >
                    <Crown className="mr-2" />
                    <span className="hover:ml-2 hover:motion-preset-confetti text-base md:text-xl uppercase group">
                      Get Premium{" "}
                      <span className="hidden group-hover:inline-block ml-1">
                        ✨
                      </span>
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <FAQ />
        </main>
      </SignedOut>
    </>
  );
}
