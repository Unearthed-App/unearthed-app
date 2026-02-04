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
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Premium client page that automatically shows ALL available downloads
export default function UnearthedPremiumLocalDownload() {
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

  type ProductVersions = {
    productName: string;
    versions: LocalVersion[];
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productVersions, setProductVersions] = useState<ProductVersions[]>([]);

  useEffect(() => {
    const fetchAllVersions = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/premium/local-versions", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (!res.ok || !data?.success) {
          setError(
            data?.error || "Unable to fetch versions. Please try again."
          );
          return;
        }

        setProductVersions(data.data as ProductVersions[]);
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllVersions();
  }, []);

  const downloadLinks = (v: LocalVersion) => {
    const links = [
      { href: v.productLinkWindows, label: "Windows" },
      { href: v.productLinkMacIntel, label: "macOS (Intel)" },
      { href: v.productLinkMacSilicon, label: "macOS (ARM)" },
      { href: v.productLinkLinux, label: "Linux (DEB)" },
      { href: v.productLinkLinuxRpm, label: "Linux (RPM)" },
    ].filter((l) => l.href);
    return links;
  };

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-16">
        <h1 className="text-3xl font-black mb-2">
          Download Unearthed Local
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Loading all available downloads...
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-16">
      <h1 className="text-3xl font-black mb-2">
        Download Unearthed Local
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        As a premium user, you have access to all available versions of
        Unearthed Local.
      </p>

      {error && (
        <div className="mb-6 p-3 border-2 border-red-500 text-red-700 dark:text-red-400 rounded-md bg-red-50 dark:bg-red-950/30">
          {error}
        </div>
      )}

      {productVersions.length === 0 && !error && (
        <p className="text-sm text-muted-foreground">
          No versions available at this time.
        </p>
      )}

      {productVersions.map((product) => (
        <div key={product.productName} className="mb-12">
          <h2 className="text-xl font-bold mb-4 border-b-2 border-black dark:border-white pb-2">
            {product.productName}
          </h2>

          {product.versions.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No versions found for this product yet.
            </p>
          )}

          <div className="space-y-6">
            {product.versions.map((v, index) => (
              <div
                key={v.id}
                className={`border-2 border-black rounded-md overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-card ${
                  index === 0 ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
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
                    <div className="text-sm border-2 border-black/20 dark:border-white/20 rounded-md p-3 bg-muted/30">
                      <h4 className="font-bold text-xs uppercase tracking-wide text-muted-foreground mb-2">
                        Changes
                      </h4>
                      <ReactMarkdown
                        className="prose prose-sm dark:prose-invert max-w-none [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-0.5 [&_p]:my-1 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_code]:text-xs [&_code]:bg-black/10 [&_code]:dark:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded"
                        remarkPlugins={[remarkGfm]}
                      >
                        {v.changes}
                      </ReactMarkdown>
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
        </div>
      ))}
    </main>
  );
}
