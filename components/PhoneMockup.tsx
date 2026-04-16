"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RotateCcw, Sun, Moon, ArrowRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Crimson_Pro } from "next/font/google";

const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

export type PhoneScreenshots = {
  portraitLight: string;
  portraitDark: string;
  landscapeLight: string;
  landscapeDark: string;
};

export type PhoneScreen = {
  label: string;
  screenshots: PhoneScreenshots;
};

const SinglePhone = ({
  screenshots,
  isLandscape,
  isDark,
  isRotating,
}: {
  screenshots: PhoneScreenshots;
  isLandscape: boolean;
  isDark: boolean;
  isRotating: boolean;
}) => {
  const buttonBaseClass = `absolute bg-gradient-to-b from-neutral-800 to-neutral-950 border-neutral-700/50 transition-opacity ${
    isRotating ? 'opacity-0 duration-150' : 'opacity-100 duration-500 delay-100'
  }`;

  return (
    <div className={`relative flex items-center justify-center w-full transition-all duration-700 ${!isLandscape ? 'px-8 sm:px-12 md:px-0' : ''} ${isLandscape ? 'max-w-[920px]' : 'max-w-[520px]'} mx-auto overflow-visible`}>
      <div
        className={`relative bg-gradient-to-br from-neutral-800 via-neutral-900 to-black shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] ring-1 ring-neutral-700/50 dark:ring-neutral-600/50 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center p-2 sm:p-3 md:p-[14px] w-full ${
          isLandscape
            ? 'aspect-[40/19] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem]'
            : 'aspect-[19/40] rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem]'
        }`}
      >
        <div
          className={`${buttonBaseClass} ${
            isLandscape
              ? 'h-1 sm:h-1.5 w-[8%] top-[-4px] sm:top-[-6px] left-[19%] rounded-t-full border-t border-x'
              : 'w-1 sm:w-1.5 h-[8%] right-[-4px] sm:right-[-6px] top-[19%] rounded-r-full border-r border-y'
          }`}
        />
        
        <div
          className={`${buttonBaseClass} ${
            isLandscape
              ? 'h-1 sm:h-1.5 w-[12%] bottom-[-4px] sm:bottom-[-6px] left-[19%] rounded-b-full border-b border-x'
              : 'w-1 sm:w-1.5 h-[12%] left-[-4px] sm:left-[-6px] top-[19%] rounded-l-full border-l border-y'
          }`}
        />
        
        <div
          className={`${buttonBaseClass} ${
            isLandscape
              ? 'h-1 sm:h-1.5 w-[12%] bottom-[-4px] sm:bottom-[-6px] left-[33%] rounded-b-full border-b border-x'
              : 'w-1 sm:w-1.5 h-[12%] left-[-4px] sm:left-[-6px] top-[33%] rounded-l-full border-l border-y'
          }`}
        />

        <div
          className={`w-full h-full relative overflow-hidden bg-neutral-950 border-[2px] border-neutral-900/80 transition-all duration-700 ${
            isLandscape
              ? 'rounded-[1.1rem] sm:rounded-[1.35rem] md:rounded-[1.6rem]'
              : 'rounded-[1.55rem] sm:rounded-[1.85rem] md:rounded-[2.15rem]'
          }`}
        >
          <Image
            src={screenshots.portraitLight}
            alt="Portrait Light"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-opacity duration-500 ease-in-out ${!isLandscape && !isDark ? 'opacity-100' : 'opacity-0'}`}
          />
          <Image
            src={screenshots.portraitDark}
            alt="Portrait Dark"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-opacity duration-500 ease-in-out ${!isLandscape && isDark ? 'opacity-100' : 'opacity-0'}`}
          />
          <Image
            src={screenshots.landscapeLight}
            alt="Landscape Light"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-opacity duration-500 ease-in-out ${isLandscape && !isDark ? 'opacity-100' : 'opacity-0'}`}
          />
          <Image
            src={screenshots.landscapeDark}
            alt="Landscape Dark"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-opacity duration-500 ease-in-out ${isLandscape && isDark ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      </div>
    </div>
  );
};

export const PhoneMockup = ({
  screens,
  initialLandscape = false,
  rotateButtonClassName,
  themeButtonClassName,
  tabButtonClassName,
  activeTabFillClassName,
  inactiveTabFillClassName,
}: {
  screens: PhoneScreen[];
  initialLandscape?: boolean;
  rotateButtonClassName?: string;
  themeButtonClassName?: string;
  tabButtonClassName?: string;
  activeTabFillClassName?: string;
  inactiveTabFillClassName?: string;
}) => {
  const [isLandscape, setIsLandscape] = useState(initialLandscape);
  const [isRotating, setIsRotating] = useState(false);
  const [activeScreen, setActiveScreen] = useState(0);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRotate = () => {
    if (isRotating) return;
    setIsRotating(true);
    
    setTimeout(() => {
      setIsLandscape(!isLandscape);
      
      setTimeout(() => {
        setIsRotating(false);
      }, 700);
    }, 150);
  };

  const isDark = mounted ? resolvedTheme === 'dark' : false;
  const currentScreen = screens[activeScreen] ?? screens[0];

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-5xl mx-auto p-0 md:p-8 pb-12">
      <div className="w-full flex flex-col items-center gap-6">
        <div className="w-full max-w-3xl rounded-[1.75rem] border-2 border-neutral-900/10 dark:border-neutral-100/10 bg-white/80 dark:bg-black/60 backdrop-blur-md p-4 shadow-[0_12px_32px_rgba(0,0,0,0.08)] relative z-10">
          <div className="flex flex-wrap items-center justify-center gap-4 pb-4 border-b-2 border-neutral-900/10 dark:border-neutral-100/10">
            <Button
              type="button"
              onClick={handleRotate}
              disabled={isRotating}
              variant="brutal"
              className={`h-auto px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-semibold tracking-tight ${rotateButtonClassName ?? ""}`}
              title="Rotate phone"
            >
              <span className="flex items-center gap-2">
                <RotateCcw
                  size={18}
                  className={`transition-transform duration-500 ease-in-out ${isLandscape ? "-rotate-90" : "rotate-0"}`}
                />
                Rotate Phone
              </span>
            </Button>

            <Button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              variant="brutalprimary"
              className={`h-auto px-5 py-2.5 md:px-6 md:py-3 rounded-2xl text-sm md:text-base font-semibold tracking-tight ${themeButtonClassName ?? ""}`}
            >
              <span className="flex items-center gap-2">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {screens.map((screen, index) => {
              const isActive = index === activeScreen;
              return (
                <button
                  key={screen.label}
                  type="button"
                  onClick={() => setActiveScreen(index)}
                  className={`relative px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm md:text-base font-semibold tracking-tight transition-all duration-200 border-2 border-black dark:border-neutral-600 shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.15)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_rgba(255,255,255,0.15)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] dark:active:shadow-[1px_1px_0px_rgba(255,255,255,0.15)] active:translate-x-[3px] active:translate-y-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black ${tabButtonClassName ?? ""} ${
                    isActive
                      ? 'text-white dark:text-neutral-900'
                      : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                  aria-pressed={isActive}
                >
                  <span
                    className={`absolute inset-0 rounded-full transition-all duration-300 ${
                      isActive
                        ? activeTabFillClassName ??
                          'bg-gradient-to-br from-primary/95 via-primary to-primary/80'
                        : inactiveTabFillClassName ??
                          'bg-gradient-to-br from-white/95 via-white/80 to-white/60 dark:from-white/10 dark:via-white/5 dark:to-white/5'
                    }`}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        isActive ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]' : 'bg-neutral-400/70 dark:bg-neutral-500/70'
                      }`}
                    />
                    {screen.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {currentScreen && (
          <div className={`w-full transition-all duration-700 ${isLandscape ? 'max-w-3xl' : 'max-w-3xl'} mt-10 flex justify-center overflow-visible`}>
            <SinglePhone
              screenshots={currentScreen.screenshots}
              isLandscape={isLandscape}
              isDark={isDark}
              isRotating={isRotating}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export function PhoneMockupSection({
  teaser = true,
  id,
  rotateButtonClassName,
  themeButtonClassName,
  tabButtonClassName,
  activeTabFillClassName,
  inactiveTabFillClassName,
}: {
  teaser?: boolean;
  id?: string;
  rotateButtonClassName?: string;
  themeButtonClassName?: string;
  tabButtonClassName?: string;
  activeTabFillClassName?: string;
  inactiveTabFillClassName?: string;
}) {
  const screens: PhoneScreen[] = [
    {
      label: "Home",
      screenshots: {
        portraitLight: "/mobile/mobile-home-light.webp",
        portraitDark: "/mobile/mobile-home-dark.webp",
        landscapeLight: "/mobile/mobile-home-light-landscape.webp",
        landscapeDark: "/mobile/mobile-home-dark-landscape.webp",
      },
    },
    {
      label: "Feed",
      screenshots: {
        portraitLight: "/mobile/mobile-feed-light.webp",
        portraitDark: "/mobile/mobile-feed-dark.webp",
        landscapeLight: "/mobile/mobile-feed-light-landscape.webp",
        landscapeDark: "/mobile/mobile-feed-dark-landscape.webp",
      },
    },
    {
      label: "Capture",
      screenshots: {
        portraitLight: "/mobile/mobile-capture-light.webp",
        portraitDark: "/mobile/mobile-capture-dark.webp",
        landscapeLight: "/mobile/mobile-capture-light-landscape.webp",
        landscapeDark: "/mobile/mobile-capture-dark-landscape.webp",
      },
    },
    {
      label: "Article",
      screenshots: {
        portraitLight: "/mobile/mobile-article-light.webp",
        portraitDark: "/mobile/mobile-article-dark.webp",
        landscapeLight: "/mobile/mobile-article-light-landscape.webp",
        landscapeDark: "/mobile/mobile-article-dark-landscape.webp",
      },
    },
    {
      label: "Search",
      screenshots: {
        portraitLight: "/mobile/mobile-search-light.webp",
        portraitDark: "/mobile/mobile-search-dark.webp",
        landscapeLight: "/mobile/mobile-search-light-landscape.webp",
        landscapeDark: "/mobile/mobile-search-dark-landscape.webp",
      },
    },
  ];

  return (
    <section
      id={id}
      className="w-full pb-20 flex flex-col items-center bg-transparent relative overflow-hidden"
    >
      

      <div className="w-full flex flex-col items-center">
        <PhoneMockup
          screens={screens}
          rotateButtonClassName={rotateButtonClassName}
          themeButtonClassName={themeButtonClassName}
          tabButtonClassName={tabButtonClassName}
          activeTabFillClassName={activeTabFillClassName}
          inactiveTabFillClassName={inactiveTabFillClassName}
        />
      </div>
    </section>
  );
}
