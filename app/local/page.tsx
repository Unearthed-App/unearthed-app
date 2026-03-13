/**
 * Copyright (C) 2025 Unearthed App
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
    "Open-source privacy-first Readwise alternative. One-time purchase desktop app for local-only Kindle and KOReader highlight syncing to Obsidian. Built-in RSS feed reader with article highlighting. Companion mobile app for iPhone and Android. No subscriptions, no cloud, complete data ownership.",
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
    "ios app",
    "android app",
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
  },
  {
    icon: Rss,
    title: "RSS Feed Reader",
    description:
      "Subscribe to RSS feeds and YouTube channels, or import any web page. Full-height article list with collapsible controls for maximum reading space.",
  },
  {
    icon: FileText,
    title: "Obsidian Export",
    description:
      "Smart export to Markdown with customizable templates. Optionally include full article content. Only adds new quotes on re-export.",
  },
  {
    icon: Wifi,
    title: "KOReader Sync",
    description:
      "Built-in API server for wireless highlight syncing from your e-reader. No USB cable needed.",
  },
  {
    icon: Highlighter,
    title: "Article Highlighting",
    description:
      "Color-coded highlights, notes, and copy-to-clipboard on imported articles. Styled delete confirmations and keyboard-driven workflow.",
  },
  {
    icon: Bookmark,
    title: "Read It Later",
    description:
      "Bookmark articles to read later. Filter your feed to show only saved articles. Keyboard-driven with a single key press.",
  },
  {
    icon: Search,
    title: "Global Search",
    description:
      "Cmd+K to instantly search across all your books, quotes, notes, and articles.",
  },
  {
    icon: Keyboard,
    title: "System-Wide Shortcuts",
    description:
      "Press Ctrl+Shift+I from anywhere to import a URL instantly, even when the app is minimized. Quick access to RSS feeds with Ctrl+Shift+O.",
  },
  {
    icon: Lightbulb,
    title: "Daily Reflection",
    description:
      "A random quote added to your Obsidian daily note. Supports custom date formats and heading insertion.",
  },
  {
    icon: Keyboard,
    title: "Keyboard Shortcuts",
    description:
      "55+ shortcuts for fast navigation, article actions, and more — all fully customisable. System-wide shortcuts let you import content from anywhere.",
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    description:
      "Your library on your phone. The Unearthed Mobile app for iPhone and Android syncs feeds, articles, highlights, sources, and read-it-later status with the desktop over your home Wi-Fi.",
  },
  {
    icon: Monitor,
    title: "Cross-Platform",
    description:
      "Windows, macOS, and Linux. One purchase, all Desktop platforms. Run in the background or from the menu bar.",
  },
  {
    icon: Shield,
    title: "100% Private",
    description:
      "All data stored locally in SQLite. No cloud, no accounts, no tracking. Your data never leaves your home.",
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
      <div className="min-h-screen p-4 pt-16 md:pt-24">
        <NonPremiumNavigation currentPage="local" />
        <div className="font-mono flex flex-col items-center">
          {/* Hero */}
          <header className="w-full max-w-4xl text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[0.95]">
              Your Highlights.
              <br />
              <span className="text-primary">Your Machine.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
              Sync Kindle and KOReader highlights to Obsidian. Subscribe to RSS
              feeds and annotate articles.{" "}
              <strong>Designed to stay out of your way</strong> and sync in the
              background, or become a reading companion to help you discover,
              highlight, and annotate new content.{" "}
              <strong>You don&apos;t even need to open it after setup</strong>{" "}
              if you don&apos;t want to. All local. No subscriptions. No cloud.
            </p>
            <p className="text-sm text-muted-foreground mb-10 italic">
              This is a desktop app &mdash; different to unearthed.app
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CheckoutLocal />
              <Button variant="brutal" asChild>
                <a href="/local-docs">
                  Read the Docs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>{" "}
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
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold uppercase mb-2">
                The Full Content
              </h2>
              <p className="text-sm text-muted-foreground">No more previews</p>
            </div>
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

          {/* Mobile App Section */}
          <section className="w-full max-w-4xl mb-20 px-4">
            <div className="border-2 border-primary rounded-2xl p-8 bg-primary/5 relative overflow-hidden">
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                  New in v1.4.0
                </span>
              </div>

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold uppercase">
                    Unearthed Mobile
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    iPhone &amp; Android — Free with Unearthed Local
                  </p>
                </div>
              </div>

              {/* Intro */}
              <p className="text-lg leading-relaxed mb-6">
                A native companion app for <strong>iPhone and Android</strong>{" "}
                that keeps your entire reading library with you — wherever you
                are. Everything syncs over your{" "}
                <strong>home Wi-Fi, directly between your devices</strong>. No
                cloud account. No subscription. Nothing ever leaves your
                network.
              </p>

              {/* How they work together */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl border border-primary/30 bg-card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Monitor className="h-4 w-4 text-primary" />
                    <p className="font-bold text-sm">
                      Unearthed Local — Desktop
                    </p>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    <li>• Kindle &amp; KOReader highlight sync</li>
                    <li>• RSS feeds, web pages &amp; YouTube imports</li>
                    <li>
                      • Export to Obsidian — full article text, plus your
                      highlights &amp; notes
                    </li>
                    <li>• Daily reflection &amp; background auto-sync</li>
                    <li>• The sync hub everything connects to</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-primary/30 bg-card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Smartphone className="h-4 w-4 text-primary" />
                    <p className="font-bold text-sm">
                      Unearthed Mobile — iPhone &amp; Android
                    </p>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    <li>• Browse your full Kindle &amp; KOReader library</li>
                    <li>• Subscribe to RSS feeds &amp; YouTube channels</li>
                    <li>
                      • Save any article, web page, or YouTube video to read
                      later
                    </li>
                    <li>• YouTube imports include the full transcript</li>
                    <li>• Capture quotes from physical books</li>
                  </ul>
                </div>
              </div>

              {/* Companion framing */}
              <p className="text-lg leading-relaxed mb-6">
                Think of it as a <strong>companion app</strong> for Unearthed
                Local (without Unearthed Local, the mobile app will have limited
                functionalty).
                <br />
                Start reading an article on your phone during your commute —
                open the desktop when you get home and it&apos;s there,
                highlights and all. Subscribe to a new RSS feed on your phone
                and it appears on your desktop. Your entire Kindle and KOReader
                highlight database is always searchable on your phone.
                <strong>One library. Pick it up on any device.</strong>
              </p>

              {/* Capture feature */}
              <div className="rounded-xl border border-primary/30 bg-card p-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="h-5 w-5 text-primary" />
                  <p className="font-bold">Capture: Physical Book Highlights</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  I wanted a single place for <em>all</em> my reading notes —
                  not just Kindle and RSS, but the physical books on my shelf
                  too. Unearthed Mobile was built to solve that.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Tell the app what you&apos;re currently reading and it
                  remembers. Every time you want to save a highlight, open it up
                  and capture: it already knows the book and author. Point your
                  camera at the page, add a note if you want, and it&apos;s
                  saved — right alongside your Kindle highlights, KOReader
                  notes, and annotated articles. Ready for Obsidian export.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No more sticky notes. No separate app for physical books. Your
                  dog-eared paperback now lives in the same library as
                  everything else you read.
                </p>
              </div>

              {/* Privacy callout */}
              <div className="flex items-start gap-3 rounded-xl bg-card border border-primary/30 p-4">
                <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm mb-1">100% Local. Always.</p>
                  <p className="text-sm text-muted-foreground">
                    Sync happens directly between your phone and your computer
                    over your home Wi-Fi. No cloud servers are involved at any
                    point. No accounts to create, no data to upload, nothing
                    leaving your home network. Your library stays yours.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="w-full max-w-5xl mb-20 px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 uppercase">
              Everything You Need
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group border-2 border-black dark:border-white/20 rounded-xl p-5 hover:border-primary dark:hover:border-primary transition-colors bg-card/50"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-base font-bold">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
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
                No subscriptions. No lock-in. Free updates within your major
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
              No subscriptions. No lock-in. All platforms.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CheckoutLocal />
              <Button variant="brutal" asChild>
                <a href="/local-docs">
                  Read the Docs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>{" "}
            </div>
          </section>

          <footer className="mt-8 mb-8 text-sm text-center text-muted-foreground">
            &copy; 2025 Unearthed App. All rights reserved.
          </footer>
        </div>
      </div>
    </>
  );
};

export default UnearthedLocal;
