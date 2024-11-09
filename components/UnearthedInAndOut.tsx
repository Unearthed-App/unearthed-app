"use client";

import { DisclosureCard } from "./DisclosureCard";
import { HeadingBlur } from "./HeadingBlur";

export function UnearthedInAndOut() {
  return (
    <div className="w-full flex flex-wrap">
      <div className="w-full">
        <div className=" flex flex-col items-center justify-center px-5 py-2">
          <div className="-mt-20">
            <HeadingBlur content="Sync your Kindle to these apps" />
          </div>
          <div className="w-full flex flex-wrap md:flex-nowrap space-x-2 p-4 justify-center">
            <DisclosureCard
              title="Notion"
              content="Send all of your books to Notion with ease. The sync will happen every 24 hours but you can also force a sync whenever you like."
              image={{
                src: "/notion-logo-no-background.png",
                alt: "Notion Logo",
                className: "",
                width: 100,
                height: 100,
              }}
            />
            <DisclosureCard
              title="Obsidian"
              content="All your books, quotes, notes, AND Daily Reflection synced to your local file system!"
              image={{
                src: "/obsidian.svg",
                alt: "Obsidian Logo",
                className: "rounded-full bg-white p-3",
                width: 100,
                height: 100,
              }}
            />
            <DisclosureCard
              title="Capacities"
              content="Wake up to a new Daily Reflection added automatically to your Daily Note in Capacities."
              image={{
                src: "/capacities-logo.png",
                alt: "Notion Logo",
                className: "rounded-full",
                width: 100,
                height: 100,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
