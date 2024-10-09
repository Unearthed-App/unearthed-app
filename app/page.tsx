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

export const metadata: Metadata = {
  title: "Unearthed - Your Personal Knowledge Curator",
  description:
    "Unearthed: Free, open-source tool to retrieve, sync, and reflect on your Amazon Kindle highlights, quotes, notes, and books. Search, tag, and connect your insights across platforms.",
  keywords: [
    "Kindle highlights",
    "digital notes",
    "knowledge management",
    "personal library",
    "daily reflections",
    "open source",
    "productivity tool",
  ],
  openGraph: {
    title: "Unearthed - Rediscover Your Digital Wisdom",
    description:
      "Sync Kindle highlights, receive daily reflections, and seamlessly integrate your insights with other apps. Free and open-source.",
    type: "website",
    url: "https://unearthed.app",
    images: [
      {
        url: "https://unearthed.app/daily-reflection.png",
        width: 1200,
        height: 630,
        alt: "Unearthed app interface showing Kindle highlights and daily reflections",
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
          <div className="w-full">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Badge
                    className="hidden md:flex absolute top-2 left-24"
                    variant="brutalinvert"
                  >
                    ALPHA
                  </Badge>
                  <h1
                    className={
                      crimsonPro.className +
                      " font-extrabold text-6xl md:text-9xl bg-clip-text text-transparent bg-gradient-to-t from-[hsl(337,65%,3%)] to-[hsl(337,65%,20%)] dark:from-primary dark:to-[hsl(337,55%,35%)]"
                    }
                  >
                    Unearthed
                  </h1>
                </div>
              </div>
              <h3 className="text bold font-bold text-secondary mb-12">
                Lost wisdom, found again
              </h3>
            </div>
          </div>
          <div className="md:mb-12">
            <Link href="/dashboard/home">
              <Button
                variant="brutalprimary"
                className="flex space-x-2 px-12 py-6"
              >
                Sign In / Up
                <LogIn className="ml-2" />
              </Button>
            </Link>
          </div>

          <div className="my-12 w-full flex flex-wrap items-center justify-center">
            <div className="md:grid grid-cols-3 grid-rows-6 gap-4 max-w-[900px]">
              
              <div className="row-span-3">
                <div className="w-full h-full p-4 border-2 border-black rounded-lg bg-card shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <h3
                    className={
                      crimsonPro.className + " font-extrabold text-3xl"
                    }
                  >
                    "I <span className="text-secondary italic">know</span> that
                    I read something about that, but I have no idea{" "}
                    <span className="text-secondary italic">where</span>."
                  </h3>
                  <p className="text-xs md:text-base mt-2">
                    Unearthed will help you find it with it's{" "}
                    <span className="text-secondary font-semibold">
                      global search
                    </span>{" "} giving you the book, author, page number, and any notes you took on
                    it.
                  </p>
                  <div className="relative mt-2"></div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 col-span-2 row-span-3">
                <div className="w-full h-full p-4 border-2 border-black rounded-lg bg-card shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <h3
                    className={
                      crimsonPro.className + " font-extrabold text-3xl"
                    }
                  >
                    "I need{" "}
                    <span className="text-secondary italic">inspiration</span>"
                  </h3>
                  <p className="text-xs md:text-base mt-2">
                    Unearthed will serve you a{" "}
                    <span className="text-secondary font-semibold">
                      Daily Reflection
                    </span>
                    , via the browser extension, web app, Capacities, and the
                    mobile app (soon).
                    <br /> <br />
                    This is not some random quote from the web, this is
                    something that you have{" "}
                    <span className="text-secondary font-semibold">
                      enjoyed
                    </span>{" "}
                    in the past enough to highlight and maybe even make a note
                    about.
                  </p>
                  <div className="relative mt-2"></div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 col-span-1 row-span-3 row-start-4">
                {" "}
                <div className="w-full h-full p-4 border-2 border-black rounded-lg bg-card shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <h3
                    className={
                      crimsonPro.className + " font-extrabold text-3xl"
                    }
                  >
                    "I love that book, but it was so{" "}
                    <span className="text-secondary italic">overwhelming</span>.
                    I couldn't take it all in!"
                  </h3>
                  <p className="text-xs md:text-base mt-2">
                    Unearthed will serve you{" "}
                    <span className="text-secondary font-semibold">
                      daily reflections
                    </span>{" "}
                    to help you digest every part of what you read.
                  </p>
                  <div className="relative mt-2"></div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 col-span-1 row-span-3 row-start-4">
                <div className="w-full h-full p-4 border-2 border-black rounded-lg bg-card shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <h3
                    className={
                      crimsonPro.className + " font-extrabold text-3xl"
                    }
                  >
                    "I'm <span className="text-secondary italic">sick</span> of
                    manually downloading and backing up my kindle highlights"
                  </h3>
                  <p className="text-xs md:text-base mt-2">
                    Unearthed will{" "}
                    <span className="text-secondary font-semibold">
                      automatically
                    </span>{" "}
                    download and sync your data for you.
                  </p>
                  <div className="relative mt-2"></div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 row-span-3 col-start-3 row-start-4">
                <div className="w-full h-full p-4 border-2 border-black rounded-lg bg-card shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <h3
                    className={
                      crimsonPro.className + " font-extrabold text-3xl"
                    }
                  >
                    "My notes are{" "}
                    <span className="text-secondary italic">all over</span> the
                    place"
                  </h3>
                  <p className="text-xs md:text-base mt-2">
                    Unearthed can act as a{" "}
                    <span className="text-secondary font-semibold">bridge</span>{" "}
                    to get your quotes and notes to whatever note taking app you
                    use.
                  </p>
                  <div className="relative mt-2"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 w-full flex flex-wrap lg:flex-nowrap justify-center">
            <div className="mt-2 p-4 border-2 border-black rounded-lg max-w-96 md:max-h-[279px] bg-card shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <p className="text-xs md:text-base">
                Hey! I made this app for myself and I though others might find
                this usefull too...? I wanted a way to search through my kindle
                quotes/notes easily and bring back those thoughts. The app is
                designed to make retrieving accumulated knowledge easier, in the
                hope that past revelations can be built on rather than
                forgotten.
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
                  <Button className="w-full md:w-auto">App Repo</Button>
                </Link>
                <Link
                  href="https://github.com/Unearthed-App/unearthed-web-extension"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full md:w-auto ml-0 md:ml-4 mt-2 md:mt-0">
                    Extension Repo
                  </Button>
                </Link>
              </div>
              <div className="relative mt-2"></div>
            </div>
            <div className="flex flex-col justify-center ml-0 md:ml-12 mt-24 lg:-mt-12">
              <div>
                <CheckItem content="Free" />
              </div>
              <div>
                <CheckItem content="Open Source" />
              </div>
              <div>
                <CheckItem content="Automatically sync Kindle books, highlights, notes, etc" />
              </div>
              <div>
                <CheckItem content="A reflection served to you daily" />
              </div>
              <div>
                <CheckItem content="Notion integration" />
              </div>
              <div>
                <CheckItem content="Capacities daily note integration" />
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
                <CheckItem content="Lots more to add..." />
              </div>
            </div>
          </div>

          <div className="w-full text-center mt-20">
            <h1
              className={
                crimsonPro.className +
                " font-extrabold text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-t from-[hsl(337,65%,3%)] to-[hsl(337,65%,20%)] dark:from-primary dark:to-[hsl(337,55%,35%)]"
              }
            >
              Sync to these apps
            </h1>
            <Badge className="mt-2" variant="brutal">Adding more all the time</Badge>
          </div>

          <div className="w-full">
            <UnearthedInAndOut />
          </div>

          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="max-w-[900px] mt-24 flex justify-center flex-wrap">
                <div className="w-full flex justify-center">
                  <Link
                    href="https://capacities.io"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="relative w-[200px] bg-white hover:bg-neutral-200 rounded-lg border-2 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] ">
                      <Image
                        src={"/capacities-logo-black-small.png"}
                        width={200}
                        height={32}
                        alt="Capacities Logo"
                        className=""
                      />
                    </div>
                  </Link>
                </div>

                <Image
                  src={"/capacities-daily-mobile-small.webp"}
                  width={400}
                  height={677}
                  alt="Capacities screenshot"
                  className="border-2 border-black rounded-lg -mt-4"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="max-w-[900px] mt-24 flex justify-center flex-wrap">
                <div className="w-full flex justify-center">
                  <div className="mb-2 md:mb-0 relative p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-[hsl(354.6,74.2%,62%)] max-w-[500px]">
                    <h1
                      className={
                        crimsonPro.className +
                        " font-extrabold text-xl md:text-3xl text-center"
                      }
                    >
                      Daily Reflection
                    </h1>
                  </div>
                </div>

                <Image
                  src={"/daily-reflection.png"}
                  width={400}
                  height={677}
                  alt="Daily Reflection"
                  className="border-2 border-black rounded-lg -mt-4"
                />
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <div className="max-w-[900px] mt-24 flex justify-center flex-wrap">
              <div className="mb-2 md:mb-0 relative p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-[hsl(354.6,74.2%,62%)] max-w-[500px]">
                <h1
                  className={
                    crimsonPro.className +
                    " font-extrabold text-xl md:text-3xl text-center"
                  }
                >
                  Search For Anything
                </h1>
              </div>
              <Image
                src={"/search.png"}
                width={900}
                height={677}
                alt="Search For Anything"
                className="border-2 border-black rounded-lg -mt-4"
              />
            </div>
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
