"use client";

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
} from "lucide-react";
import { DocsSearchDialog } from "./search-dialog";

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
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="pt-24 sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <button
            className="lg:hidden p-1.5 rounded-md hover:bg-accent"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Navigation handled by sidebar */}
          <div className="hidden lg:block" />

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent transition-colors w-full sm:w-64"
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <Sidebar className="hidden lg:flex w-56 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] py-6 overflow-y-auto" />

          {/* Mobile nav overlay */}
          {mobileNavOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setMobileNavOpen(false)}
              />
              <div className="absolute left-0 top-0 h-full w-72 bg-background border-r p-4 pt-16 overflow-y-auto">
                <Sidebar onLinkClick={() => setMobileNavOpen(false)} />
              </div>
            </div>
          )}

          {/* Main content */}
          <main className="min-w-0 flex-1 py-6 lg:py-8 lg:border-l lg:pl-8">
            <div className="max-w-3xl">{children}</div>
          </main>
        </div>
      </div>

      <DocsSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
