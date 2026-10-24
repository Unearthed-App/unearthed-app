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
import { readingGuides } from "@/lib/reading-guides";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";
export function GET() {
  const text = `# Unearthed

> Reading highlights, remembered. Kindle and KOReader highlights, reading reflections, and connected notes.

## Product facts
- Unearthed Online is open source under GPL-3.0. Hosted Online access has a subscription.
- The browser extension, Obsidian plugin and KOReader plugin have public source repositories.
- Local is a separate one time purchase desktop app for Windows, macOS and Linux. Local and Mobile have separate licensing from Online.
- Local exports to Obsidian and Craft and supports read it later articles and RSS.
${capacitiesText("- Online integrates with Obsidian and Notion; Capacities and Supernotes support daily reflection workflows.", "- Online integrates with Obsidian and Notion; Supernotes supports daily reflections. Capacities is coming soon.")}
- Mobile is a separate PWA. Kindle and KOReader syncing on Mobile requires Local.
- Kindle Notebook sync covers annotations available in Amazon Kindle Notebook; it is not universal sideloaded book support.
- Current pricing and requirements are on the product pages.

## Product pages
- [Online](${SITE_URL}/online)
- [Local](${SITE_URL}/local)
- [Mobile](${SITE_URL}/mobile)
- [Compare editions](${SITE_URL}/which-unearthed)
- [Local documentation](${SITE_URL}/local-docs)

## Reading and integration guides
${readingGuides.map((guide) => `- [${guide.title}](${SITE_URL}/guides/${guide.slug}): ${guide.description}`).join("\n")}

## Source repositories
- [Online](https://github.com/Unearthed-App/unearthed-app)
- [Browser extension](https://github.com/Unearthed-App/unearthed-web-extension)
- [Obsidian plugin](https://github.com/Unearthed-App/unearthed-obsidian)
- [KOReader plugin](https://github.com/Unearthed-App/unearthed-koreader)
`;
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  });
}
