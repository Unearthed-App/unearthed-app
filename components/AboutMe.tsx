"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const AboutMe = () => {
  return (
    <div className="mt-2 p-4 border-2 border-black rounded-lg max-w-96 md:max-h-[279px] bg-card shadow-[4px_4px_0px_rgba(0,0,0,1)]">
      <p className="text-xs md:text-base">
        <span className="text-secondary font-bold">Hey!</span> I made this app
        for myself because I wanted a way to search through my kindle
        quotes/notes easily in order to bring back those thoughts. The app is
        designed to make retrieving accumulated knowledge easier, in the hope
        that past revelations can be built on rather than forgotten.
        <br />
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
  );
};
