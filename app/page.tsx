import type { Metadata } from "next";

import { SignedIn, SignedOut } from "@clerk/nextjs";

import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

import { Button } from "@/components/ui/button";
import { LogIn, CheckCircle } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { UnearthedInAndOut } from "@/components/UnearthedInAndOut";
import { AnimatedCards } from "@/components/AnimatedCards";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { AboutMe } from "@/components/AboutMe";
import { HomeHeader } from "@/components/HomeHeader";
import { HomeCarousel } from "@/components/HomeCarousel";


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

export default function App() {
  return (
    <>
      <SignedIn>
        <main className=" w-full flex flex-wrap items-center justify-center px-4 md:px-24 pt-64 pb-24">
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
              <Link className="w-full md:w-auto" href="/dashboard/home">
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
        <main className="w-full flex flex-wrap items-center justify-center px-4 md:px-24 pt-24 pb-24">
          <HomeHeader />

          <AnimatedCards />

          <div className="mt-2 md:mt-12 w-full flex flex-wrap lg:flex-nowrap justify-center">
            <AboutMe />
            <AnimatedGroup
              className="flex flex-col justify-center ml-0 md:ml-12 mt-10 md:mt-24 lg:-mt-12 px-12 md:px-0"
              preset="blur-slide"
            >
              <div>
                <CheckItem content="Free and Open Source" />
              </div>
              <div>
                <CheckItem content="Automatically sync from Kindle" />
              </div>
              <div>
                <CheckItem content="A reflection served to you daily" />
              </div>
              <div>
                <CheckItem content="Notion integration" />
              </div>
              <div>
                <CheckItem content="Obsidian integration" />
              </div>
              <div>
                <CheckItem content="Capacities integration" />
              </div>
              <div>
                <CheckItem content="Easily search and browse it all" />
              </div>
              <div>
                <CheckItem content="Choose to ignore books" />
              </div>
              <div>
                <CheckItem content="Encrypted sensitive data" />
              </div>
              <div>
                <CheckItem content="Lots more coming..." />
              </div>
            </AnimatedGroup>
          </div>

          <div className="w-full text-center mt-10 md:mt-20 rounded">
            <h1
              className={
                crimsonPro.className +
                " font-extrabold text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-t from-[hsl(337,65%,3%)] to-[hsl(337,65%,20%)] dark:from-primary dark:to-[hsl(337,55%,35%)]"
              }
            >
              Sync to these apps
            </h1>
            <Badge className="mt-2" variant="brutal">
              Adding more all the time
            </Badge>
          </div>

          <div className="w-full">
            <UnearthedInAndOut />
          </div>

          <div className="w-full flex justify-center">
            <HomeCarousel />
          </div>

          <div className="mt-24">
            <Link href="/dashboard/home">
              <Button variant="brutalprimary" className="flex space-x-2">
                Sign In / Up
                <LogIn className="ml-2" />
              </Button>
            </Link>
          </div>
        </main>
      </SignedOut>
    </>
  );
}

const CheckItem = ({ content }: { content: string }) => {
  return (
    <div className="flex w-full space-x-4 items-center my-1 md:my-2 text-sm lg:text-xl">
      <div className="rounded-full bg-card ">
        <CheckCircle className="h-6 md:h-8 w-6 md:w-8" />
      </div>
      <div className="">{content}</div>
    </div>
  );
};
