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

import { CAPACITIES_ENABLED } from "@/lib/capacities-availability";
import { publicPages, SITE_URL } from "@/lib/seo";
import type { ReadingGuide } from "@/lib/reading-guides";

export const organization = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Unearthed",
  url: SITE_URL,
  sameAs: ["https://github.com/Unearthed-App"],
};

export const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    organization,
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Unearthed",
      url: SITE_URL,
      description: publicPages["/"].description,
      inLanguage: "en",
      publisher: { "@id": organization["@id"] },
    },
  ],
};

const editions = {
  "/local": {
    "@type": "SoftwareApplication",
    name: "Unearthed Local",
    operatingSystem: "Windows, macOS, Linux",
    featureList: [
      "Kindle and KOReader highlight imports",
      "Obsidian and Craft export",
      "Read it later articles and RSS",
      "Local reading library with a one time purchase",
    ],
  },
  "/online": {
    "@type": "WebApplication",
    name: "Unearthed Online",
    license: "https://www.gnu.org/licenses/gpl-3.0.html",
    featureList: [
      "Kindle and KOReader highlight imports",
      "Obsidian and Notion integrations",
      ...(CAPACITIES_ENABLED ? ["Daily reflections in Capacities and Supernotes"] : ["Daily reflections in Supernotes"]),
      "Optional AI summaries and book chat",
    ],
  },
  "/mobile": {
    "@type": "MobileApplication",
    name: "Unearthed Mobile",
    operatingSystem: "Android, iOS",
    featureList: [
      "Installable progressive web app",
      "Read it later articles and RSS",
      "Kindle and KOReader highlight syncing through Unearthed Local",
      "Separate one time purchase",
    ],
  },
} as const;

export function softwareApplicationSchema(path: keyof typeof editions) {
  return {
    "@context": "https://schema.org",
    ...editions[path],
    "@id": `${SITE_URL}${path}#application`,
    url: `${SITE_URL}${path}`,
    description: publicPages[path].description,
    applicationCategory: "ProductivityApplication",
    applicationSuite: "Unearthed",
    publisher: organization,
  };
}

export function guideArticleSchema(guide: ReadingGuide) {
  const url = `${SITE_URL}/guides/${guide.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": guide.status === "coming-soon" ? "WebPage" : "TechArticle",
    "@id": `${url}#article`,
    url,
    headline: guide.title,
    description: guide.description,
    abstract: guide.answer,
    dateModified: guide.updatedAt,
    ...(guide.slug === "readwise-alternative" ? {
      image: [`${SITE_URL}/og/readwise-alternative`],
      about: [
        { "@type": "SoftwareApplication", name: "Readwise", url: "https://readwise.io/" },
        ...(["/local", "/online", "/mobile"] as const).map((path) => ({ "@type": editions[path]["@type"], "@id": `${SITE_URL}${path}#application`, name: editions[path].name, url: `${SITE_URL}${path}` })),
      ],
    } : {}),
    ...(guide.faqs?.length ? { hasPart: { "@type": "FAQPage", "@id": `${url}#readwise-alternative-questions` } } : {}),
    ...(guide.sections.some((section) => section.image) ? {
      image: guide.sections.flatMap((section) => section.image ? [`${SITE_URL}${section.image.src}`] : []),
    } : {}),
    ...(guide.sections.some((section) => section.sources?.length) ? {
      citation: [...new Set(guide.sections.flatMap((section) => section.sources?.map((source) => new URL(source.href, SITE_URL).href) ?? []))],
    } : {}),
    inLanguage: "en",
    author: organization,
    publisher: organization,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Unearthed",
      url: SITE_URL,
    },
  };
}
