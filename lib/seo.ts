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

import { capacitiesText } from "@/lib/capacities-availability";
import type { Metadata } from "next";

export const SITE_URL = "https://unearthed.app";
export const noIndex: Metadata["robots"] = { index: false, follow: false };

// Only intentionally public pages opt into indexing. New account/utility pages
// inherit noindex from the root layout until explicitly added here.
export const publicPages: Record<
  string,
  { title: string; description: string }
> = {
  "/": {
    title: "Unearthed | Kindle & KOReader Highlights for Your Notes",
    description:
      "Bring Kindle and KOReader highlights into your notes. Choose open source Unearthed Online or a one time purchase Local app with read it later and RSS.",
  },
  "/online": {
    title: "Unearthed Online | Open Source Reading Highlights",
    description:
      capacitiesText("Sync Kindle and KOReader highlights to Obsidian and Notion, send daily reflections to Capacities and Supernotes, and use optional AI book chat. GPL-3.0 open source.", "Sync Kindle and KOReader highlights to Obsidian and Notion. Supernotes daily reflections and optional AI book chat. Capacities coming soon. GPL-3.0."),
  },
  "/local": {
    title: "Kindle to Obsidian & Craft, No Subscription | Unearthed Local",
    description:
      "A one time purchase reading app for Windows, Mac and Linux. Sync Kindle and KOReader highlights, save articles, read RSS, and export to Obsidian or Craft.",
  },
  "/mobile": {
    title: "Read Later & Revisit Highlights on Your Phone | Unearthed",
    description:
      "Save articles, read RSS and revisit highlights with Unearthed Mobile. Installable PWA; one time purchase. Kindle and KOReader syncing requires Unearthed Local.",
  },
  "/which-unearthed": {
    title: "Compare Unearthed Local, Online & Mobile",
    description:
      "Choose your Unearthed setup: open source Online for cloud integrations, Local for Obsidian and Craft without a subscription, or Mobile for reading on your phone.",
  },
  "/local-docs": {
    title: "Unearthed Local Documentation | Setup & Reading Workflows",
    description:
      "Set up Unearthed Local for Kindle and KOReader highlights, Obsidian export, RSS, saved articles and the Mobile companion.",
  },
  "/local-docs/install": {
    title: "Install Unearthed Local on Windows, Mac & Linux",
    description:
      "Install Unearthed Local, connect your Kindle library and choose where to export your highlights.",
  },
  "/local-docs/features": {
    title: "Unearthed Local Features | Kindle, RSS & Highlight Export",
    description:
      "Explore Kindle and KOReader imports, RSS reading, saved articles, highlight search, daily reflections and Markdown export in Unearthed Local.",
  },
  "/local-docs/settings": {
    title: "Unearthed Local Settings | Kindle, Obsidian & Device Sync",
    description:
      "Configure Kindle sync, Obsidian vault paths, export templates, daily reflections and local connections for KOReader and Mobile.",
  },
  "/local-docs/mobile": {
    title: "Connect Unearthed Mobile to Local | Setup Guide",
    description:
      "Install the Unearthed Mobile companion and connect it to your desktop library. Find network, device and sync setup instructions.",
  },
  "/local-docs/troubleshoot": {
    title: "Unearthed Local Troubleshooting | Sync & Export Help",
    description:
      "Troubleshoot Unearthed Local installation, Kindle imports, Obsidian exports and connections to your mobile devices.",
  },
};

export function pageMetadata(path: string, page = publicPages[path]): Metadata {
  if (!page) throw new Error(`Missing public page metadata: ${path}`);
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: path,
      type: "website",
      siteName: "Unearthed",
      images: [
        {
          url: "/images/banner.webp",
          alt: "Unearthed reading highlights and notes",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: ["/images/banner.webp"],
    },
  };
}
