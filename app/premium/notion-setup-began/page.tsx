
import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function App() {
  return (
    <>
      <main className=" w-full flex flex-wrap items-center justify-center px-4 md:px-24 pt-64 pb-24">
        <div className="flex flex-col justify-center items-center space-y-8">
          <h2
            className={
              crimsonPro.className +
              " font-extrabold text-4xl md:text-5xl lg:text-7xl"
            }
          >
            Success! 👍
          </h2>
          <div className="flex flex-wrap md:space-x-4 item-center justicy-center px-4 text-center max-w-[900px]">
            <h2 className="w-full text-lg md:text-2xl text-secondary font-bold">
              Please wait patiently while the sync completes
              <br />
              The first time can take a while.
            </h2>
            <h2 className="w-full text-base text-alternate font-bold mt-4">
              Notion is currently syncing to Unearthed in the background. You
              should have a new Private Page in Notion with the Unearthed
              sources, quotes, and notes
            </h2>

            <p className="w-full text-sm mt-4">
              The syncing process will happen every 24 hours, but you can force
              a sync in the settings any time. New sources will be added along
              with any new quotes for each existing source.
            </p>
          </div>
          <Link
            className="w-full md:w-auto"
            href="https://notion.so"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className="mt-2 md:-mt-1 w-full md:w-auto"
              variant="brutalprimary"
            >
              Take Me To Notion
            </Button>
          </Link>
        </div>
      </main>
    </>
  );
}
