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
import { Crimson_Pro } from "next/font/google";
import { CheckoutMobile } from "@/components/CheckoutMobile";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Wifi,
  BookOpen,
  Highlighter,
  Search,
  Shield,
  ArrowRight,
  Monitor,
  Camera,
  Bookmark,
} from "lucide-react";

const crimsonPro = Crimson_Pro({ subsets: ["latin"] });
import Link from "next/link";
import { PhoneMockupSection } from "@/components/PhoneMockup";
import { PwaInstructions } from "@/components/PwaInstructions";

const MOBILE_FEATURES = [
  {
    icon: Wifi,
    title: "Works Offline",
    description:
      "Your highlights are cached locally. Browse your library on a plane, in the subway, anywhere.",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Smartphone,
    title: "Full Articles",
    description:
      "Unearthed will grab the entire article from RSS feeds automatically",
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: BookOpen,
    title: "All Your Sources",
    description:
      "Kindle, KOReader, Physical Books, RSS articles : everything synced to and from your Unearthed Local desktop app.",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Bookmark,
    title: "Read it Later",
    description:
      "Bookmark articles to read later. Filter your feed to show only saved articles",
    color: "rose",
    gradient: "from-rose-500 to-red-500",
  },
  {
    icon: Search,
    title: "Search Everything",
    description: "Find that thing you read from ages ago",
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data stays on your devices. The mobile app connects to your local Unearthed instance.",
    color: "indigo",
    gradient: "from-indigo-500 to-violet-500",
  },
];

export const dynamic = "force-static";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Unearthed Mobile – Highlights on Your Phone | One-Time Purchase",
  description:
    "Access your Kindle and KOReader highlights on any device. Unearthed Mobile is a PWA : works offline, installs like an app, no App Store required. One time payment, unlimited devices.",
  keywords: [
    "unearthed mobile",
    "kindle highlights mobile",
    "highlight manager pwa",
    "readwise mobile alternative",
    "offline highlights app",
    "one-time purchase mobile app",
  ],
};

export default function MobilePage() {
  const mobilePrimaryButtonClassName =
    "border-2 border-purple-900 bg-none bg-purple-600 text-white shadow-[4px_4px_0px_rgb(88,28,135)] hover:bg-purple-700 hover:shadow-[2px_2px_0px_rgb(88,28,135)] dark:text-white dark:hover:bg-purple-700";
  const mobileSecondaryButtonClassName =
    "border-2 border-purple-800 bg-none bg-purple-50 text-purple-800 shadow-[4px_4px_0px_rgb(107,33,168)] hover:bg-purple-100 hover:text-purple-900 hover:shadow-[2px_2px_0px_rgb(107,33,168)] dark:border-purple-700 dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-purple-900/80 dark:hover:text-purple-200 dark:shadow-[4px_4px_0px_rgb(88,28,135)] dark:hover:shadow-[2px_2px_0px_rgb(88,28,135)]";
  const mobileTabButtonClassName =
    "border-purple-900 dark:border-purple-700 shadow-[4px_4px_0px_rgb(88,28,135)] dark:shadow-[4px_4px_0px_rgb(88,28,135)] hover:shadow-[2px_2px_0px_rgb(88,28,135)] dark:hover:shadow-[2px_2px_0px_rgb(88,28,135)] active:shadow-[1px_1px_0px_rgb(88,28,135)] dark:active:shadow-[1px_1px_0px_rgb(88,28,135)] focus-visible:ring-purple-400/70";
  const mobileActiveTabFillClassName = "bg-purple-600";
  const mobileInactiveTabFillClassName =
    "bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-purple-950/80 dark:via-purple-950/60 dark:to-purple-900/60";

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-16 relative">
      {/* Purple top gradient */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-screen h-[600px] bg-gradient-to-b from-purple-500/[0.13] to-transparent pointer-events-none -z-10" />
      <div className="text-center mb-0">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/50 bg-purple-500/10 text-purple-700 dark:text-purple-400 text-sm font-bold tracking-widest uppercase mb-8">
          <Smartphone className="h-4 w-4" />
          Unearthed Mobile · Your Phone
        </div>
      </div>

      <div className="mb-12 text-center px-4 relative z-10 w-full max-w-4xl mx-auto">
        <h2
          className={`${crimsonPro.className} text-4xl md:text-5xl lg:text-7xl font-black tracking-tight mb-6 flex flex-col items-center justify-center gap-2`}
        >
          <span className="relative inline-block">
            <span className="bg-gradient-to-br from-purple-600 via-purple-500 to-purple-600/80 bg-clip-text text-transparent drop-shadow-sm relative z-10">
              On the go
            </span>
            <span className="absolute -inset-2 bg-purple-500/10 blur-2xl -z-10 rounded-full" />
          </span>
          <span
            className="text-2xl md:text-3xl lg:text-4xl text-foreground opacity-80"
            style={{
              textDecoration: "underline",
              textDecorationStyle: "wavy",
              textDecorationColor: "rgb(168 85 247 / 0.7)",
              textUnderlineOffset: "6px",
            }}
          >
            Use your phone for better things
          </span>
        </h2>

        <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed mb-8">
          Your library : Your pocket : No cloud
        </p>

        {/* <div className="flex flex-wrap justify-center gap-4">
          <CheckoutMobile />
        </div> */}
      </div>
      <div className="-mx-4 sm:-mx-6">
        <PhoneMockupSection
          rotateButtonClassName={mobileSecondaryButtonClassName}
          themeButtonClassName={mobilePrimaryButtonClassName}
          tabButtonClassName={mobileTabButtonClassName}
          activeTabFillClassName={mobileActiveTabFillClassName}
          inactiveTabFillClassName={mobileInactiveTabFillClassName}
        />
      </div>

      <div className="my-16 text-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <CheckoutMobile className={mobilePrimaryButtonClassName} />
          <Button
            variant="outline"
            asChild
            className={mobileSecondaryButtonClassName}
          >
            <Link href="/mobile-download">
              Already purchased?
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          One time payment · Unlimited personal devices · No subscription
        </p>
        <p className="mt-2 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <Smartphone className="h-3 w-3 inline-block" />
          PWA — installs from your browser · no App Store required
        </p>
        <PwaInstructions className="mt-4 max-w-2xl mx-auto text-left" />
      </div>
      {/* Mobile App Section */}
      <section id="mobile-mockup" className="w-full max-w-4xl mb-20 px-4">
        <div className="border-2 border-purple-500 rounded-2xl p-8 bg-purple-500/10 relative overflow-hidden">
          {/* Badge */}
          <div className="absolute top-4 right-4">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-600 text-white">
              New in Local v1.4.2
            </span>
          </div>

          {/* Header */}
          <div className="flex flex-col mb-8">
            <h2
              className={`${crimsonPro.className} text-4xl md:text-5xl font-black mb-2`}
            >
              Unearthed Mobile
            </h2>
            <p className="text-sm text-muted-foreground">
              Your Library on Your Phone - Synced Locally
            </p>
          </div>

          {/* Intro */}
          <p className="text-lg leading-relaxed mb-6">
            To get the most out of Unearthed Mobile, you will need{" "}
            <Link
              href="/local"
              className="underline font-semibold hover:text-purple-600 dark:hover:text-purple-400"
              target="_blank"
            >
              Unearthed Local
            </Link>
            . <br />
            Unearthed Mobile is a companion app that keeps your entire reading
            library with you. Everything syncs over your{" "}
            <strong>home Wi-Fi, directly between your devices</strong>. No cloud
            account. No subscription.
          </p>

          {/* How they work together */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link
              href="/local"
              className="rounded-xl border border-purple-500/30 bg-card p-4 hover:bg-purple-500/5 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="h-4 w-4 text-purple-500" />
                <p className="font-bold text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Unearthed Local : Desktop
                </p>
                <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground group-hover:text-purple-500 transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                Needed to sync Kindle &amp; KOReader highlights and export to
                Obsidian.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Everything else — RSS feeds, read-it-later, physical book
                capture — works without it.
              </p>
            </Link>
            <div className="rounded-xl border border-purple-500/30 bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="h-4 w-4 text-purple-500" />
                <p className="font-bold text-sm">
                  Unearthed Mobile : Your Phone
                </p>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>• Capture quotes from physical books</li>
                <li>• Browse your full Kindle &amp; KOReader library</li>
                <li>• Subscribe to RSS feeds &amp; YouTube channels</li>
                <li>
                  • Save any article, web page, or YouTube video to read later
                </li>
                <li>• Daily Reflection from your library</li>
                <li>
                  • Select what you&apos;re currently reading and see a random
                  highlight from it on your home screen
                </li>
              </ul>
            </div>
          </div>

          {/* Companion framing */}
          <ul className="text-base leading-relaxed mb-6 space-y-2 px-0 md:px-12">
            {[
              "Subscribe to a new RSS feed on your phone and it appears on your desktop.",
              "Mark something to 'Read it later' and it will be ready for you on any device",
              "Your entire Kindle and KOReader highlight database is always searchable on your phone.",
            ].map((text) => (
              <li
                key={text}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card/40"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                <span>{text}</span>
              </li>
            ))}
            <li className="flex items-center gap-3 px-4 py-3 rounded-xl border border-purple-500/30 bg-purple-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
              <strong>One library. Pick it up on any device.</strong>
            </li>
          </ul>

          {/* Capture feature */}
          <div className="rounded-xl border border-purple-500/30 bg-card p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Camera className="h-5 w-5 text-purple-500" />
              <p className="font-bold">Capture: Physical Book Highlights</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              I wanted a single place for <em>all</em> my reading notes. Not
              just Kindle and RSS, but the physical books on my shelf too.
              Unearthed Mobile was built to solve that.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Tell the app what you&apos;re currently reading and it remembers.
              Every time you want to save a highlight, open it up and capture:
              it already knows the book and author. Point your camera at the
              page, add a note if you want, and it&apos;s saved right alongside
              your Kindle highlights, KOReader notes, and annotated articles.{" "}
              <Link
                href="/local"
                className="underline font-semibold hover:text-purple-600 dark:hover:text-purple-400"
              >
                Unearthed Local
              </Link>{" "}
              then picks all this up and exports to Obsidian.
            </p>
          </div>

          {/* Privacy callout */}
          <div className="flex items-start gap-3 rounded-xl bg-card border border-purple-500/30 p-4">
            <Shield className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm mb-1">100% Local. Always.</p>
              <p className="text-sm text-muted-foreground">
                Sync happens directly between your phone and your computer over
                your home Wi-Fi. No accounts to create, no data to upload,
                nothing leaving your home network. Your library stays yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative w-full max-w-6xl mb-24 px-4">
        <div className="absolute -top-16 left-8 h-64 w-64 rounded-full bg-primary/5 blur-[110px] -z-10" />
        <div className="absolute -bottom-20 right-8 h-72 w-72 rounded-full bg-secondary/10 blur-[130px] -z-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOBILE_FEATURES.map((feature) => {
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

      {/* How it works */}
      <div className="mb-16">
        <h2 className="text-2xl font-black mb-6 border-b-2 border-purple-500 pb-2">
          How It Works
        </h2>
        <ol className="space-y-4">
          {[
            {
              step: "1",
              text: "Purchase Unearthed Mobile below. You'll receive a Purchase ID.",
            },
            {
              step: "2",
              text: "Open unearthed.app/mobile-download on your phone and enter your Purchase ID.",
            },
            {
              step: "3",
              text: "Connect to your Unearthed Local instance (running on your desktop/home network).",
            },
            {
              step: "4",
              text: "Your highlights sync and are available offline from then on.",
            },
          ].map((item) => (
            <li key={item.step} className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-black text-sm border-2 border-purple-900">
                {item.step}
              </span>
              <p className="text-sm pt-1">{item.text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Pricing CTA */}
      <div className="border-2 border-black rounded-md shadow-[6px_6px_0px_rgba(0,0,0,1)] bg-card p-8 mb-12 text-center">
        <h2 className="text-3xl font-black mb-2">One-Time Purchase</h2>
        <p className="text-muted-foreground mb-4">
          Pay once. Use on all your personal devices. No subscription.
        </p>
        <p className="text-xs text-muted-foreground mb-6 flex items-center justify-center gap-1.5">
          <Smartphone className="h-3 w-3 inline-block" />
          PWA — installs from your browser · no App Store required
        </p>
        <CheckoutMobile className={mobilePrimaryButtonClassName} />
        <PwaInstructions className="mt-6 text-left" />
      </div>
    </main>
  );
}
