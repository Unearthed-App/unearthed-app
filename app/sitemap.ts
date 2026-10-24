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
import type { MetadataRoute } from "next";
import { publicPages, SITE_URL } from "@/lib/seo";
import { readingGuides } from "@/lib/reading-guides";

export default function sitemap(): MetadataRoute.Sitemap {
  // Guides have explicit editorial dates; do not invent dates on every deploy.
  return [
    ...[...Object.keys(publicPages), "/guides"].map((path) => ({
      url: new URL(path, SITE_URL).href,
    })),
    ...readingGuides.map((guide) => ({
      url: new URL(`/guides/${guide.slug}`, SITE_URL).href,
      lastModified: guide.updatedAt,
    })),
  ];
}
