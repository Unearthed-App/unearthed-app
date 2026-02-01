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

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-32">
        <h1 className="text-2xl font-bold mb-4">
          Download Unearthed Local (Premium)
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Loading all available downloads...
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-32">
      <h1 className="text-2xl font-bold mb-4">
        Download Unearthed Local (Premium)
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        As a premium user, you have access to all available versions of
        Unearthed Local.
      </p>

      {error && (
        <div className="mb-6 p-3 border border-red-300 text-red-700 dark:text-red-400 rounded">
          {error}
        </div>
      )}

      {productVersions.length === 0 && !error && (
        <p className="text-sm text-muted-foreground">
          No versions available at this time.
        </p>
      )}

      {productVersions.map((product) => (
        <div key={product.productName} className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">{product.productName}</h2>

          {product.versions.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No versions found for this product yet.
            </p>
          )}

          {product.versions.length > 0 && (
            <ul className="space-y-4">
              {product.versions.map((v) => (
                <li key={v.id} className="p-4 border rounded bg-card">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="font-medium">Version {v.version}</div>
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
                            macOS (ARM)
                          </a>
                        </Button>
                      )}
                      {v.productLinkLinux && (
                        <Button asChild>
                          <a href={v.productLinkLinux} target="_blank">
                            Linux (DEB)
                          </a>
                        </Button>
                      )}
                      {v.productLinkLinuxRpm && (
                        <Button asChild>
                          <a href={v.productLinkLinuxRpm} target="_blank">
                            Linux (RPM)
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
      ))}
    </main>
  );
}
