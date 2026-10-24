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

import type { ReadingGuide } from "./reading-guides";

const active: ReadingGuide = {
    slug: "kindle-to-capacities",
    updatedAt: "2026-10-22",
    title: "Revisit Kindle highlights in Capacities daily notes",
    description:
      "Send a daily reading reflection from your Kindle and KOReader highlights to Capacities with Unearthed Online.",
    answer:
      "Bring a highlight back into your day with Unearthed Online’s daily reflections. Connect Capacities and choose a space, and Unearthed will add a saved passage, its book details and your note to the daily note there.",
    sections: [
      {
        heading: "Previously connected with an API key?",
        text: "We’ve updated the connection to use Capacities’ approval screen. If you connected with an API key before, open Unearthed’s settings and reconnect. You’ll choose your space and approve access in Capacities.",
        sources: [{ label: "Capacities migration from beta to API v1", href: "https://developers.capacities.io/api/overview/migration" }],
      },
      {
        heading: "Connect Capacities",
        text: "Connect using the steps below. Capacities handles login, permissions and the choice of space.",
        steps: [
          "Import a Kindle book with the browser extension, or send a KOReader book to Online. Confirm at least one highlight is in the library.",
          "Open Online settings → Capacities and select Connect to Capacities, or Reconnect to Capacities for an older connection.",
          "On Capacities’ approval screen, select your space and approve access. Return to Unearthed; the connection saves automatically.",
          "Use Check connection to verify access to the chosen space. Open your daily reflection in Unearthed and check that day’s note in Capacities.",
          "Allow a moment for Capacities to process the reflection. If access was revoked, reconnect in settings. Disconnect in Unearthed or remove access under Capacities → Settings → Capacities API → Connections.",
        ],
        sources: [{ label: "Current Capacities authentication methods", href: "https://developers.capacities.io/api/overview/authentication" }],
      },
      {
        heading: "What gets sent?",
        text: "Each reflection includes the book title, author, highlight, your note and the location, where available. You can reread the passage in your daily note without looking up the book.",
        example: {
          caption: "An example daily reflection",
          code: "## 🔥 Remember This?\n### Example reading notes\n**Author:** Example Author\n\n> Write one sentence about what you learned.\n\n**Location:** 42\n**My note:** Add this to my weekly review.",
        },
        image: {
          src: "/capacities-daily-mobile-small.webp", width: 400, height: 819,
          alt: "Historical Unearthed reflection in a Capacities daily note with book, author, quote, location and personal note",
          caption: "A daily reflection in Capacities, shown in September 2024.",
        },
      },
      {
        heading: "Can I sync every Kindle highlight into Capacities?",
        text: "The Capacities integration currently sends daily reflections. Full library export isn’t available. To export books with all their highlights, use Obsidian, Craft through Local, or Notion through Online.",
      },
      {
        heading: "Also use Supernotes?",
        text: "Online also has a Supernotes daily reflection integration. Connect your Supernotes API key in settings and choose to send your daily reflections there. To export whole books and their highlights as Markdown files, use the Obsidian integration.",
      },
    ],
    links: [
      { label: "Explore Unearthed Online", href: "/online" },
      {
        label: "Export books and highlights to Obsidian",
        href: "/guides/kindle-to-obsidian",
      },
      {
        label: "Review Online source code",
        href: "https://github.com/Unearthed-App/unearthed-app",
      },
    ],
  };

const comingSoon: ReadingGuide = {
  slug: "kindle-to-capacities",
  updatedAt: "2026-10-22",
  status: "coming-soon",
  title: "Capacities: coming soon",
  description: "The Unearthed Capacities integration is coming soon.",
  answer: "Coming soon.",
  sections: [],
  links: [],
};

// Only one version is published at the existing canonical URL. The active setup
// article stays ready in source; it is not linked or indexed during the pause.
export const capacitiesGuideVersions = { active, comingSoon };
