"use client";

import Image, { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import rssLight from "./rss_light.webp";
import rssDark from "./rss_dark.webp";
import localLight from "./local_light.webp";
import localDark from "./local_dark.webp";
import searchLight from "./search_light.webp";
import searchDark from "./search_dark.webp";
import articleLight from "./article_light.webp";
import articleDark from "./article_dark.webp";
import databaseLight from "./database_light.webp";
import databaseDark from "./database_dark.webp";

const SCREENSHOTS: {
  label: string;
  description: string;
  hoverRotate: string;
  delay: number;
  priority: boolean;
  light: StaticImageData;
  dark: StaticImageData;
}[] = [
  {
    label: "Local Dashboard",
    description: "Your reading hub",
    hoverRotate: "-1deg",
    delay: 0,
    priority: true,
    light: localLight,
    dark: localDark,
  },
  {
    label: "RSS Feeds",
    description: "Stay updated",
    hoverRotate: "1deg",
    delay: 100,
    priority: false,
    light: rssLight,
    dark: rssDark,
  },
  {
    label: "Article Reader",
    description: "Distraction-free highlighting",
    hoverRotate: "-1deg",
    delay: 200,
    priority: false,
    light: articleLight,
    dark: articleDark,
  },
  {
    label: "Smart Search",
    description: "Find anything",
    hoverRotate: "1deg",
    delay: 300,
    priority: false,
    light: searchLight,
    dark: searchDark,
  },
  {
    label: "Database View",
    description: "All your content",
    hoverRotate: "-1deg",
    delay: 400,
    priority: false,
    light: databaseLight,
    dark: databaseDark,
  },
];

export const LocalScreenshots = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setEntered(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <div ref={gridRef} className="w-full max-w-4xl mx-auto mb-20 px-4">
      <style>{`
        @media (min-width: 768px) {
          .screenshot-card:hover {
            rotate: var(--hover-rotate);
          }
        }
      `}</style>
      <div className="flex flex-col gap-6">
        {SCREENSHOTS.map((screenshot) => (
          <div
            key={screenshot.label}
            className={`screenshot-card flex flex-col bg-card border-3 border-black dark:border-white rounded-lg overflow-hidden transition-all duration-500 ease-out ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{
              transitionDelay: entered ? "0ms" : `${screenshot.delay}ms`,
              ["--hover-rotate" as string]: screenshot.hoverRotate,
            }}
          >
            {/* Header bar */}
            <div className="shrink-0 border-b-3 border-black dark:border-white bg-foreground text-background px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider truncate">
                {screenshot.label}
              </span>
              <span className="text-[10px] opacity-70 truncate ml-3">
                {screenshot.description}
              </span>
            </div>

            {/* Screenshot area */}
            <div className="relative overflow-auto max-h-[600px]">
              <Image
                src={screenshot.light}
                alt={`${screenshot.label} - Unearthed Local`}
                className="w-full h-auto dark:hidden"
                quality={85}
                priority={screenshot.priority}
                sizes="(max-width: 768px) 100vw, 896px"
              />
              <Image
                src={screenshot.dark}
                alt={`${screenshot.label} - Unearthed Local`}
                className="w-full h-auto hidden dark:block"
                quality={85}
                priority={screenshot.priority}
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-center mt-10 text-sm text-muted-foreground italic">
        100% local &mdash; your data never leaves your machine
      </p>
    </div>
  );
};
