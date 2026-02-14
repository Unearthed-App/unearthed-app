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
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronDown, ChevronUp } from "lucide-react";

export const dynamic = "force-dynamic";

// Client page that calls a server-side public API to fetch available downloads
export default function UnearthedLocalDownload() {
  type LocalVersion = {
    id: string;
    version: number;
    productName: string;
    productLinkWindows?: string | null;
    productLinkMacIntel?: string | null;
    productLinkMacSilicon?: string | null;
    productLinkLinux?: string | null;
    productLinkLinuxRpm?: string | null;
    createdAt?: string | null;
    changes?: string | null;
  };

  const [distinctId, setDistinctId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productName, setProductName] = useState<string | null>(null);
  const [versions, setVersions] = useState<LocalVersion[] | null>(null);
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(
    new Set()
  );

  const toggleVersion = (versionId: string) => {
    setExpandedVersions((prev) => {
      const next = new Set(prev);
      if (next.has(versionId)) {
        next.delete(versionId);
      } else {
        next.add(versionId);
      }
      return next;
    });
  };

  const downloadLinks = (v: LocalVersion) => {
    return [
      { href: v.productLinkWindows, label: "Windows" },
      { href: v.productLinkMacIntel, label: "macOS (Intel)" },
      { href: v.productLinkMacSilicon, label: "macOS (ARM)" },
      { href: v.productLinkLinux, label: "Linux (DEB)" },
      { href: v.productLinkLinuxRpm, label: "Linux (RPM)" },
    ].filter((l) => l.href);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setVersions(null);
    setProductName(null);

    if (!distinctId.trim()) {
      setError("Please enter your Purchase ID.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/public/local-versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ distinctId: distinctId.trim() }),
      });

      const data = await res.json();
      console.log("data", data);
      if (!res.ok || !data?.success) {
        setError(data?.error || "Unable to fetch versions. Please try again.");
        return;
      }

      setProductName(data.data.productName);
      setVersions(data.data.versions as LocalVersion[]);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-16">
      <h1 className="text-3xl font-black mb-2">Download Unearthed Local</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Enter the Purchase ID you received after purchase to see all available
        downloads.
      </p>

      <form
        onSubmit={onSubmit}
        className="flex flex-col sm:flex-row gap-2 mb-8 w-full"
      >
        <Input
          type="text"
          value={distinctId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDistinctId(e.target.value)
          }
          placeholder="Enter your Purchase ID"
          className="w-full sm:flex-1"
        />
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Loading..." : "Find downloads"}
        </Button>
      </form>

      {error && (
        <div className="mb-6 p-3 border-2 border-red-500 text-red-700 dark:text-red-400 rounded-md bg-red-50 dark:bg-red-950/30">
          {error}
        </div>
      )}

      {productName && (
        <div>
          <h2 className="text-xl font-bold mb-4 border-b-2 border-black dark:border-white pb-2">
            Available downloads
          </h2>

          {(!versions || versions.length === 0) && (
            <p className="text-sm text-muted-foreground">
              No versions found for this product yet.
            </p>
          )}

          {versions && versions.length > 0 && (
            <div className="space-y-6">
              {versions.map((v, index) => (
                <div
                  key={v.id}
                  className={`border-2 border-black rounded-md overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-card ${
                    index === 0
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-black bg-muted/50">
                    <span className="text-lg font-black">
                      Version {v.version}
                    </span>
                    {index === 0 && (
                      <span className="text-xs font-bold px-2 py-0.5 bg-primary text-primary-foreground rounded border border-black">
                        LATEST
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-4">
                    {v.changes && (
                      <div className="text-sm border-2 border-cyan-500/30 rounded-md overflow-hidden bg-cyan-500/5">
                        <button
                          onClick={() => toggleVersion(v.id)}
                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-cyan-500/10 transition-colors"
                        >
                          <h4 className="font-bold text-xs uppercase tracking-wide">
                            <span className="text-muted-foreground">
                              Changes
                            </span>{" "}
                            {!expandedVersions.has(v.id) && (
                              <span className="text-[10px] ml-2 font-bold text-cyan-500">
                                (click to expand)
                              </span>
                            )}
                          </h4>
                          {expandedVersions.has(v.id) ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-cyan-500" />
                          )}
                        </button>
                        {expandedVersions.has(v.id) && (
                          <div className="px-3 pb-3 border-t-2 border-black/20 dark:border-white/20 pt-3">
                            <ReactMarkdown
                              className="prose prose-sm dark:prose-invert max-w-none [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-0.5 [&_p]:my-1 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mt-3 [&_h1]:mb-2 [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-2 [&_h2]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 [&_h4]:text-sm [&_h4]:font-medium [&_h5]:text-xs [&_h5]:font-medium [&_h6]:text-xs [&_code]:text-xs [&_code]:bg-black/10 [&_code]:dark:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded"
                              remarkPlugins={[remarkGfm]}
                            >
                              {v.changes}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wide text-muted-foreground mb-2">
                        Downloads
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                        {downloadLinks(v).map((link) => (
                          <Button key={link.label} asChild className="w-full">
                            <a href={link.href!} target="_blank">
                              {link.label}
                            </a>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
