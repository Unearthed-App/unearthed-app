"use client";
import { SignedOut, SignInButton } from "@clerk/nextjs";

import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogIn, CheckCircle } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

export default function App() {
  const router = useRouter();

  const { user } = useUser();

  if (user) {
    router.push("/dashboard/home");
  }

  return (
    <>
      <SignedOut>
        <main className=" w-full flex flex-wrap items-center justify-center px-4 md:px-24 pt-64">
          <div className=" flex flex-wrap md:flex-nowrap justify-center space-x-8 w-full ">
            <div className="">
              <h1
                className={
                  crimsonPro.className +
                  " font-extrabold text-4xl md:text-5xl lg:text-9xl"
                }
              >
                Unearthed...
              </h1>
            </div>
            <div className="h-32 md:h-64 -mt-32 md:-mt-32 lg:-mt-14">
              <div className="ml-4 md:ml-20 -mt-12 mb-4">
                <Link href="/dashboard/home">
                  <Button variant="brutalprimary" className="flex space-x-2">
                    Sign In / Up
                    <LogIn className="ml-2" />
                  </Button>
                </Link>
              </div>
              <svg
                width="300"
                viewBox="0 0 124 87"
                fill="currentColor"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="text-red-400 w-[200px] hidden sm:block"
              >
                <path d="M92.7183 82.5137C85.6342 85.5731 78.7803 87 74 87C67.4023 87 56.2604 84.542 48.4229 80.3305C34.7696 84.3071 18.3683 87 0.5 87V86C17.8595 86 33.823 83.4439 47.1987 79.6422C43.8492 77.6692 41.1784 75.3104 40.0027 72.6021C39.3488 71.0958 39.1605 69.487 39.5721 67.8026C39.982 66.1255 40.9782 64.4071 42.637 62.6561C44.9406 60.2246 48.6912 57.645 53.0443 55.3373C57.4049 53.0257 62.4044 50.9689 67.231 49.5965C72.0484 48.2268 76.7359 47.5266 80.4567 47.9656C84.1835 48.4053 87.068 50.0156 87.9824 53.3684C88.5264 55.363 87.8135 57.5954 86.1782 59.8728C84.5368 62.1587 81.9139 64.5677 78.4657 66.9646C71.7814 71.6108 61.9126 76.2684 49.8029 79.9214C57.426 83.764 67.8112 86 74 86C78.6139 86 85.332 84.6144 92.3218 81.5957C99.3067 78.5791 106.528 73.9467 112.169 67.4837C117.805 61.026 121.869 52.737 122.549 42.3813C123.23 32.0205 120.527 19.5513 112.56 4.73683L113.44 4.26317C121.473 19.1987 124.243 31.8545 123.547 42.4468C122.851 53.0442 118.687 61.5365 112.922 68.1413C107.162 74.7408 99.8073 79.4522 92.7183 82.5137ZM48.5383 79.2548C61.0242 75.5811 71.1415 70.8377 77.895 66.1434C81.2917 63.7824 83.8153 61.449 85.3659 59.2896C86.9225 57.1217 87.447 55.206 87.0176 53.6316C86.2557 50.8378 83.8645 49.3746 80.3395 48.9587C76.8084 48.5421 72.268 49.204 67.5045 50.5584C62.7502 51.9102 57.8158 53.9397 53.5127 56.2208C49.2022 58.5059 45.5594 61.0254 43.363 63.3439C41.7882 65.0061 40.9014 66.5757 40.5436 68.04C40.1875 69.4971 40.3466 70.8831 40.92 72.2039C42.0607 74.8316 44.8517 77.2204 48.5383 79.2548Z" />
                <path d="M110.736 0.558517L116.972 5.4447L111.526 8.44159L110.736 0.558517Z" />
              </svg>
            </div>
          </div>
          <div className="mt-12 w-full flex flex-wrap lg:flex-nowrap justify-center">
            <div className="mt-2 p-4 border-2 border-black rounded-lg max-w-96 md:max-h-[233px] bg-card shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <p className="text-xs md:text-base">
                Hey! I made this app for myself and I thought you might like it
                too? I wanted a way to search through my kindle quotes/notes
                easily and bring back those thoughts. The app is designed to
                make retrieving accumulated knowledge easier, in the hope that
                past revelations can be built on rather than forgotten.
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
                <CheckItem content="Lots more to add" />
              </div>
            </div>
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
          <div className="my-24">
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
