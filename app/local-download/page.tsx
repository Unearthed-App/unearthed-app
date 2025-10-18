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
    createdAt?: string | null;
  };

  const [distinctId, setDistinctId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productName, setProductName] = useState<string | null>(null);
  const [versions, setVersions] = useState<LocalVersion[] | null>(null);

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
    <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-32">
      <h1 className="text-2xl font-bold mb-4">Download Unearthed Local</h1>
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
        <div className="mb-6 p-3 border border-red-300 text-red-700 dark:text-red-400 rounded">
          {error}
        </div>
      )}

      {productName && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available downloads</h2>

          {(!versions || versions.length === 0) && (
            <p className="text-sm text-muted-foreground">
              No versions found for this product yet.
            </p>
          )}

          {versions && versions.length > 0 && (
            <ul className="space-y-4">
              {versions.map((v) => (
                <li key={v.id} className="p-4 border rounded bg-card">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="font-medium">Version {v.version}</div>
                      <div className="text-xs text-muted-foreground">
                        {v.createdAt
                          ? new Date(v.createdAt).toLocaleString()
                          : null}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {v.productLinkWindows && (
                        <Button asChild>
                          <a href={v.productLinkWindows} target="_blank">
                            Windows
                          </a>
                        </Button>
                      )}
                      {v.productLinkMacIntel && (
                        <Button asChild>
                          <a href={v.productLinkMacIntel} target="_blank">
                            macOS (Intel)
                          </a>
                        </Button>
                      )}
                      {v.productLinkMacSilicon && (
                        <Button asChild>
                          <a href={v.productLinkMacSilicon} target="_blank">
                            macOS (Apple Silicon)
                          </a>
                        </Button>
                      )}
                      {v.productLinkLinux && (
                        <Button asChild>
                          <a href={v.productLinkLinux} target="_blank">
                            Linux
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}
