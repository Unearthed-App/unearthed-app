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

import { buttonVariants } from "@/components/ui/button";
import { Crimson_Pro } from "next/font/google";
import styles from "./docs.module.css";

const serif = Crimson_Pro({ subsets: ["latin"], variable: "--docs-serif" });

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Download,
  Layers,
  AlertTriangle,
  Search,
  ChevronRight,
  Menu,
  X,
  Settings,
  Smartphone,
} from "lucide-react";
import { DocsSearchDialog } from "./search-dialog";
// import { PublicNavbar } from "@/components/PublicNavbar";

const NAV_ITEMS = [
  {
    title: "Getting Started",
    href: "/local-docs",
    icon: BookOpen,
    exact: true,
  },
  {
    title: "Installation",
    href: "/local-docs/install",
    icon: Download,
  },
  {
    title: "Features",
    href: "/local-docs/features",
    icon: Layers,
  },
  {
    title: "Settings",
    href: "/local-docs/settings",
    icon: Settings,
  },
  {
    title: "Mobile App",
    href: "/local-docs/mobile",
    icon: Smartphone,
  },
  {
    title: "Troubleshooting",
    href: "/local-docs/troubleshoot",
    icon: AlertTriangle,
  },
];

function Sidebar({
  className,
  onLinkClick,
}: {
  className?: string;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex flex-col gap-1", className)}>
      <div className="mb-4 px-3">
        <Link
          href="/local-docs"
          className="flex items-center gap-2 font-semibold text-lg"
          onClick={onLinkClick}
        >
          <BookOpen className="h-5 w-5 text-primary" />
          <span>Unearthed Local</span>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">
          Desktop App Documentation
        </p>
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.title}</span>
              {isActive && (
                <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default function LocalDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "/" && !searchOpen) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        e.preventDefault();
        setSearchOpen(true);
      }
    },
    [searchOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={`${styles.docs} ${serif.variable} min-h-screen relative`}>
      <div className={`${styles.sheet} mx-auto max-w-7xl px-4 sm:px-8`}>
      <header className={`${styles.toolbar} border-b`}>
        <div className="flex min-h-20 items-center gap-4 py-4">
          <button
            className={buttonVariants({ variant: "brutal", size: "natural", className: "lg:hidden p-2" })}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <p className="hidden sm:block text-sm font-semibold">Local documentation</p>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className={buttonVariants({ variant: "marketingSecondary", size: "compact", className: "w-full sm:w-64" })}
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Search docs...</span>
              <kbd className="ml-auto hidden sm:inline-flex items-center gap-0.5 rounded border bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">
                  {typeof navigator !== "undefined" &&
                  /Mac/i.test(navigator.platform)
                    ? "\u2318"
                    : "Ctrl"}
                </span>
                K
              </kbd>
            </button>
          </div>
        </div>
      </header>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <Sidebar className="hidden lg:flex w-56 shrink-0 self-start sticky top-24 max-h-[calc(100vh-6rem)] py-6 overflow-y-auto" />

          {/* Mobile nav overlay */}
          {mobileNavOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setMobileNavOpen(false)}
              />
              <div className="absolute left-0 top-0 h-full w-72 bg-background border-r p-4 pt-16 overflow-y-auto">
                <button className={buttonVariants({ variant: "brutal", size: "natural", className: "absolute right-4 top-4 p-2" })} onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"><X className="h-4 w-4" /></button>
                <Sidebar onLinkClick={() => setMobileNavOpen(false)} />
              </div>
            </div>
          )}

          {/* Main content */}
          <main className="min-w-0 flex-1 py-6 lg:py-8 lg:border-l lg:pl-8">
            <div className={styles.article}>{children}</div>
          </main>
        </div>
      </div>

      <DocsSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
