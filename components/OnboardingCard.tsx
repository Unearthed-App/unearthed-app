import { Button } from "./ui/button";
import Link from "next/link";

export function OnboardingCard() {
  return (
    <>
      <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center">
        <div className="p-8 rounded-lg border-2 max-w-64 text-center">
          It looks like you have no books yet. Please install/open the Browser
          Extension and press the &apos;Get Kindle Books&apos; button in the
          extension
        </div>
      </div>
      <div className="w-full md:w-1/2 flex justify-center md:justify-start items-center">
        <div className="mt-4 md:mt-0 md:ml-4">
          <div>
            <div>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://chromewebstore.google.com/detail/aneeklbnnklhdaipicoakebmbedcgmfb/preview?hl=en&authuser=0"
              >
                <Button className="w-full md:w-auto md:min-w-96 p-4 md:p-8 border-2 rounded-lg text-lg md:text-2xl">
                  Install Chrome Extension
                </Button>
              </Link>
            </div>
            <div className="mt-4">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://addons.mozilla.org/en-US/firefox/addon/unearthed-app/"
              >
                <Button className="w-full md:w-auto md:min-w-96 p-4 md:p-8 border-2 rounded-lg text-lg md:text-2xl">
                  Install Firefox Extension
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
