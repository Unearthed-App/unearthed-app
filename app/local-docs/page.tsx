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
  Wifi,
  Info,
} from "lucide-react";

const SECTIONS = [
  {
    title: "Installation",
    description: "Download and set up Unearthed Local on Windows, macOS, or Linux",
    href: "/local-docs/install",
    icon: Download,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    title: "Features",
    description: "Kindle sync, Obsidian export, KOReader integration, and more",
    href: "/local-docs/features",
    icon: Layers,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10",
  },
  {
    title: "Troubleshooting",
    description: "Common issues, error codes, and platform-specific fixes",
    href: "/local-docs/troubleshoot",
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
];

const HIGHLIGHTS = [
  {
    icon: HardDrive,
    title: "100% Offline",
    description: "All data stored locally in SQLite. No cloud account required.",
  },
  {
    icon: Shield,
    title: "Secure by Design",
    description:
      // "Context isolation, disabled node integration, ASAR integrity, encrypted cookies.",

      "Industry-standard security: sandboxed code execution, and no unauthorised access."
  },
  {
    icon: Wifi,
    title: "Device Sync",
    description:
      "Built-in API server for KOReader allowing for wireless syncing.",
  },
  {
    icon: Search,
    title: "Cmd+K Search",
    description:
      "Powerful search to quickly find and navigate to specific quotes or notes.",
  },
];

export default function LocalDocsPage() {
  return (
    <div>
      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium text-primary">v1.2.7</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Unearthed Local
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          A privacy-first desktop app that syncs your Kindle and KOReader
          highlights into Obsidian. Runs entirely on your machine.
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
              Open Settings and configure your{" "}
              <strong>Obsidian vault path</strong>
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
              Your highlights appear in your desired local location as Markdown files
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
              <strong>Read-only sources:</strong> Your Kindle and KOReader data are never modified by Unearthed—they are used as sources only.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>Modified by Unearthed:</strong> The local Unearthed database and your Obsidian vault will be modified during syncing and export.
            </p>
          </div>
        </div>
      </div>

      {/* Tech stack */}
      <div className="mt-6 text-xs text-muted-foreground">
        <p>Built with modern desktop and web technologies.</p>
      </div>
    </div>
  );
}
