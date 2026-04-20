/**
 * Copyright (C) 2026 Unearthed App
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

import { Metadata } from "next";
import React from "react";
import { CheckoutLocal } from "@/components/CheckoutLocal";
import { NonPremiumNavigation } from "@/components/NonPremiumNavigation";
import { LocalScreenshots } from "./LocalScreenshots";
import { ScrollToMockup } from "@/components/ScrollToMockup";
import { Crimson_Pro } from "next/font/google";

const crimsonPro = Crimson_Pro({ subsets: ["latin"] });
import {
  BookOpen,
  Rss,
  FileText,
  Wifi,
  Highlighter,
  Search,
  Lightbulb,
  Monitor,
  Shield,
  Bookmark,
  ArrowRight,
  Keyboard,
  Smartphone,
  Camera,
  PlayCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-static";
export const revalidate = 3600;

export const metadata: Metadata = {
  title:
    "Unearthed Local – Privacy-First Readwise Alternative | One-Time Purchase",
  description:
    "Open-source privacy-first Readwise alternative. One-time purchase desktop app for local-only Kindle and KOReader highlight syncing to Obsidian. Built-in RSS feed reader with article highlighting. Companion mobile app for your phone. No subscriptions, no cloud, complete data ownership.",
  keywords: [
    "readwise alternative",
    "privacy-first readwise",
    "local readwise alternative",
    "one-time purchase readwise",
    "kindle to obsidian",
    "local kindle sync",
    "offline kindle highlights",
    "rss feed reader",
    "rss to obsidian",
    "article highlighting",
    "youtube rss feed",
    "one time purchase",
    "personal knowledge management",
    "privacy-focused",
    "desktop app",
    "local storage",
    "data ownership",
    "no subscription",
    "KOReader sync",
    "kindle highlights local",
    "readwise without subscription",
    "readwise desktop app",
    "open source readwise",
    "read it later",
    "web page import",
    "web clipper",
    "mobile app",
    "android app",
    "ios app",
    "iphone app",
    "kindle mobile",
    "highlights mobile",
  ],
  alternates: {
    canonical: "https://unearthed.app/local",
  },
  openGraph: {
    title:
      "Unearthed Local - Privacy-First Readwise Alternative | One-Time Purchase",
    description:
      "Open-source privacy-first Readwise alternative. One-time purchase desktop app for local-only Kindle and KOReader highlight syncing to Obsidian with built-in RSS reader. No subscriptions, complete data ownership.",
    type: "website",
    url: "https://unearthed.app/local",
    siteName: "Unearthed",
    locale: "en_US",
    images: [
      {
        url: "https://unearthed.app/images/banner.webp",
        width: 1200,
        height: 630,
        alt: "Unearthed Local - Privacy-focused desktop app for Kindle sync to Obsidian",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@unearthedapp",
    title: "Unearthed Local – Privacy-First Readwise Alternative",
    description:
      "One-time purchase privacy-first Readwise alternative. Local-only Kindle sync to Obsidian with RSS reader and article highlighting.",
    images: ["https://unearthed.app/images/banner.webp"],
  },
};

const FEATURES = [
  {
    icon: BookOpen,
    title: "Kindle Sync",
    description:
      "Import all your Kindle highlights and notes through a built-in browser. Auto-sync every hour in the background.",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Rss,
    title: "RSS Feed Reader",
    description:
      "Subscribe to RSS feeds and YouTube channels, or import any web page. Full-height article list with collapsible controls for maximum reading space.",
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: FileText,
    title: "Obsidian Export",
    description:
      "Smart export to Markdown with customizable templates. Optionally include full article content. Only adds new quotes on re-export.",
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Wifi,
    title: "KOReader Sync",
    description:
      "Built-in API server for wireless highlight syncing from your e-reader. No USB cable needed.",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Highlighter,
    title: "Article Highlighting",
    description:
      "Color-coded highlights, notes, and copy-to-clipboard on imported articles. Styled delete confirmations and keyboard-driven workflow.",
    color: "rose",
    gradient: "from-rose-500 to-red-500",
  },
  {
    icon: Bookmark,
    title: "Read It Later",
    description:
      "Bookmark articles to read later. Filter your feed to show only saved articles. Keyboard-driven with a single key press.",
    color: "indigo",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: Search,
    title: "Global Search",
    description:
      "Cmd+K to instantly search across all your books, quotes, notes, and articles.",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Keyboard,
    title: "System-Wide Shortcuts",
    description:
      "Press Ctrl+Shift+I from anywhere to import a URL instantly, even when the app is minimized. Quick access to RSS feeds with Ctrl+Shift+O.",
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Lightbulb,
    title: "Daily Reflection",
    description:
      "A random quote added to your Obsidian daily note. Supports custom date formats and heading insertion.",
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Keyboard,
    title: "Keyboard Shortcuts",
    description:
      "55+ shortcuts for fast insertion and navigation. System-wide shortcuts let you import content from anywhere.",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Monitor,
    title: "Cross-Platform",
    description:
      "Windows, macOS, and Linux. One purchase, all Desktop platforms. Run in the background or from the menu bar.",
    color: "indigo",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: Shield,
    title: "100% Private",
    description:
      "All data stored locally in SQLite. No cloud, no accounts, no tracking. Your data never leaves your home.",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Install",
    description: "Download for your platform and run the installer",
  },
  {
    number: "02",
    title: "Connect",
    description: "Log into Kindle, paste RSS feeds, or set up KOReader",
  },
  {
    number: "03",
    title: "Configure",
    description: "Point Unearthed at your Obsidian vault",
  },
  {
    number: "04",
    title: "Done",
    description:
      "Auto-sync keeps everything up to date. You don't even need to open the app again.",
  },
];

const UnearthedLocal = () => {
  return (
    <>
      {/* <PublicNavbar /> */}
      <ScrollToMockup />
      <div className="min-h-screen p-4 pt-32 relative">
        {/* Green top gradient */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-screen h-[600px] bg-gradient-to-b from-orange-500/[0.13] to-transparent pointer-events-none -z-10" />
        <NonPremiumNavigation currentPage="local" />
        <div className="flex flex-col items-center">
          {/* Hero */}
          <header className="w-full max-w-4xl text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-600/50 bg-orange-500/10 text-orange-700 dark:text-orange-400 text-sm font-bold tracking-widest uppercase mb-8">
              <Monitor className="h-4 w-4" />
              Unearthed Local · Desktop App
            </div>

            <h1
              className={`${crimsonPro.className} text-4xl md:text-5xl lg:text-7xl font-black tracking-tight mb-6 flex flex-col items-center justify-center gap-2`}
            >
              <span className="relative inline-block">
                <span className="bg-gradient-to-br from-orange-600 via-orange-500 to-red-600/80 bg-clip-text text-transparent drop-shadow-sm relative z-10">
                  Your Highlights
                </span>
                <span className="absolute -inset-2 bg-orange-500/10 blur-2xl -z-10 rounded-full" />
              </span>
              <span
                className="text-2xl md:text-3xl lg:text-4xl text-foreground opacity-80"
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "wavy",
                  textDecorationColor: "rgb(234 88 12 / 0.7)",
                  textUnderlineOffset: "6px",
                }}
              >
                Your Machine
              </span>
            </h1>

            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-8 leading-relaxed">
              Sync Kindle and KOReader highlights to Obsidian. Subscribe to RSS
              feeds and annotate articles.{" "}
              <strong>Designed to stay out of your way</strong> and sync in the
              background, or become a reading companion to help you discover,
              highlight, and annotate new content.{" "}
              <strong>You don&apos;t even need to open it after setup</strong>{" "}
              if you don&apos;t want to. All local. No subscriptions. No cloud.
            </p>

            {/* Callout notes */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <span className="flex items-center gap-2 px-4 py-2 rounded-full border border-orange-600/30 bg-orange-500/8 text-sm text-foreground/70 font-medium">
                <span className="w-2 h-2 rounded-full bg-orange-500/60 shrink-0" />
                Desktop app — different to unearthed.app
              </span>
              <span className="flex items-center gap-2 px-4 py-2 rounded-full border border-orange-600/40 bg-orange-500/10 text-sm text-orange-700 dark:text-orange-400 font-medium">
                <Smartphone className="h-4 w-4 shrink-0" />
                Pairs with the mobile app over home Wi-Fi (additional)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CheckoutLocal className="bg-orange-600 hover:bg-orange-700 border-orange-900 shadow-[4px_4px_0px_rgb(154,52,18)] text-white dark:text-white dark:hover:bg-orange-700" />
              <Button
                variant="brutal"
                asChild
                className="border-orange-700 text-orange-800 dark:text-orange-400 dark:bg-orange-950/60 shadow-[4px_4px_0px_rgb(154,52,18)] dark:shadow-[4px_4px_0px_rgb(154,52,18)]"
              >
                <a href="/local-docs">
                  Read the Docs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </header>

          {/* Bento Screenshot Grid */}
          <LocalScreenshots />

          {/* Why Section */}
          <section className="w-full max-w-3xl mb-20 px-4">
            <div className="border-2 border-black dark:border-white/20 rounded-2xl p-8 bg-card/50">
              <p className="text-lg leading-relaxed mb-4">
                <strong>Obsidian</strong>.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                You don&apos;t need a special Obsidian plugin.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                You don&apos;t need to plug in a device.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                You&apos;ll even get a Daily Reflection added to your Obsidian
                daily note.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                <span className="font-bold">
                  Take back your gathered thoughts and store them where{" "}
                  <u>you</u> want them.
                </span>
              </p>
              <p className="text-lg leading-relaxed">
                BTW this also works with KOReader, so get all your notes and
                highlights in one place!
              </p>
            </div>
          </section>

          {/* Content Power Section */}
          <section className="w-full max-w-4xl mb-20 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* YouTube Transcript */}
              <div className="rounded-2xl border-2 border-red-500/40 bg-red-500/5 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 text-white mb-4">
                  <PlayCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-extrabold mb-3 uppercase">
                  YouTube + Full Transcript
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Subscribe to any YouTube channel as an RSS feed. When a video
                  is published, Unearthed imports it automatically — along with
                  the <strong>full transcript</strong> (optional). Highlight the
                  transcript, add notes, and export everything to Obsidian.
                  Treat YouTube like any other reading source.
                </p>
              </div>

              {/* Get Full Article */}
              <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-extrabold mb-3 uppercase">
                  Full Article, Instantly
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  RSS feeds often only deliver a summary or the first few
                  paragraphs. One click on <strong>Get Full Article</strong>{" "}
                  fetches and displays the complete text — without leaving the
                  app.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Or skip the button entirely. Enable{" "}
                  <strong>automatic full-article download</strong> per feed and
                  the complete content is already waiting when you open
                  anything. Configure it once per feed — only auto-download what
                  you actually want.
                </p>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="relative w-full max-w-6xl mb-24 px-4">
            <div className="absolute -top-16 left-8 h-64 w-64 rounded-full bg-primary/5 blur-[110px] -z-10" />
            <div className="absolute -bottom-20 right-8 h-72 w-72 rounded-full bg-secondary/10 blur-[130px] -z-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                const spotlight =
                  feature.color === "blue"
                    ? "59, 130, 246"
                    : feature.color === "purple"
                      ? "168, 85, 247"
                      : feature.color === "amber"
                        ? "245, 158, 11"
                        : feature.color === "emerald"
                          ? "16, 185, 129"
                          : feature.color === "rose"
                            ? "244, 63, 94"
                            : "99, 102, 241";

                return (
                  <div
                    key={feature.title}
                    className="group relative h-full rounded-[2.5rem] border border-border/50 bg-muted/5 p-8 transition-colors hover:bg-muted/10 overflow-hidden"
                    style={
                      { "--spotlight-color": spotlight } as React.CSSProperties
                    }
                  >
                    <div
                      className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(650px circle at 20% 0%, rgba(var(--spotlight-color), 0.15), transparent 80%)",
                      }}
                    />

                    <div className="relative z-10 flex flex-col items-start">
                      <div className="relative mb-8">
                        <div
                          className={`absolute inset-0 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity bg-gradient-to-br ${feature.gradient}`}
                        />
                        <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center bg-background border border-border/50 shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                          <Icon className="w-7 h-7 text-foreground/70 group-hover:text-foreground transition-colors" />
                        </div>
                      </div>

                      <h3
                        className={`${crimsonPro.className} font-black text-2xl mb-4 text-foreground/90 group-hover:text-foreground transition-colors`}
                      >
                        {feature.title}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed text-base font-light group-hover:text-foreground/80 transition-colors">
                        {feature.description}
                      </p>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden rounded-b-[2.5rem]">
                      <div
                        className={`h-full w-0 bg-gradient-to-r ${feature.gradient} transition-all duration-500 group-hover:w-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* How It Works */}
          <section className="w-full max-w-4xl mb-20 px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 uppercase">
              Simple Setup
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {STEPS.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="text-4xl font-black text-primary mb-3">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Version Policy */}
          <section className="w-full max-w-3xl mb-20 px-4">
            <div className="border-2 border-black dark:border-white/20 rounded-2xl p-8 text-center bg-card/50">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-4 uppercase">
                Buy Once. Keep Forever.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                No subscriptions. No lock in. Free updates within your major
                version.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Buy version 1.x &mdash; get every update up to 1.9.9 for free.
              </p>
            </div>
          </section>

          {/* Final CTA */}
          <section className="w-full max-w-2xl mb-16 px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Own Your Reading Life</h2>
            <p className="text-muted-foreground mb-8">
              No subscriptions. No lockin.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CheckoutLocal className="bg-orange-600 hover:bg-orange-700 border-orange-900 shadow-[4px_4px_0px_rgb(154,52,18)] text-white dark:text-white dark:hover:bg-orange-700" />
              <Button
                variant="brutal"
                asChild
                className="border-orange-700 text-orange-800 dark:text-orange-400 dark:bg-orange-950/60 shadow-[4px_4px_0px_rgb(154,52,18)] dark:shadow-[4px_4px_0px_rgb(154,52,18)]"
              >
                <a href="/local-docs">
                  Read the Docs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>{" "}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default UnearthedLocal;
