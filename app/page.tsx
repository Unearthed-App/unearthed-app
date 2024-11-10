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

import type { Metadata } from "next";

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
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Unearthed - Lost wisdom, found again",
  description:
    "Free, open-source tool to retrieve, sync, and reflect on your Amazon Kindle highlights, quotes, notes, and books. Search, tag, and connect your insights across platforms. Notion, Obsidian, Capacities.",
  keywords: [
    "kindle highlights",
    "digital notes",
    "knowledge management",
    "personal library",
    "daily reflections",
    "open source",
    "productivity tool",
    "notion",
    "capacities kindle",
    "notion kindle",
    "obsidian kindle",
    "kindle integration",
    "kindle to notion",
    "kindle to obsidian",
    "kindle to capacities",
    "capacities integration",
  ],
  openGraph: {
    title: "Unearthed - Lost wisdom, found again",
    description:
      "Sync Kindle highlights, receive daily reflections, and seamlessly integrate your insights with other apps. Free and open-source. Notion, Obsidian, Capacities.",
    type: "website",
    url: "https://unearthed.app",
    images: [
      {
        url: "https://unearthed.app/daily-reflection.png",
        width: 1200,
        height: 630,
        alt: "Unearthed app interface showing Kindle highlights and daily reflections. Notion, Obsidian, Capacities.",
      },
    ],
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

  return (
    <>
      <SignedIn>
        <main className="w-full flex flex-wrap items-center justify-center px-4 md:px-24 pt-64 pb-24">
          <div className="flex flex-col justify-center items-center space-y-8">
            <h2
              className={
                crimsonPro.className +
                " font-extrabold text-4xl md:text-5xl lg:text-7xl"
              }
            >
              Welcome! 👋
            </h2>
            <div className="flex flex-wrap md:space-x-4 item-center justicy-center text-center">
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
          </div>
        </main>
      </SignedIn>
      <SignedOut>
        <main className="w-full flex flex-wrap items-center justify-center pb-24">
          <div className="w-full">
            <HomeHeader />
          </div>

          <div className="w-full bg-red-600/10 py-12 backdrop-saturate-200">
            <UnearthedInAndOut />
          </div>

          <div className="my-12 px-4 md:px-24">
            <div className="mt-4 mb-10">
              <FeaturePremiumCard showButtons />
            </div>

            <div className="mt-12">
              <AnimatedCards />
            </div>

            <div className="my-24 w-full flex flex-wrap lg:flex-nowrap justify-center">
              <div
                className={`w-full md:w-1/2
                  mt-2 p-4 border-2 border-black rounded-lg max-w-96 md:max-h-[480px] bg-card
                `}
              >
                <h2
                  className={
                    crimsonPro.className +
                    " font-extrabold text-5xl bg-clip-text text-transparent bg-gradient-to-t from-[hsl(337,65%,3%)] to-[hsl(337,65%,20%)] dark:from-[rgb(238,157,138)] dark:to-red-700"
                  }
                >
                  Open Source
                </h2>
                <Separator className="my-4 bg-alternate " />
                <p className="text-xs md:text-base pb-4">
                  Everything you see here is open source, including the
                  <Link
                    href="https://github.com/Unearthed-App/unearthed-obsidian"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-secondary font-bold">
                      {" "}
                      Obsidian Plugin{" "}
                    </span>
                  </Link>
                  and{" "}
                  <Link
                    href="https://github.com/Unearthed-App/unearthed-web-extension"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-secondary font-bold">
                      {" "}
                      Browser Extension
                    </span>
                  </Link>
                  . So if you want Premium but money is tight, feel free to
                  download it and run it yourself. Our hope is that this will
                  create a better app over time with your contributions and
                  suggestions.
                  <br />
                  <span className="font-semibold">
                    The app is designed to make retrieving accumulated knowledge
                    easier, in the hope that past revelations can be built upon
                    rather than forgotten. So it makes sense that it is a
                    community driven effort.
                  </span>
                  <br />
                  <br />
                  Contribute to the code here:
                </p>
                <div className="relative mt-2">
                  <Link
                    href="https://github.com/Unearthed-App/unearthed-app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full md:w-auto">Web App</Button>
                  </Link>
                  <Link
                    href="https://github.com/Unearthed-App/unearthed-web-extension"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full md:w-auto ml-0 md:ml-4 mt-2 md:mt-0">
                      Extension
                    </Button>
                  </Link>{" "}
                  <Link
                    href="https://github.com/Unearthed-App/unearthed-obsidian"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full md:w-auto ml-0 md:ml-4 mt-2 md:mt-0">
                      Obsidian
                    </Button>
                  </Link>
                </div>
                <div className="relative mt-2"></div>
              </div>
              <div
                className={`w-full md:w-1/2 ml-0 md:ml-4
                  mt-2 p-4 border-2 border-black rounded-lg max-w-96 md:max-h-[480px] bg-card
                `}
              >
                <h2
                  className={
                    crimsonPro.className +
                    " font-extrabold text-5xl bg-clip-text text-transparent bg-gradient-to-t from-[hsl(337,65%,3%)] to-[hsl(337,65%,20%)] dark:from-[rgb(238,157,138)] dark:to-red-700"
                  }
                >
                  Transparency
                </h2>
                <Separator className="my-4 bg-alternate" />

                <p className="text-xs md:text-base pb-4 text-alternate-fore">
                  When linking accounts we do not store (or even see) any of
                  your login credentials.
                  <br />
                  <br />
                  If you delete your account with us, we will actually delete
                  your data so that there is no trace of you. <br /> <br />
                  <span className="font-semibold">
                    If in doubt, you can read through the entire codebase on{" "}
                    <Link
                      href="https://github.com/Unearthed-App/unearthed-app"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-secondary font-bold">Github</span>
                    </Link>
                    .
                  </span>
                </p>
              </div>
            </div>

            <div className="w-full flex justify-center">
              <HomeCarousel />
            </div>

            <div className="w-full flex flex-wrap sm:flex-nowrap justify-center mt-24">
              <SignUpButton>
                <Button className="mt-2 flex px-12 py-6 motion-preset-expand motion-duration-1500 motion-delay-[4000ms]">
                  <span className="">Join for Free</span>
                  <LogIn className="ml-2" />
                </Button>
              </SignUpButton>
              <Link href="/dashboard/get-premium">
                <Button
                  variant="brutalprimary"
                  className="mt-2 sm:ml-2 flex px-12 py-6 motion-preset-expand motion-duration-1500 motion-delay-[4000ms]"
                >
                  <span className="hover:motion-preset-confetti">
                    Get Premium
                  </span>
                  <Crown className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </SignedOut>
    </>
  );
}
