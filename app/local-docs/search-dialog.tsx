"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Layers,
  Server,
  AlertTriangle,
  Clock,
  X,
  Sparkles,
  Cog,
} from "lucide-react";
import {
  searchDocs,
  getSearchHistory,
  addToSearchHistory,
  clearSearchHistory,
  type SearchItem,
} from "@/lib/local-docs-search";
import Fuse, { FuseResult } from "fuse.js";
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Install: Download,
  Features: Layers,
  Settings: Cog,
  APIs: Server,
  Troubleshoot: AlertTriangle,
  Advanced: Sparkles,
};

const CATEGORY_COLORS: Record<string, string> = {
  Install: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  Features:
    "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  Settings:
    "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
  APIs: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  Troubleshoot:
    "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  Advanced:
    "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
};

function highlightMatch(text: string, indices?: readonly [number, number][]) {
  if (!indices || indices.length === 0) return text;

  const result: React.ReactNode[] = [];
  let lastEnd = 0;

  for (const [start, end] of indices) {
    if (start > lastEnd) {
      result.push(text.slice(lastEnd, start));
    }
    result.push(
      <mark
        key={start}
        className="bg-primary/20 text-foreground rounded-sm px-0.5"
      >
        {text.slice(start, end + 1)}
      </mark>
    );
    lastEnd = end + 1;
  }

  if (lastEnd < text.length) {
    result.push(text.slice(lastEnd));
  }

  return result;
}

export function DocsSearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FuseResult<SearchItem>[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setHistory(getSearchHistory());
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    const searchResults = searchDocs(value);
    setResults(searchResults);
  }, []);

  const handleSelect = useCallback(
    (href: string, title: string) => {
      if (query.trim()) {
        addToSearchHistory(query.trim());
      }
      onOpenChange(false);
      router.push(href);
    },
    [query, router, onOpenChange]
  );

  const handleHistorySelect = useCallback(
    (term: string) => {
      setQuery(term);
      const searchResults = searchDocs(term);
      setResults(searchResults);
    },
    []
  );

  const handleClearHistory = useCallback(() => {
    clearSearchHistory();
    setHistory([]);
  }, []);

  // Group results by category
  const grouped = results.reduce(
    (acc, result) => {
      const cat = result.item.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(result);
      return acc;
    },
    {} as Record<string, FuseResult<SearchItem>[]>
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search documentation..."
        value={query}
        onValueChange={handleSearch}
      />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>
          {query.length < 2 ? (
            <div className="flex flex-col items-center gap-2 py-4 text-muted-foreground">
              <p className="text-sm">Type to search across all documentation</p>
              <div className="flex gap-2 text-xs">
                <kbd className="rounded border bg-primary/10 px-1.5 py-0.5">
                  Enter
                </kbd>
                <span>to select</span>
                <kbd className="rounded border bg-primary/10 px-1.5 py-0.5">
                  Esc
                </kbd>
                <span>to close</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4">
              No results found for &quot;{query}&quot;
            </p>
          )}
        </CommandEmpty>

        {/* Search history */}
        {query.length < 2 && history.length > 0 && (
          <CommandGroup
            heading={
              <div className="flex items-center justify-between">
                <span>Recent searches</span>
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              </div>
            }
          >
            {history.map((term) => (
              <CommandItem
                key={term}
                value={`history-${term}`}
                onSelect={() => handleHistorySelect(term)}
              >
                <Clock className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm">{term}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Grouped results */}
        {Object.entries(grouped).map(([category, items]) => {
          const Icon = CATEGORY_ICONS[category] || Layers;
          return (
            <React.Fragment key={category}>
              <CommandSeparator />
              <CommandGroup
                heading={
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{category}</span>
                    <Badge
                      variant="outline"
                      className={`ml-1 text-[10px] px-1 py-0 ${CATEGORY_COLORS[category] || ""}`}
                    >
                      {items.length}
                    </Badge>
                  </div>
                }
              >
                {items.map((result) => {
                  const titleMatch = result.matches?.find(
                    (m) => m.key === "title"
                  );
                  const contentMatch = result.matches?.find(
                    (m) => m.key === "content"
                  );

                  return (
                    <CommandItem
                      key={result.item.id}
                      value={result.item.id}
                      onSelect={() =>
                        handleSelect(result.item.href, result.item.title)
                      }
                      className="flex flex-col items-start gap-1 py-2.5"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className="font-medium text-sm">
                          {titleMatch
                            ? highlightMatch(
                                result.item.title,
                                titleMatch.indices
                              )
                            : result.item.title}
                        </span>
                        <span className="ml-auto text-[10px] text-muted-foreground">
                          {result.item.section}
                        </span>
                      </div>
                      {contentMatch && (
                        <p className="text-xs text-muted-foreground line-clamp-1 w-full">
                          {highlightMatch(
                            result.item.content,
                            contentMatch.indices?.slice(0, 3)
                          )}
                        </p>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </React.Fragment>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
