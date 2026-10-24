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

"use client";

import Link from "next/link";
import {
  Download,
  Layers,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Search,
  Shield,
  HardDrive,
  Rss,
  Info,
  Wifi,
  Keyboard,
  Bookmark,
  Smartphone,
  Notebook,
} from "lucide-react";

const SECTIONS = [
  {
    title: "Installation",
    description:
      "Download and set up Unearthed Local on Windows, macOS, or Linux",
    href: "/local-docs/install",
    icon: Download,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    title: "Features",
    description:
      "Kindle sync, Obsidian + Craft Docs export, KOReader integration, and more",
    href: "/local-docs/features",
    icon: Layers,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10",
  },
  {
    title: "Troubleshooting",
    description: "Common issues, error codes, and platform specific fixes",
    href: "/local-docs/troubleshoot",
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
];

const HIGHLIGHTS = [
  {
    icon: HardDrive,
    title: "Stored on your computer",
    description:
      "Your library is saved on your computer. You can use Local without an online account.",
  },
  {
    icon: Rss,
    title: "RSS Reader",
    description:
      "Follow websites through RSS feeds, save articles, and highlight passages as you read.",
  },
  {
    icon: Notebook,
    title: "Obsidian + Craft Export",
    description:
      "Send highlights to Obsidian, Craft or both. You can send new highlights automatically each hour and add a daily reflection.",
  },
  {
    icon: Shield,
    title: "No cloud account required",
    description:
      "Keep your reading library on your computer and choose which apps receive your exports.",
  },
  {
    icon: Wifi,
    title: "Device Sync",
    description:
      "Send highlights from KOReader to your computer over Wi-Fi.",
  },
  {
    icon: Search,
    title: "Cmd+K Search",
    description:
      "Search across your books, highlights and notes.",
  },
  {
    icon: Bookmark,
    title: "Read It Later",
    description:
      "Bookmark articles to read later. Filter your feed to show only saved articles with a single shortcut.",
  },
  {
    icon: Keyboard,
    title: "Keyboard Shortcuts",
    description:
      "Use keyboard shortcuts to move between books, save links and open your feeds. You can change the shortcuts in settings.",
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    description:
      "Read on Android or iPhone with Unearthed Mobile. Share articles and highlights with Local over home Wi-Fi, or photograph a passage from a paper book.",
  },
];

export default function LocalDocsPage() {
  return (
    <div>
      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium text-primary">v1.6.1</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Unearthed Local
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Keep Kindle and KOReader highlights on your computer and send them
          to <strong>Obsidian</strong> or <strong>Craft</strong>. You can also
          save web articles, follow RSS feeds and add notes as you read.
          Connect Unearthed Mobile to read on your phone over home Wi-Fi.
        </p>
      </div>

      {/* Quick highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {HIGHLIGHTS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex gap-3 rounded-lg border p-3.5 bg-card"
            >
              <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section cards */}
      <h2 className="text-lg font-semibold mb-4">Documentation</h2>
      <div className="grid grid-cols-1 gap-3">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group flex items-center gap-4 rounded-lg border p-4 bg-card hover:border-primary/30 transition-colors"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${section.bg}`}
              >
                <Icon className={`h-5 w-5 ${section.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">{section.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {section.description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </Link>
          );
        })}
      </div>

      {/* Quick start */}
      <div className="mt-10 rounded-lg border bg-primary/5 p-5">
        <h3 className="font-semibold text-sm mb-2">Quick Start</h3>
        <ol className="text-sm text-muted-foreground space-y-2">
          <li className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              1
            </span>
            <span>
              <Link
                href="/local-docs/install"
                className="text-primary hover:underline"
              >
                Install
              </Link>{" "}
              the app for your platform
            </span>
          </li>
          <li className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              2
            </span>
            <span>
              Open Settings and choose your <strong>Obsidian vault folder</strong>,
              or connect Craft using the <strong>connection URL and API token</strong>
              {" "}from your Craft account.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              3
            </span>
            <span>
              Click <strong>Establish Kindle Connection</strong> and log into
              Amazon
            </span>
          </li>
          <li className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              4
            </span>
            <span>
              Click <strong>Refresh Kindle Books</strong> to import all your
              highlights
            </span>
          </li>
          <li className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              5
            </span>
            <span>
              Check your books and highlights in Obsidian or Craft. To start
              reading articles too, open <strong>RSS Feeds</strong> and add
              a website’s feed.
            </span>
          </li>
        </ol>
      </div>

      {/* Data safety notice */}
      <div className="mt-8 rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm mb-1">Data Safety</h3>
            <p className="text-sm text-muted-foreground">
              <strong>Read only sources:</strong> Your Kindle, KOReader, and RSS
              feed data are never modified by Unearthed; they are used as sources
              only.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>Modified by Unearthed:</strong> The local Unearthed
              database, your Obsidian vault, and your Craft space (if
              configured) will be modified during syncing and export.
            </p>
          </div>
        </div>
      </div>

      {/* Tech stack */}
      <div className="mt-6 text-xs text-muted-foreground">
        <p>Need help? Use Search docs to find instructions for a feature or setting.</p>
      </div>
    </div>
  );
}
