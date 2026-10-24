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

import { CAPACITIES_ENABLED } from "./capacities-availability";

export type ComparisonCell = {
  status: "yes" | "no" | "limited" | "unknown" | "soon";
  label: string;
};
export type ComparisonFeature = {
  name: string;
  detail?: string;
  cells: [ComparisonCell, ComparisonCell, ComparisonCell, ComparisonCell];
};
export type ComparisonAudience = "all" | "shared" | "readwise" | "unearthed";

export function matchesComparisonAudience(feature: ComparisonFeature, audience: ComparisonAudience) {
  if (audience === "all") return true;
  const supported = (cell: ComparisonCell) => cell.status === "yes" || cell.status === "limited";
  const [readwise, ...unearthed] = feature.cells;
  if (audience === "shared") return supported(readwise) && unearthed.some(supported);
  return audience === "readwise"
    ? supported(readwise) && !unearthed.some(supported)
    : !supported(readwise) && unearthed.some(supported);
}
export type ComparisonGroup = {
  id: string;
  title: string;
  description: string;
  sources: string[];
  features: ComparisonFeature[];
};

// Column order: Full Readwise (Highlights + Reader), Unearthed Local, Unearthed Online, Unearthed Mobile.
// "Not listed" means unverified in the linked documentation, not impossible
// through a community tool, an API, or a manually assembled workflow.
const yes = (label = "Included"): ComparisonCell => ({ status: "yes", label });
const no: ComparisonCell = { status: "no", label: "Not included" };
const unlisted: ComparisonCell = { status: "unknown", label: "Not listed" };
const via = (label: string): ComparisonCell => ({ status: "limited", label });
const local = via("Through Unearthed Local");
const feature = (
  name: string,
  cells: ComparisonFeature["cells"],
  detail?: string,
): ComparisonFeature => ({ name, cells, ...(detail ? { detail } : {}) });

export const comparisonSources = [
  { id: "pricing", label: "Readwise plans and pricing", href: "https://readwise.io/pricing/reader" },
  { id: "reader", label: "Reader features and supported devices", href: "https://readwise.io/read" },
  { id: "imports", label: "Readwise highlight imports", href: "https://docs.readwise.io/readwise/docs/importing-highlights" },
  { id: "integrations", label: "Readwise integration directory", href: "https://docs.readwise.io/readwise/docs/all-integrations" },
  { id: "capture", label: "Saving articles, files, podcasts and threads", href: "https://docs.readwise.io/reader/docs/faqs/adding-new-content" },
  { id: "migration", label: "Reader imports and migration formats", href: "https://docs.readwise.io/reader/docs/faqs/importing-content" },
  { id: "annotations", label: "Reader highlights, tags and notes", href: "https://docs.readwise.io/reader/docs/faqs/highlights-tags-notes" },
  { id: "action-tags", label: "Readwise action tags and joined highlights", href: "https://docs.readwise.io/readwise/guides/action-tags" },
  { id: "appearance", label: "Reader type, spacing and appearance", href: "https://docs.readwise.io/reader/docs/faqs/appearance" },
  { id: "readwise-mobile", label: "Readwise mobile apps, reminders and widgets", href: "https://docs.readwise.io/readwise/docs/faqs/mobile-apps" },
  { id: "views", label: "Reader filtered views", href: "https://docs.readwise.io/reader/docs/faqs/filtered-views" },
  { id: "review", label: "Readwise review, recommendations and Mastery", href: "https://docs.readwise.io/readwise/docs/faqs/reviewing-highlights" },
  { id: "themes", label: "Themed Reviews", href: "https://docs.readwise.io/readwise/guides/themed-reviews" },
  { id: "ghostreader", label: "Ghostreader, prompts and custom API keys", href: "https://docs.readwise.io/reader/docs/faqs/ghostreader" },
  { id: "global", label: "Global Ghostreader and library wide AI", href: "https://docs.readwise.io/reader/guides/ghostreader/global" },
  { id: "pdf", label: "Reader PDFs and annotated PDF downloads", href: "https://docs.readwise.io/reader/docs/faqs/pdfs" },
  { id: "pdf-import", label: "Readwise PDF highlight import and limitations", href: "https://docs.readwise.io/readwise/docs/importing-highlights/pdf" },
  { id: "tts", label: "Reader text to speech", href: "https://docs.readwise.io/reader/docs/faqs/text-to-speech" },
  { id: "sharing", label: "Reader sharing", href: "https://docs.readwise.io/reader/docs/faqs/sharing" },
  { id: "digest", label: "Reader Daily Digest", href: "https://docs.readwise.io/reader/docs/faqs/daily-digest" },
  { id: "exports", label: "Readwise highlight exports", href: "https://docs.readwise.io/readwise/docs/exporting-highlights" },
  { id: "reader-exports", label: "Reader exports and Send to Kindle", href: "https://docs.readwise.io/reader/docs/faqs/exporting" },
  { id: "craft", label: "Readwise to Craft", href: "https://docs.readwise.io/readwise/docs/exporting-highlights/craft" },
  { id: "capacities", label: "Readwise to Capacities and its Pro requirement", href: "https://docs.readwise.io/readwise/docs/exporting-highlights/capacities" },
  { id: "notebooklm", label: "Readwise to NotebookLM via Google Docs", href: "https://docs.readwise.io/readwise/docs/exporting-highlights/notebooklm" },
  { id: "mcp", label: "Readwise MCP and ChatGPT connection", href: "https://readwise.io/mcp" },
  { id: "cli", label: "Readwise CLI and agent skills", href: "https://readwise.io/cli" },
  { id: "api", label: "Readwise API", href: "https://readwise.io/api_deets" },
  { id: "koreader", label: "KOReader’s built in Readwise exporter", href: "https://github.com/koreader/koreader/blob/master/plugins/exporter.koplugin/target/readwise.lua" },
  { id: "local", label: "Unearthed Local features", href: "/local-docs/features" },
  { id: "online", label: "Unearthed Online features", href: "/online" },
  { id: "mobile", label: "Unearthed Mobile and desktop sync", href: "/local-docs/mobile" },
] as const;

export const comparisonGroups: ComparisonGroup[] = [
  {
    id: "devices-and-storage", title: "Devices & your library",
    description: "Where you can use each app, and where your reading lives.",
    sources: ["reader", "local", "online", "mobile"],
    features: [
      feature("Windows & macOS desktop apps", [yes("Reader desktop"), yes(), via("Web browser"), no]),
      feature("Linux desktop app", [via("Web browser"), yes(), via("Web browser"), no]),
      feature("Web access to your library", [yes(), no, yes(), yes("Unearthed Mobile PWA")]),
      feature("iPhone & iPad", [yes("Native apps"), no, via("Web browser"), yes("Installable PWA")]),
      feature("Android", [yes("Native apps"), no, via("Web browser"), yes("Android app / PWA")]),
      feature("Android e-ink reader support", [yes("E-ink display mode"), no, via("Web browser"), via("Android app / PWA")]),
      feature("Offline reading of saved content", [yes("Reader"), yes(), no, yes()], "Imports, AI, external video and network sync still need a connection."),
      feature("Library stored on your own device", [via("Offline cache + cloud"), yes("On device database"), no, yes("On device storage")]),
      feature("Cloud sync without your desktop running", [yes(), no, yes(), no], "Unearthed Online’s Obsidian plugin can fetch on mobile. Obsidian must be open to write notes."),
      feature("Direct Unearthed Local ↔ Unearthed Mobile library sync", [no, yes("With Unearthed Mobile"), no, yes("With Unearthed Local")], "Unearthed Local must be running and reachable over your network or configured remote connection."),
      feature("Light & dark themes", [yes(), yes(), yes(), yes()]),
    ],
  },
  {
    id: "highlight-sources", title: "Bring in your highlights",
    description: "Book platforms, manual capture and files. Importing highlights is different from importing a whole ebook.",
    sources: ["imports", "integrations", "pdf-import", "koreader", "local", "online", "mobile"],
    features: [
      feature("Kindle highlights & personal notes", [yes(), yes("Built in Amazon login"), yes("Free browser extension"), local], "Kindle Notebook imports only cover annotations Amazon makes available there. Unearthed’s Kindle extension is free to download; syncing to the hosted Unearthed Online service requires an Unearthed Online subscription."),
      feature("KOReader highlights & notes", [yes("KOReader exporter"), yes("Free Unearthed plugin"), yes("Free Unearthed plugin"), local], "The KOReader plugin is free to download. Use it with a purchased Unearthed Local app or an Unearthed Online subscription for the hosted service."),
      feature("Apple Books highlights", [yes(), no, no, no]),
      feature("Kobo highlights", [yes(), via("Via KOReader"), via("Via KOReader"), local], "Unearthed’s Kobo route requires KOReader on a supported device; it is not a stock Kobo account connector."),
      feature("Google Play Books highlights", [yes(), no, no, no]),
      feature("Library / borrowed book highlights", [yes("Supported integrations"), via("Kindle / KOReader"), via("Kindle / KOReader"), local]),
      feature("BookFusion, Everand & Moon+ Reader", [yes("Import integrations"), no, no, no]),
      feature("Feedly, Inoreader & Instapaper highlights", [yes("Import integrations"), no, no, no]),
      feature("Hypothes.is, Raindrop & Refind highlights", [yes("Import integrations"), no, no, no]),
      feature("O’Reilly Learning & Command Browser", [yes("Import integrations"), no, no, no]),
      feature("Snipd & Voicenotes", [yes("Import integrations"), no, no, no]),
      feature("Goodreads supplemental highlights", [yes(), no, no, no]),
      feature("Type or paste a quote manually", [yes(), yes(), yes(), yes()]),
      feature("Add your own books & other media sources", [yes("Manual highlights"), yes(), yes(), yes()], "In Unearthed, a source can represent a book, film, podcast or anything else you want to keep short notes about. This does not import the media itself."),
      feature("Scan physical book quotes with OCR", [yes("Readwise mobile"), via("Through Unearthed Mobile"), no, yes("Camera / photo")]),
      feature("CSV highlight import", [yes(), no, yes(), no]),
      feature("Kindle My Clippings.txt import", [yes(), no, yes(), no]),
      feature("Import annotations from other PDF apps", [yes("PDF import, beta"), no, no, no], "Readwise’s PDF highlight importer is separate from Reader’s PDF reader and supports selected PDF apps. Unearthed imports KOReader’s own annotations, not embedded annotations from other PDF apps."),
      feature("Email highlights or files into the service", [yes(), no, no, no]),
    ],
  },
  {
    id: "reading", title: "Read, watch & listen",
    description: "Reader’s reading tools alongside the article and RSS readers in Unearthed Local and Unearthed Mobile.",
    sources: ["capture", "migration", "pdf", "tts", "appearance", "reader-exports", "local", "mobile"],
    features: [
      feature("Save web articles & read extracted text", [yes("Reader"), yes(), no, yes()]),
      feature("Read it later bookmarks", [yes("Later / Shortlist"), yes(), no, yes()]),
      feature("RSS feeds & full text articles", [yes(), yes(), no, yes()]),
      feature("OPML feed import & export", [yes(), unlisted, no, unlisted]),
      feature("Email newsletters in your reading inbox", [yes(), no, no, no]),
      feature("Read & annotate PDFs", [yes(), no, no, no], "Unearthed can receive highlights from PDFs read in KOReader; it does not contain a PDF reader."),
      feature("Read & annotate EPUB ebooks", [yes(), no, no, no]),
      feature("Import Markdown as a reading document", [yes(), no, no, no]),
      feature("YouTube videos & transcripts", [yes(), yes(), no, via("Transcript availability varies")], "You need an internet connection to watch videos. Transcripts may not be available for every video in Unearthed Mobile."),
      feature("Podcast episode transcripts", [yes("Reader"), no, no, no], "Reader transcribes episodes for reading and highlighting; it is not a full podcast player."),
      feature("Twitter / X threads", [yes(), no, no, no]),
      feature("Browser extension to save & highlight web pages", [yes("Chrome / Firefox / Safari"), no, no, no], "Unearthed Online’s browser extension imports Kindle highlights; it is not a general web clipper."),
      feature("Save articles by pasting a URL", [yes(), yes(), no, yes()]),
      feature("Phone share sheet article capture", [yes(), no, no, via("Android share target")]),
      feature("Text to speech & audio playback", [yes(), no, no, no]),
      feature("Adjustable reading typeface & line spacing", [yes(), unlisted, no, unlisted]),
      feature("Send reading documents to Kindle", [yes(), no, no, no]),
    ],
  },
  {
    id: "notes-and-organisation", title: "Notes & organisation",
    description: "The tools for finding a passage again and building a useful library around it.",
    sources: ["annotations", "action-tags", "views", "pdf", "sharing", "local", "online", "mobile"],
    features: [
      feature("Highlight text & attach personal notes", [yes(), yes(), yes("Imported / manual quotes"), yes()]),
      feature("Find books, highlights & notes", [yes(), yes(), yes(), yes()]),
      feature("Search full saved article text", [yes(), yes(), no, yes()]),
      feature("Tags on sources & individual highlights", [yes(), no, yes(), no]),
      feature("Inline action tags from your reading notes", [yes(), no, no, no]),
      feature("Join separate highlights automatically", [yes("Concatenation tags"), no, no, no]),
      feature("Graph of sources, quotes & tags", [unlisted, no, yes(), no]),
      feature("Custom source types", [unlisted, yes(), yes(), yes()]),
      feature("Edit source titles, authors & metadata", [yes(), yes(), yes(), yes()]),
      feature("Custom highlight colours", [via("Highlight formatting"), yes(), yes("Quote colours"), yes()]),
      feature("Exclude chosen sources from export", [yes(), yes(), yes(), local]),
      feature("Saved queries & advanced filtered views", [yes(), no, no, no]),
      feature("Bulk reading inbox actions", [yes(), yes("Article actions"), no, yes("Article actions")]),
      feature("PDF image / table snapshots", [yes(), no, no, no]),
      feature("Public annotated document sharing", [yes(), no, no, no]),
      feature("Keyboard shortcuts & quick capture", [yes(), yes("Global Quick Import"), via("Standard web controls"), via("Touch / share target")]),
    ],
  },
  {
    id: "review", title: "Revisit what you read",
    description: "Unearthed’s daily reflection resurfaces a quote. Readwise adds a dedicated review and recall system.",
    sources: ["review", "themes", "digest", "readwise-mobile", "local", "online", "mobile"],
    features: [
      feature("Daily highlight review / reflection", [yes("Daily Review"), yes("Daily reflection"), yes("Daily reflection"), yes("Daily reflection")]),
      feature("Daily highlight email", [yes(), no, yes(), no]),
      feature("Native review reminders & iOS widgets", [yes(), no, no, no]),
      feature("Append a reflection to Obsidian daily notes", [unlisted, yes(), yes("Free Unearthed plugin"), local]),
      feature("Spaced repetition & Mastery flashcards", [yes(), no, no, no]),
      feature("Themed Reviews & frequency tuning", [yes(), no, no, no]),
      feature("Audio highlight reviews", [yes(), no, no, no]),
      feature("Supplemental books & popular highlights", [yes(), no, no, no]),
      feature("Email digest of newly saved reading", [yes("Reader Daily Digest"), no, no, no]),
    ],
  },
  {
    id: "ai", title: "Optional AI tools",
    description: "Readwise uses Ghostreader. Unearthed’s built in AI tools are in Unearthed Online; Unearthed Local and Unearthed Mobile do not currently include them.",
    sources: ["ghostreader", "global", "review", "cli", "online"],
    features: [
      feature("Summaries & key themes", [yes(), no, yes("Book analysis"), no]),
      feature("Chat about a book or document", [yes(), no, yes("Book chat"), no]),
      feature("Library wide AI chat with cited sources", [yes("Global Ghostreader"), no, no, no]),
      feature("Automatic document summaries & tags", [yes(), no, via("On demand idea extraction"), no]),
      feature("Extract ideas from your highlights", [yes("Ghostreader prompts"), no, yes(), no]),
      feature("Questions to test your understanding", [yes("Prompts / Quiz skill"), no, yes("Reflection questions"), no]),
      feature("AI feedback on your answers", [yes("Quiz skill / prompts"), no, yes(), no]),
      feature("Book & reading recommendations", [yes("Bonus highlights / AI"), no, yes(), no]),
      feature("Suggestions with opposing viewpoints", [via("Custom AI prompts"), no, yes("Contrasting books"), no]),
      feature("Identify gaps in your reading", [via("Custom AI prompts"), no, yes("Blind Spots"), no]),
      feature("Define, explain & translate text", [yes(), no, via("Ask in book chat"), no]),
      feature("Bring your own AI API key", [yes("OpenAI"), no, yes("OpenAI compatible Chat Completions API"), no], "In Unearthed Online, enter an API key, base URL and model name for a provider that supports the OpenAI Chat Completions request and response format. Custom provider support varies by tool. Provider charges and usage limits apply."),
    ],
  },
  {
    id: "exports", title: "Exports & connected notes",
    description: "A check means there is a supported route, not that every destination syncs in the same way.",
    sources: ["integrations", "exports", "reader-exports", "craft", "capacities", "notebooklm", "local", "online", "mobile"],
    features: [
      feature("Obsidian highlights & notes", [yes("Readwise plugin"), yes("Direct vault export"), yes("Free Unearthed plugin"), local], "Unearthed’s Obsidian plugin is free to download; the hosted Unearthed Online service requires a subscription. Unearthed Local exports directly to your vault without a plugin."),
      feature("Obsidian sync on a phone", [yes("Readwise plugin"), via("Your vault sync setup"), yes("Free Unearthed plugin"), via("Export through Unearthed Local")], "Unearthed Mobile and Obsidian Mobile are separate apps. Unearthed Online’s free Obsidian plugin can run on mobile without Unearthed Local; the hosted Unearthed Online subscription is still required."),
      feature("Craft highlights & notes", [yes("Craft integration"), yes("Direct Craft export"), no, local]),
      feature("Craft source & author collections", [unlisted, yes(), no, local]),
      feature("Notion highlights & notes", [yes(), no, yes(), no]),
      feature("Capacities", [yes("Capacities Pro"), no, CAPACITIES_ENABLED ? yes("Daily reflection only") : { status: "soon", label: "Coming soon" }, no], CAPACITIES_ENABLED ? "Unearthed sends daily reflections to Capacities. It does not export your full library." : "Capacities is coming soon."),
      feature("Supernotes daily reflection", [unlisted, no, yes(), no]),
      feature("Apple Notes", [yes("Mac export tool"), no, no, no]),
      feature("Evernote", [yes(), no, no, no]),
      feature("Logseq & Roam Research", [yes(), no, no, no]),
      feature("OneNote & RemNote", [yes(), no, no, no]),
      feature("Tana & Workflowy", [yes(), no, no, no]),
      feature("NotebookLM via Google Docs", [yes(), no, no, no]),
      feature("Markdown highlight files", [yes(), yes("Obsidian export"), yes("Free Unearthed plugin"), local]),
      feature("CSV highlight export", [yes(), yes(), unlisted, no]),
      feature("Custom export templates", [yes(), yes(), yes("Free Unearthed plugin"), local]),
      feature("Include full saved articles in exports", [yes("Reader Markdown"), yes("Obsidian / Craft"), no, local]),
      feature("Download annotated PDFs", [yes(), no, no, no]),
    ],
  },
  {
    id: "automation-and-ownership", title: "Automation & ownership",
    description: "What can run automatically, and which parts you can control yourself.",
    sources: ["pricing", "api", "mcp", "cli", "local", "online", "mobile"],
    features: [
      feature("Automatic updates to connected notes apps", [yes(), yes("While Unearthed Local runs"), yes("Connector dependent"), local]),
      feature("Hourly Kindle refresh & export", [via("Readwise sync schedule"), yes("While Unearthed Local runs"), via("Kindle extension"), local]),
      feature("System tray & launch at startup", [unlisted, yes(), no, no]),
      feature("API access for integrations", [yes(), yes("Unearthed Local sync API"), yes("Unearthed API"), via("Syncs with Unearthed Local")]),
      feature("Official MCP server & ChatGPT connection", [yes(), no, no, no]),
      feature("Official command line tool & agent skills", [yes(), no, no, no]),
      feature("Highlight webhooks", [yes(), no, no, no]),
      feature("Open source application", [no, no, yes("Free source · GPL-3.0"), no], "Unearthed Online’s source code is free under GPL-3.0. Running your own copy requires your own hosting, database and connected services, which may cost money. Its Kindle extension, Obsidian plugin and KOReader plugin are also free downloads with public source. Unearthed Local and Unearthed Mobile are separate paid products."),
      feature("One time purchase option", [no, yes(), no, yes("Separate purchase")]),
    ],
  },
];

export const comparisonFeatureCount = comparisonGroups.reduce((sum, group) => sum + group.features.length, 0);
