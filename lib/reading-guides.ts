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

import { CAPACITIES_ENABLED, capacitiesText } from "./capacities-availability";
import { capacitiesGuideVersions } from "./capacities-guide";
import { comparisonSources } from "./readwise-comparison";

export type GuideLink = { label: string; href: string };
export type GuideSection = {
  heading: string;
  text: string;
  steps?: string[];
  bullets?: string[];
  table?: { caption: string; columns: string[]; rows: string[][] };
  example?: { caption: string; code: string };
  image?: { src: string; alt: string; caption: string; width: number; height: number };
  sources?: GuideLink[];
  comparison?: boolean;
};

export type ReadingGuide = {
  slug: string;
  updatedAt: string;
  status?: "coming-soon";
  title: string;
  description: string;
  answer: string;
  sections: GuideSection[];
  faqs?: { question: string; answer: string; links?: GuideLink[] }[];
  links: GuideLink[];
};

export const readingGuides: ReadingGuide[] = [
  {
    slug: "readwise-alternative",
    updatedAt: "2026-10-24",
    title: "Readwise Alternative for Kindle & Obsidian | Unearthed",
    description:
      "Compare Unearthed with Readwise for Kindle and KOReader highlights, Obsidian sync, Craft export and RSS. One time purchase and hosted options.",
    answer:
      "Unearthed is an alternative to Readwise for collecting Kindle and KOReader highlights, revisiting your notes and sending them to the apps where you write. Unearthed Local keeps your library on your computer and exports to Obsidian and Craft. Unearthed Online adds a web library, Notion sync and optional AI. Unearthed Mobile is a separate reader that connects to Unearthed Local. Here’s how the features compare with Readwise and Reader.",
    sections: [
      {
        heading: "The main differences",
        text: "Readwise has two apps: Highlights collects and resurfaces your highlights; Reader is where you read articles, newsletters, PDFs, EPUBs and more. Full Readwise includes both. Unearthed has three separately licensed editions, each with a different role.",
        bullets: [
          "Unearthed Local: a desktop library for Windows, macOS and Linux. Import Kindle and KOReader highlights, read articles and RSS, and export directly to Obsidian or Craft. Buy it once and keep your library on your computer.",
          "Unearthed Online: a subscription web library with the Kindle extension, KOReader uploads, Obsidian and Notion integrations, tags, a connections graph, daily reflections and optional AI tools.",
          "Unearthed Mobile: read articles and RSS, capture physical book quotes with your camera, and revisit highlights on your phone. It works independently for articles; Kindle and KOReader highlights arrive through Unearthed Local.",
        ],
      },
      {
        heading: "Compare the features",
        text: "The Readwise column covers the Full Readwise plan, including both Highlights and Reader. Unearthed’s columns show each edition separately. Read the notes beside a check: some features need a plugin, another edition or a paid plan in the destination app.",
        comparison: true,
      },
      {
        heading: "When Unearthed is a good fit",
        text: "Choose Unearthed Local if your main aim is to keep a reading library on your computer and send highlights to Obsidian or Craft without another subscription. Articles, RSS and quotes you add yourself sit alongside your Kindle and KOReader notes. You can keep short notes about a film, podcast or physical book too; the source doesn’t have to be something you read inside Unearthed.",
        bullets: [
          "For Craft, Unearthed Local creates source and author collections with your quotes and notes. Any extra planning board you add around those collections is optional and your own to design.",
          "For Obsidian on mobile, Unearthed Online’s plugin can fetch your highlights without Unearthed Local running. Obsidian itself must be open for the plugin to write into the vault.",
          capacitiesText("For cloud tools, Unearthed Online connects to Notion and can send daily reflections to Supernotes and Capacities. Those daily reflection connections do not export your whole library.", "For cloud tools, Unearthed Online connects to Notion and sends daily reflections to Supernotes. Capacities is coming soon."),
        ],
      },
      {
        heading: "When Readwise is a better fit",
        text: "Readwise has a broader set of reading formats and import integrations. Reader is the stronger fit if PDFs, EPUBs, email newsletters, podcast transcripts or text to speech are central to how you read. Its cloud service keeps your library in sync across devices without a desktop companion.",
        bullets: [
          "For structured recall, Readwise has Mastery flashcards, spaced repetition, Themed Reviews and review frequency controls. Unearthed’s daily reflection is a simpler way to revisit a quote.",
          "For AI across your reading, Global Ghostreader searches your Reader library and answers with citations on web and desktop. Readwise also offers an official MCP server, command line tool and ChatGPT connection.",
          "For other reading platforms or notes apps, check Readwise’s integration directory. It covers more sources and destinations than Unearthed, including Apple Books, stock Kobo, Apple Notes, Evernote and Logseq.",
        ],
      },
      {
        heading: "Pricing and what your purchase includes",
        text: "With monthly billing, Full Readwise is US$12.99 per month. Reader only and Highlights only are each US$8.99 per month, billed monthly. The single app plans leave out the other app, so they aren’t the same package shown in our comparison. Full Readwise is also available for US$119.88 per year, paid upfront. The main comparison uses monthly billed prices. Readwise offers a 30-day trial.",
        bullets: [
          "Unearthed Local is a one time purchase, with free updates within the major version you buy. For example, a version 1.x purchase includes updates through 1.9.9. Unearthed Mobile is a separate one time purchase; neither is included with Unearthed Online. Current purchase prices are on their product pages.",
          "Unearthed’s Kindle browser extension, Obsidian plugin and KOReader plugin are free to download, with no separate plugin purchase. Using them with the hosted Unearthed Online service requires an Unearthed Online subscription; the KOReader plugin also works with a purchased Unearthed Local app.",
          "Unearthed Online costs $5 per month. Its source code is free under GPL-3.0. If you run your own copy, you provide the hosting, database and connected services, which may have their own costs.",
          "An integration does not include a subscription to its destination. For example, Readwise’s Capacities connection requires Capacities Pro. AI providers may charge separately when you use your own key.",
        ],
      },
      {
        heading: "Moving from Readwise",
        text: "Unearthed doesn’t have a one click Readwise migration. Connecting Kindle or KOReader brings in highlights from those sources; it won’t transfer your Readwise tags, review history or Reader queue. Unearthed Online has a CSV highlight importer, but a Readwise export may need its columns adapted to Unearthed’s template. Unearthed Local does not currently have that CSV importer.",
        steps: [
          "Download a backup of your Readwise highlights and any Reader documents you want to keep.",
          "Import a Kindle or KOReader book into the Unearthed edition you plan to use. Check quotes, personal notes and locations.",
          "Export that book to your notes app. Add another highlight and repeat the export to check the update behaviour.",
          "Try your usual article, mobile and review workflows before cancelling Readwise. Keep your exported backup.",
        ],
      },
      {
        heading: "Sources and comparison notes",
        text: "We publish Unearthed, so this is our product comparison. We checked Readwise’s public product pages and documentation on 23 October 2026 and compared them with Unearthed’s current features. “Not listed” means we couldn’t verify a dedicated feature in those sources; it doesn’t rule out a community tool or a custom workflow. Availability can depend on platform, plan and setup.",
        sources: comparisonSources.map(({ label, href }) => ({ label, href })),
      },
    ],
    faqs: [
      {
        question: "Can I sync Kindle highlights to Obsidian without Readwise?",
        answer: "Yes. Unearthed Local imports highlights and personal notes from Amazon Kindle Notebook and writes Markdown files directly into your Obsidian vault. It is a one time purchase and does not need an Obsidian plugin. Unearthed Online offers a separate hosted route using its free Kindle browser extension and free Obsidian plugin, with an Unearthed Online subscription. Both routes depend on which annotations Amazon makes available in Kindle Notebook.",
        links: [{ label: "Set up Kindle to Obsidian sync", href: "/guides/kindle-to-obsidian" }],
      },
      {
        question: "Is there a Readwise alternative without a subscription?",
        answer: "Unearthed Local is a one time purchase desktop app for Windows, macOS and Linux. It imports Kindle and KOReader highlights, reads saved articles and RSS, and exports to Obsidian or Craft. You keep the purchased version, with free updates within that major version. Automatic imports and exports require the desktop app to be running. Unearthed Mobile is a separate purchase; Unearthed Online is a separate subscription.",
        links: [{ label: "Explore Unearthed Local", href: "/local" }],
      },
      {
        question: "Can Unearthed sync KOReader highlights to Obsidian or Craft?",
        answer: "Yes. The free Unearthed KOReader plugin sends highlights and notes to Unearthed Local or Unearthed Online. Unearthed Local exports directly to Obsidian and Craft. Unearthed Online exports to Obsidian through its free plugin and also connects to Notion. On a Kobo device, this workflow requires KOReader on supported hardware; it is not a connector for the stock Kobo reader.",
        links: [{ label: "Set up KOReader highlight sync", href: "/guides/koreader-highlights" }, { label: "Export highlights to Craft", href: "/guides/kindle-to-craft" }],
      },
      {
        question: "Is Unearthed an alternative to Readwise Reader for articles and RSS?",
        answer: "Unearthed Local and Unearthed Mobile let you save web articles, read RSS and keep highlights and notes. They can suit a read it later workflow alongside your book highlights. They do not replace every Reader feature: Unearthed does not currently include a PDF or EPUB reader, newsletter inbox, podcast transcription or text to speech. Unearthed Online is a highlight library rather than an article reader.",
        links: [{ label: "Read about articles and RSS in Unearthed", href: "/guides/read-it-later" }],
      },
      {
        question: "Is Unearthed free or open source?",
        answer: "Unearthed’s Obsidian plugin, Kindle browser extension and KOReader plugin are free downloads. Unearthed Online’s source code is available free under GPL-3.0, but the hosted service has a subscription. Running your own copy requires your own hosting, database and connected services. Unearthed Local and Unearthed Mobile are separate paid apps, so the free plugins do not make the complete hosted workflow free.",
        links: [{ label: "See which Unearthed apps are open source", href: "/guides/open-source" }],
      },
      {
        question: "Can I move my whole Readwise library into Unearthed?",
        answer: "There is no one click Readwise migration. Reconnecting Kindle or KOReader imports highlights available from those sources, but does not transfer Readwise tags, review history or your Reader queue. Unearthed Online has a CSV highlight importer; a Readwise export may need its columns adapted to Unearthed’s template. Unearthed Local does not currently have that CSV importer. Keep a backup and test a small sample before switching.",
      },
    ],
    links: [
      { label: "Compare editions and integrations", href: "/which-unearthed" },
      { label: "Saving articles and reading RSS", href: "/guides/read-it-later" },
      {
        label: "Read about the open source apps",
        href: "/guides/open-source",
      },
    ],
  },
  {
    slug: "kindle-to-obsidian",
    updatedAt: "2026-10-22",
    title: "How to get Kindle highlights into Obsidian",
    description:
      "Send Kindle highlights to Obsidian with Unearthed Local or Online. Set up imports, choose a vault and customise your Markdown notes.",
    answer:
      "There are two ways to get your Kindle highlights into Obsidian. Unearthed Local exports Markdown files straight to your vault, with no browser extension or Obsidian plugin needed. Unearthed Online imports through the browser extension and sends highlights to your vault through the Obsidian plugin. Local is a one time purchase; Online has a monthly subscription.",
    sections: [
      {
        heading: "What you need before connecting Kindle to Obsidian",
        text: "Open Amazon Kindle Notebook and check that your books, highlights and notes appear there. Unearthed imports from Notebook, so anything missing there won’t come through Kindle sync. Then choose Local or Online below.",
        table: {
          caption: "Choose a Kindle to Obsidian setup",
          columns: ["What you need", "Unearthed Local", "Unearthed Online"],
          rows: [
            ["Unearthed edition", "One time purchase Local app on Windows, macOS or Linux", "Hosted Online subscription"],
            ["Kindle import", "Sign in with Amazon in Local's built in browser", "Chrome or Firefox extension with Unearthed API key and User ID"],
            ["Obsidian export", "Select a writable vault folder on the computer", "Install the Unearthed Obsidian plugin and configure its credentials"],
            ["Obsidian Sync", "Not required to write into the local vault", "Not required for the plugin to write into its vault"],
          ],
        },
        sources: [{ label: "Amazon Kindle Notebook", href: "https://read.amazon.com/notebook" }],
      },
      {
        heading: "Local: export straight to your vault",
        text: "Local saves your highlights as Markdown text files in your Obsidian vault, the folder that holds your notes. Your reading library stays on your computer, and you can edit the export templates to change how the notes look.",
        steps: [
          "Install Unearthed Local on Windows, macOS or Linux.",
          "Connect Kindle in Local and import your available Notebook highlights.",
          "In Local’s Obsidian settings, select your vault and the folder where you want your reading notes.",
          "Choose your templates, export a book and check the note in Obsidian.",
          "Enable automatic export if you want new highlights added to your vault.",
        ],
      },
      {
        heading: "Online: use the open source extension and plugin",
        text: "Choose Online if you want to keep your highlight library on the web. You’ll need an Online subscription, the browser extension for Kindle imports and the Obsidian plugin for exports.",
        steps: [
          "Create an Unearthed Online account and subscribe to Online.",
          "Install the Unearthed extension for Chrome or Firefox and enter your Unearthed API key and User ID from settings. These let the extension connect to your account.",
          "Sync your Amazon Kindle Notebook and confirm the books appear in Unearthed.",
          "Install the Unearthed Obsidian plugin, enter your Unearthed API key and User ID, and run Manual sync.",
          "Edit the book and highlight templates to change how your notes look. Turn on sync at startup if you want new highlights added when Obsidian opens.",
        ],
      },
      {
        heading: "What does Kindle sync include?",
        text: "Kindle sync imports the highlights and notes shown in Amazon Kindle Notebook. Books or documents you copied onto your Kindle yourself may be missing there. The extension uses Amazon in the browser where you’re already signed in; you do not give your Amazon password to Unearthed Online. KOReader highlights and notes use a separate plugin.",
      },
      {
        heading: "Do I need another subscription?",
        text: "Local is a one time purchase. Online has a monthly subscription. Neither needs Obsidian Sync to add notes to a vault on your computer. You can compare current prices on the Local and Online pages.",
      },
      {
        heading: "What the exported note looks like",
        text: "Each book gets its own note, with the title, author, highlights and your annotations together. You can change the headings, colours and layout in the export templates. Here’s an example of a book exported to Obsidian.",
        image: {
          src: "/obsidian-book.png", width: 1481, height: 2324,
          alt: "Unearthed book note in Obsidian with author, Kindle highlights, notes and locations",
          caption: "A book exported to Obsidian, with highlights, notes and reading locations. You can customise this layout in your templates.",
        },
        example: {
          caption: "A simple highlight template for Local",
          code: "> {{content}}\n\n**Note:** {{note}}\n\n{{location}}",
        },
      },
      {
        heading: "What happens when you export again?",
        text: "Local can update the highlight sections it created. Keep any extra writing in the optional Personal Notes section or outside those highlight sections so a later export won’t overwrite it. Changes you make in Obsidian don’t go back to Kindle. The Online plugin handles exports separately, so try a book first if you’re moving between the two.",
        sources: [{ label: "Local export and template settings", href: "/local-docs/settings#obsidian" }],
      },
      {
        heading: "Fix missing Kindle highlights or missing Obsidian notes",
        text: "First check whether the missing book or highlight appears in Unearthed. If it does, the issue is with the export to Obsidian. If it doesn’t, start with the Kindle import.",
        table: {
          caption: "Kindle to Obsidian troubleshooting",
          columns: ["Symptom", "What to check"],
          rows: [
            ["A book never reaches Unearthed", "Open Amazon Kindle Notebook using the same account. Sideloaded books may not be listed there."],
            ["The book is in Local but no note appears", "Check the vault folder, export destination and whether the source is ignored. On macOS, reselect the vault if folder access was denied."],
            ["Online has the book but the plugin does not", "Check the plugin's API key and User ID, then run Manual sync."],
            ["New annotations are missing", "Import the latest source annotations first, then export again. Check the correct book and destination folder."],
          ],
        },
      },
    ],
    links: [
      { label: "Local pricing and download", href: "/local" },
      {
        label: "Vault and template settings",
        href: "/local-docs/settings#obsidian",
      },
      {
        label: "Obsidian plugin installation",
        href: "https://github.com/Unearthed-App/unearthed-obsidian",
      },
    ],
  },
  {
    slug: "koreader-highlights",
    updatedAt: "2026-10-24",
    title: "Sync KOReader highlights to Obsidian, Craft or Notion",
    description:
      "Send KOReader highlights over Wi-Fi to Unearthed, then save them in Obsidian, Craft or Notion. See the setup steps for Local and Online.",
    answer:
      capacitiesText("The Unearthed KOReader plugin sends your highlights and notes wirelessly to Local or Online. From Local, you can export to Obsidian or Craft. Online works with the Obsidian plugin, syncs books to Notion, and sends daily reflections to Capacities and Supernotes.", "The Unearthed KOReader plugin sends your highlights and notes wirelessly to Local or Online. From Local, you can export to Obsidian or Craft. Online works with the Obsidian plugin, syncs books to Notion, and sends daily reflections to Supernotes. Capacities is coming soon."),
    sections: [
      {
        heading: "Set up the KOReader plugin",
        text: "Follow the plugin’s installation instructions on GitHub. You need to be reading in KOReader, rather than the default reader that came with your Kindle or Kobo.",
        steps: [
          "Install Unearthed.koplugin in KOReader’s plugins folder and restart KOReader.",
          "Enable Unearthed in Plugin Management if needed.",
          "Set Book Location to the folder containing your books and their .sdr folders, where KOReader saves highlights and reading progress.",
          "For Online, enter the Unearthed API key and User ID. For Local, copy the connection URL and Local Secret from your desktop setup.",
          "Close the current book so KOReader saves its highlights and notes, then use Send Books and check the received highlights.",
        ],
      },
      {
        heading: "Keep the connection working",
        text: "For Local, keep the desktop app running and make sure your reader can connect to that computer. Copy the connection details from Local settings. Online syncing requires internet access. Startup and hourly sync options are available in the plugin.",
      },
      {
        heading: "Example: a KOReader book into an Obsidian vault",
        text: "You’ll need KOReader installed on your reader and Unearthed Local running on your computer. Connect both devices to the same local network, then follow these steps to send a highlight to Obsidian.",
        steps: [
          "Open a book in KOReader, add a short highlight and a note, then close the book so its metadata is saved.",
          "In Local, save a secret under API Endpoint and copy the displayed connection URL. Keep Local running.",
          "In KOReader, open Tools → Unearthed → Local Settings. Enter that URL and the same secret; confirm the book is under General Settings → Book Location.",
          "Choose Send Books. Your book, highlight and note should now appear in Local.",
          "In Local, select your Obsidian vault and export the book. Check the Markdown note, then repeat with one additional highlight.",
        ],
      },
      {
        heading: "If a highlight is missing",
        text: "Keep the books you want to sync in the folder you chose during setup. Close the book before syncing so KOReader saves your latest highlights. If you read the same title in Kindle and KOReader, check that both sets of highlights appear under the right book.",
      },
      {
        heading: "KOReader connection errors and quick checks",
        text: "If you’re syncing to Local, start by checking that your reader can reach the computer and that the connection details match Local’s settings. For Online, check the API key and User ID instead.",
        table: {
          caption: "Common KOReader sync problems",
          columns: ["Problem", "Check first"],
          rows: [
            ["Unearthed is missing from the Tools menu", "Keep the Unearthed.koplugin folder inside koreader/plugins, restart KOReader and check Plugin Management."],
            ["Connection refused or timed out", "Keep Local running; check Wi-Fi, the displayed desktop address, guest network isolation and firewall access for the app."],
            ["Authentication error with Local", "Save the secret in Local and use exactly the same Local Secret in KOReader. An Online API key is not the Local secret."],
            ["Only some books arrive", "Check the configured Book Location and its metadata folders; close the current book before sending."],
            ["Sync stops after a network change", "Copy the current connection URL from Local again; the computer's network address may have changed."],
          ],
        },
      },
      {
        heading: "Can I use the stock Kindle or Kobo reader instead?",
        text: "The plugin reads highlights made in KOReader. It won’t pick up highlights from the reading app that came with your Kindle or Kobo. For Kindle books that appear in Amazon Kindle Notebook, use Unearthed’s Kindle connection instead. If you haven’t installed KOReader yet, check its device support and installation instructions first.",
        sources: [{ label: "KOReader device and installation documentation", href: "https://koreader.rocks/" }],
      },
    ],
    links: [
      {
        label: "KOReader plugin and full setup",
        href: "https://github.com/Unearthed-App/unearthed-koreader",
      },
      { label: "Local connection settings", href: "/local-docs/settings" },
      { label: "Obsidian setup guide", href: "/guides/kindle-to-obsidian" },
    ],
  },
  {
    slug: "kindle-to-craft",
    updatedAt: "2026-10-22",
    title: "Bring Kindle and KOReader highlights into Craft",
    description:
      "Export Kindle and KOReader highlights to Craft with Unearthed Local. Keep books, quotes and short notes together in your Sources collection.",
    answer:
      "Use Unearthed Local to export your Kindle and KOReader highlights to Craft. Each book gets a page with its quotes and your notes, organised in a Sources collection. You can also add notes on articles, films, videos or anything else you’ve read, watched or listened to. Craft export is available in Local.",
    sections: [
      {
        heading: "Connect your reading library to Craft",
        text: "Local uses the same highlight templates for Craft and Obsidian exports. You can use Craft, Obsidian or both.",
        steps: [
          "Install Unearthed Local and import Kindle highlights or connect the KOReader plugin.",
          "In Craft’s Imagine or Connections area, create an authenticated All Documents / Space API connection. This gives Unearthed access to create the folders and collections for your library.",
          "Open Local’s Craft settings and paste the connection URL and API token. Select Test Connection, choose a folder name for your reading notes, then save.",
          "Export a book or article and open it in Craft to see how your templates look.",
          "Turn on article content if you want the full saved article copied to Craft as well as your highlights.",
        ],
        sources: [{ label: "Craft Space / All Documents API", href: "https://connect.craft.do/api-docs/space/" }],
      },
      {
        heading: "What appears in Craft after an export?",
        text: "By default, Local creates a folder called Unearthed with Sources and Authors collections inside. The Sources collection holds your books, articles and videos. Open an entry to see its highlights, notes and, if enabled, the full article. You can also turn off combined sources to give each media type its own collection document.",
        bullets: [
          "The Quotes and Notes columns show how many entries each source contains. Open the source to read them.",
          "Author Name is stored as text. If you want to link it to an Author entry, the optional relation may need setting up in Craft.",
          "Use Local’s export templates and colour settings to change the layout inside each page.",
        ],
      },
      {
        heading: "Optional example: a recommendations board in Craft",
        text: "Here’s one way to make the Sources page your own. This library uses a folder called Unearthed Captured, with Authors and Sources inside it. Above the exported table is a To Consume board for recommendations. The board was added by hand in Craft; it’s an optional addition, and Unearthed’s export works without it.",
        image: {
          src: "/guides/craft/media-notes-and-recommendations.png", width: 1986, height: 1618,
          alt: "Craft Sources page inside Unearthed Captured, with Authors and Sources in the sidebar, a custom To Consume Kanban, and an exported table of books with quote and note counts",
          caption: "An exported library in Craft with an optional, manually added To Consume board above the Sources table.",
        },
        bullets: [
          "The board keeps recommendations together, with views for TV, movies and books. Crime and Punishment and The Gulag Archipelago are waiting in To Consume.",
          "The columns track To Consume, Obtained and In Unearthed. You can choose your own statuses and move cards as you go; Unearthed doesn’t update the board.",
          "The table below holds the exported library, grouped by type. Scarcity Brain has 144 quotes and 18 notes here, ready to open and revisit.",
        ],
      },
      {
        heading: "Keep short notes on everything you read, watch and listen to",
        text: "You can use Unearthed as one place for the quotes and thoughts you want to keep from books, films, TV shows, videos, articles and music. In this example, recommendations stay on the Craft board until you start them or decide they belong in your library. Unearthed then holds the things you’re spending time with and the notes you take along the way. You can read supported content in Unearthed, or watch, read and listen elsewhere and add your notes afterwards.",
        steps: [
          "Keep a recommendation on the optional Craft board, or add it straight to Unearthed.",
          "When you start something, commit to it or finish it elsewhere, add it as a source in Unearthed. Import highlights from supported Kindle and KOReader books, or add quotes and notes manually for other media.",
          "Save the passages, lines and observations you want to remember under that source. You don’t need to store or play the original media in Unearthed.",
          "Export to Craft to add those quotes and notes to your Sources collection. If you’re using a board, move the recommendation to In Unearthed yourself.",
          "Come back to the Sources page to reread your notes or choose something new from your recommendations.",
        ],
      },
      {
        heading: "Send articles to Craft too",
        text: "Local can keep RSS articles and saved web reading alongside your book highlights. You can export the full article to Craft as well as the passages you highlighted.",
      },
      {
        heading: "What you need for Craft export",
        text: "You’ll need Unearthed Local and a Craft space with an authenticated All Documents / Space API connection. Craft lists API access on both Free and Plus, though the Free plan has content and storage limits. Check those limits against the size of your library before exporting. Your original Unearthed library stays on your computer, with a copy of the exported content in Craft.",
        sources: [{ label: "Craft plan limits and API access", href: "https://www.craft.do/pricing" }],
      },
      {
        heading: "If Craft connects but the export does not appear",
        text: "Make sure the connection URL and token came from the same Craft connection, and that you chose All Documents / Space access. Look for the folder name saved in Local’s settings and check whether you’ve reached Craft’s content limit. Try exporting one source and read the result shown in Local before retrying the rest.",
      },
      {
        heading: "How updates work",
        text: "Local keeps track of the highlights it has sent to Craft and adds new ones on later exports. It doesn’t send changes from Craft back to Kindle, KOReader or Unearthed. Editing a note that has already been exported in Local also won’t automatically replace its Craft copy.",
      },
    ],
    links: [
      { label: "Get Unearthed Local", href: "/local" },
      { label: "See which note taking apps work with each edition", href: "/which-unearthed" },
    ],
  },
  {
    slug: "kindle-to-notion",
    updatedAt: "2026-10-22",
    title: "Sync Kindle and KOReader highlights to Notion",
    description:
      "Sync Kindle and KOReader highlights to Notion with Unearthed Online. Set up your Sources database and keep book highlights and notes together.",
    answer:
      "Unearthed Online sends your Kindle and KOReader highlights to Notion, with a page for each book and its quotes and notes. Import from Kindle using the browser extension, or from KOReader using its plugin, then connect your Notion workspace in Unearthed’s settings.",
    sections: [
      {
        heading: "Set up Kindle to Notion",
        text: "Import a book into Unearthed first, then connect Notion and check that its highlights arrive.",
        steps: [
          "Create an Unearthed Online account and subscribe to Online.",
          "Install the browser extension and enter your Unearthed API key and User ID.",
          "Sync your Kindle Notebook and check that your books and highlights arrived.",
          "Connect Notion in Unearthed settings and choose the workspace and pages you want Unearthed to access.",
          "Complete the Notion setup prompts and check a synced book before importing a large library.",
        ],
      },
      {
        heading: "Reading in KOReader?",
        text: "The Unearthed KOReader plugin sends highlights to the same Online library. Enter your Unearthed API key and User ID in the plugin, close the book to save recent highlights, then send the books to Unearthed.",
      },
      {
        heading: "What the Notion export contains",
        text: "Unearthed creates a Sources database under the connected Notion template page. Each book has a title, subtitle, author, cover image and import origin. Open a book to find its Quotes and Notes section, with your highlights, annotations and reading locations together.",
        image: {
          src: "/notion-sync-book.png", width: 1302, height: 2323,
          alt: "Unearthed book page in Notion showing author and origin properties above Quotes and Notes",
          caption: "A book in Notion, with its details at the top and highlights, notes and locations below.",
        },
      },
      {
        heading: "How updates work",
        text: "Exports run in the background, so a large library may take a while to appear after setup. On later syncs, Unearthed finds each book by its title and author and adds any missing highlights. Changes made in Notion stay in Notion. Changes to a note already exported from Unearthed also won’t automatically replace its Notion copy.",
        bullets: [
          "Keep the Sources database in the page you connected, with access enabled for Unearthed.",
          "Keep the synced title and author unchanged so Unearthed can find the book again.",
          "If you’re trying the connection for the first time, add a highlight to one book and sync it before importing the rest of your library.",
        ],
      },
      {
        heading: "Choose the Online edition for Notion",
        text: "Local exports directly to Obsidian and Craft. For Unearthed’s Notion integration, choose Online. Online has a monthly subscription, and you can read its code on GitHub.",
      },
      {
        heading: "Troubleshoot a missing Notion book",
        text: "Check that the book appears in Unearthed Online and isn’t marked as ignored. Then look in the connected workspace’s Sources database and allow any queued exports to finish. If you removed the database or revoked access, reconnect Notion in Unearthed’s settings. If a book appears twice, check whether its title or author was changed in Notion.",
      },
    ],
    links: [
      { label: "Unearthed Online", href: "/online" },
      {
        label: "Browser extension setup",
        href: "https://github.com/Unearthed-App/unearthed-web-extension",
      },
      { label: "Source code on GitHub", href: "/guides/open-source" },
    ],
  },
  CAPACITIES_ENABLED ? capacitiesGuideVersions.active : capacitiesGuideVersions.comingSoon,
  {
    slug: "read-it-later",
    updatedAt: "2026-10-22",
    title: "Save articles for later with Unearthed",
    description:
      "Save web articles, read RSS and highlight your reading with Unearthed Local and Mobile. A Readwise Reader alternative for desktop and phone.",
    answer:
      "Unearthed Local combines read it later articles and RSS with Kindle and KOReader highlights in a desktop library. You can read and highlight an article in Local, then send your notes to Obsidian or Craft. Local is a one time purchase desktop app; Unearthed Online is a separate, open source web app.",
    sections: [
      {
        heading: "Save an article and take notes",
        text: "Start with an article you can open in your browser. Import it into Local, highlight the parts you want to keep and export them when you’re ready.",
        steps: [
          "In Local's RSS/article area, choose Import web page, paste the article URL and select Import Page. To make a library source immediately, enable Also create a library source.",
          "Open the imported article. If the RSS item contains only an excerpt, use Get Full Article where available and check the result against the original page.",
          "Select a passage, choose a highlight colour and add a note. You’ll find both in the article’s highlight list.",
          "If the article is not yet a library source, import it into the library before exporting. Check its title, author and source URL.",
          "Choose your Obsidian vault or Craft connection and export. Enable the destination's article content option if you also want the saved body text.",
          "Open the exported note in Obsidian or Craft. Later exports will pick up new highlights you add to the article.",
        ],
        image: {
          src: "/mockups/article_light.webp", width: 1155, height: 638,
          alt: "Unearthed Local article reader with yellow and pink highlights and an annotation editor",
          caption: "Reading an article in Local, with coloured highlights and notes in the sidebar.",
        },
      },
      {
        heading: "Save articles for later and follow RSS feeds",
        text: "Bookmark an article to add it to Read Later, or subscribe to a site’s RSS feed to bring new posts into Local. Some feeds include the full article; others include a summary. Use Get Full Article where available to fetch the rest. When you want an article in your exported notes, add it to your library first.",
      },
      {
        heading: "Should I export the whole article or just highlights?",
        text: "Export just the highlights and notes for a short record of what stood out, or include the article text so you can reread it alongside them. The article export uses the text Local imported, so check that it downloaded fully before relying on that copy.",
        table: {
          caption: "What to include in your exported note",
          columns: ["Export", "Best for", "What to keep in mind"],
          rows: [
            ["Highlights and your notes", "Keeping the passages you want to remember", "Keep the source URL with your notes so you can return to the article"],
            ["Article text and highlights", "Rereading the article alongside your notes", "Enable article content in your export settings and check that the full text imported"],
            ["Leave it in Read Later", "Saving something you haven’t read yet", "Add the article to your library when you want to export it"],
          ],
        },
      },
      {
        heading: "Read on your phone",
        text: "You can install Unearthed Mobile from your phone’s browser. Save web articles, follow RSS feeds and read on your phone. Connect it to Local to share books, articles and highlights between the two apps. Kindle and KOReader highlights reach Mobile through Local. Mobile is a separate purchase.",
      },
      {
        heading: "What to check before leaving another reader",
        text: "Try a few articles from the sites you read regularly. Some pages won’t import cleanly, especially if they need a login or subscription. If you’re moving from Reader, you’ll need to handle your existing library separately: Unearthed doesn’t import a full Reader account, including its queue, newsletter inbox and review history.",
      },
      {
        heading: "Why is an article empty, incomplete or missing from my notes?",
        text: "Open the original page to check whether it needs a login or subscription. If you’re looking at an RSS excerpt, try Get Full Article. If the article is missing from Obsidian or Craft, make sure it’s in your library and that you’ve enabled that export. To include the full text, turn on article content for the destination you’re using.",
      },
    ],
    links: [
      { label: "Local features and pricing", href: "/local" },
      { label: "Mobile features and pricing", href: "/mobile" },
      {
        label: "Readwise alternative guide",
        href: "/guides/readwise-alternative",
      },
    ],
  },
  {
    slug: "open-source",
    updatedAt: "2026-10-24",
    title: "Unearthed Online is open source",
    description:
      "Read the code for Unearthed Online and its browser, Obsidian and KOReader tools. Find out what is open source and what the Online subscription pays for.",
    answer:
      "Unearthed Online, the web application at unearthed.app, is open source under GPL-3.0. The Unearthed browser extension, Obsidian plugin and KOReader plugin also have code you can read on GitHub. Local and Mobile are separate paid apps.",
    sections: [
      {
        heading: "Which apps are open source?",
        text: "Unearthed Online is licensed under GPL-3.0. The browser extension, Obsidian plugin and KOReader plugin also have public GitHub repositories, each with its own license. Local and Mobile are separate paid products with their own licensing.",
        table: {
          caption: "The Unearthed apps and where to find their code",
          columns: ["App", "What it does", "Source code and pricing"],
          rows: [
            ["Unearthed Online", "Hosted highlight library and integrations", "Public GPL-3.0 code; hosted service has a subscription"],
            ["Browser extension", "Kindle Notebook to Online", "Public repository; used with Online"],
            ["Obsidian plugin", "Online library to an Obsidian vault", "Public repository; Local exports without this plugin"],
            ["KOReader plugin", "KOReader annotations to Local or Online", "Public repository; requires a receiving Unearthed edition"],
            ["Unearthed Local and Mobile", "Desktop library and phone companion", "Separate paid products with their own licenses"],
          ],
        },
        sources: [{ label: "Online GPL-3.0 license", href: "https://github.com/Unearthed-App/unearthed-app/blob/main/LICENSE" }],
      },
      {
        heading: "How the apps work together",
        text: capacitiesText("The browser extension brings Kindle Notebook highlights into Online, and the KOReader plugin does the same for books you read in KOReader. From there, use the Obsidian plugin to save them to your vault, or connect Notion to sync them to your workspace. You can also send daily reflections to Capacities and Supernotes.", "The browser extension brings Kindle Notebook highlights into Online, and the KOReader plugin does the same for books you read in KOReader. From there, use the Obsidian plugin to save them to your vault, or connect Notion to sync them to your workspace. You can also send daily reflections to Supernotes. Capacities is coming soon."),
      },
      {
        heading: "Read the code or contribute a fix",
        text: "You’ll find the repositories below, along with their setup instructions and licenses. If something isn’t working, open an issue in the relevant repository. Fixes and improvements are welcome too.",
      },
      {
        heading: "Why does Online have a subscription?",
        text: "The subscription is for the hosted service at unearthed.app. The source code is available under GPL-3.0, but running your own copy means providing the database, hosting and connected services yourself. If you prefer an app you can install on your computer with a one time payment, take a look at Local.",
      },
      {
        heading: "Running your own copy of Online",
        text: "You can run your own copy of Unearthed Online using its open source code. You’ll be responsible for hosting, backups, updates and the services your copy uses. This requires web development experience. If you’d rather leave that to us, use the hosted service at unearthed.app. Setup instructions are in the repository README.",
        sources: [
          { label: "Online source and README", href: "https://github.com/Unearthed-App/unearthed-app" },
        ],
      },
      {
        heading: "When is Local the simpler choice?",
        text: "If you want a library on your computer with Obsidian or Craft export, Local is easier to get started with. Install the app, import your highlights and choose where to export them. You won’t need to set up or maintain a web server. Choose our hosted Online service if you want its web library and integrations without running it yourself.",
      },
    ],
    links: [
      {
        label: "Online web app source and license",
        href: "https://github.com/Unearthed-App/unearthed-app",
      },
      {
        label: "Kindle browser extension source",
        href: "https://github.com/Unearthed-App/unearthed-web-extension",
      },
      {
        label: "Obsidian plugin source",
        href: "https://github.com/Unearthed-App/unearthed-obsidian",
      },
      {
        label: "KOReader plugin source",
        href: "https://github.com/Unearthed-App/unearthed-koreader",
      },
      { label: "Online features and pricing", href: "/online" },
    ],
  },
];
