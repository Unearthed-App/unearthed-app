"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Wifi,
  FileText,
  FileSpreadsheet,
  Lightbulb,
  Search,
  Library,
  Moon,
  Monitor as TrayIcon,
  Keyboard,
  Palette,
  Rss,
  Highlighter,
  Youtube,
} from "lucide-react";

function FeatureSection({
  id,
  icon: Icon,
  title,
  badge,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{title}</h3>
            {badge && (
              <Badge variant="outline" className="text-[10px]">
                {badge}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="text-sm text-muted-foreground space-y-3 ml-11">
        {children}
      </div>
    </section>
  );
}

function CodeInline({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-xs bg-primary/10 px-1 py-0.5 rounded font-mono">
      {children}
    </code>
  );
}

export default function FeaturesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">Features</h1>
      <p className="text-muted-foreground mb-8">
        Everything Unearthed Local can do for your reading workflow.
      </p>

      <div className="space-y-10">
        {/* Kindle Sync */}
        <FeatureSection
          id="kindle-sync"
          icon={BookOpen}
          title="Kindle Highlight Sync"
          // badge="Core"
        >
          <p>
            Log into your Amazon account through a built-in browser, and Unearthed
            automatically imports all your books and highlights. Everything is stored
            locally on your computer.
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="how-it-works">
              <AccordionTrigger className="text-sm">
                How it works
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>
                    Click <strong>Establish Kindle Connection</strong> to open
                    the in-app browser
                  </li>
                  <li>
                    Log into your Amazon account (credentials are NOT
                    stored&mdash;only the browser session persists)
                  </li>
                  <li>
                    Click <strong>Refresh Kindle Books</strong> to fetch all
                    highlights
                  </li>
                  <li>
                    The app fetches from both the Kindle Library Search API and
                    the Notebook page simultaneously
                  </li>
                  <li>Books are deduplicated by ASIN or title+author</li>
                  <li>
                    Annotations include: quote text, personal notes, highlight
                    color, page/location
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="auto-sync">
              <AccordionTrigger className="text-sm">
                Auto-Sync
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Enable in Settings to automatically fetch new highlights every
                hour. The sync runs in the background and updates your library
                without interaction.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="book-merging">
              <AccordionTrigger className="text-sm">
                Book Merging (Kindle + KOReader)
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  If you have the same book in both Kindle and KOReader, Unearthed
                  automatically merges them into a single entry based on title and author.
                </p>
                <p>
                  All quotes from both sources are combined and deduplicated, so you
                  never have duplicate entries in your Obsidian export.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </FeatureSection>

        {/* KOReader */}
        <FeatureSection
          id="koreader"
          icon={Wifi}
          title="KOReader Integration"
          // badge="API"
        >
          <p>
            Unearthed runs a local HTTP API server on a specific port that KOReader can
            send highlights to.
          </p>
          <div className="rounded-lg border bg-card p-3 space-y-2">
            <p className="text-xs font-medium">Setup Steps:</p>
            <ol className="list-decimal list-inside text-xs space-y-1">
              <li>Open Settings &rarr; API Endpoint section</li>
              <li>Note your device&apos;s local IP (displayed automatically)</li>
              <li>
                Copy the API URL
              </li>
              <li>
                Configure the Unearthed KOReader Plugin with this URL and your
                secret token
              </li>
              <li>Highlights are received and stored automatically</li>
            </ol>
          </div>
          <p className="text-xs">
            <strong>Note:</strong> Both KOReader and Unearthed need to have the same 
            secret token set for the connection to work.
          </p>
        </FeatureSection>

        {/* Obsidian Export */}
        <FeatureSection
          id="obsidian-export"
          icon={FileText}
          title="Export to Obsidian"
          // badge="Core"
        >
          <p>
            Export all highlights as formatted Markdown files directly into your
            Obsidian vault.
          </p>

          <div className="rounded-lg border bg-[hsl(169.4,43.6%,7.6%)] text-gray-100 p-3">
            <pre className="text-xs overflow-x-auto">
{`YourVault/
└── Unearthed (your choice)/
    ├── Books/
    │   ├── Book Title.md
    │   └── Another Book.md
    └── Articles/
        └── Article Title.md`}
            </pre>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="file-contents">
              <AccordionTrigger className="text-sm">
                What each file includes
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <ul className="list-disc list-inside space-y-1">
                  <li>YAML front-matter (title, author, type, origin — Kindle, KOReader, or RSS — ASIN, tags)</li>
                  <li>All highlights formatted with customizable templates</li>
                  <li>
                    Obsidian wiki-links for authors (<CodeInline>[[Author Name]]</CodeInline>)
                  </li>
                  <li>Color-coded highlights (background gradient or text color)</li>
                  <li>Zero-width space markers for duplicate detection on re-export</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="smart-export">
              <AccordionTrigger className="text-sm">
                Smart Export (Only Missing Quotes)
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  When you re-export, Unearthed intelligently detects which quotes
                  are already in your Obsidian files and only adds the new ones.
                </p>
                <p>
                  This is done using invisible zero-width space markers. You can safely
                  edit your Obsidian files without worrying about duplicates on re-export.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="customization">
              <AccordionTrigger className="text-sm">
                Customization options
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <ul className="list-disc list-inside space-y-1">
                  <li>Root folder name (default: &quot;Unearthed&quot;)</li>
                  <li>Filename template: <CodeInline>{`{{title}}`}</CodeInline>, <CodeInline>{`{{author}}`}</CodeInline>, <CodeInline>{`{{type}}`}</CodeInline></li>
                  <li>Quote template with variables: <CodeInline>{`{{content}}`}</CodeInline>, <CodeInline>{`{{note}}`}</CodeInline>, <CodeInline>{`{{location}}`}</CodeInline>, <CodeInline>{`{{color}}`}</CodeInline></li>
                  <li>Source template (YAML front-matter)</li>
                  <li>Color mode: none, background, or text</li>
                  <li>Custom color hex values for all 10 highlight colors</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </FeatureSection>

        {/* CSV Export */}
        <FeatureSection id="csv-export" icon={FileSpreadsheet} title="CSV Export">
          <p>
            Export your entire library as CSV files for spreadsheets or other
            tools. One file per book with columns: Quote, Note, Location, Color,
            CreatedAt. Auto-incrementing folder names to avoid overwrites.
          </p>
        </FeatureSection>

        {/* RSS Feed Reader */}
        <FeatureSection
          id="rss-feeds"
          icon={Rss}
          title="RSS Feed Reader"
          // badge="v1.3.0"
        >
          <p>
            Subscribe to RSS feeds, browse articles from all your subscriptions,
            and import them into your local library for highlighting and
            note-taking.
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="subscribing">
              <AccordionTrigger className="text-sm">
                Subscribing to feeds
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>
                    Navigate to the <strong>RSS Feeds</strong> tab
                  </li>
                  <li>
                    Paste a feed URL into the input field and click{" "}
                    <strong>Subscribe</strong>
                  </li>
                  <li>
                    The feed title, description, and image are detected
                    automatically
                  </li>
                  <li>
                    Both RSS 2.0 and Atom feed formats are supported
                  </li>
                  <li>
                    YouTube channels can be subscribed to as RSS feeds,
                    letting you follow a channel&apos;s uploads directly in
                    Unearthed with embedded video playback and transcripts
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="browsing">
              <AccordionTrigger className="text-sm">
                Browsing &amp; filtering articles
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Articles from all subscribed feeds are displayed newest-first
                  with powerful filtering options:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>Filter by feed</strong> &mdash; view articles from a
                    specific feed or all feeds
                  </li>
                  <li>
                    <strong>Import status</strong> &mdash; All, Imported, or Not
                    Imported
                  </li>
                  <li>
                    <strong>Sort order</strong> &mdash; newest or oldest first
                  </li>
                  <li>
                    <strong>Show/hide hidden</strong> &mdash; toggle visibility
                    of hidden articles
                  </li>
                  <li>
                    <strong>Search</strong> &mdash; filter articles by title
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="article-actions">
              <AccordionTrigger className="text-sm">
                Article actions
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>View</strong> &mdash; read the full article in the
                    in-app reader
                  </li>
                  <li>
                    <strong>Import</strong> &mdash; save the article to your
                    local database as a source (type: Article, origin: RSS)
                  </li>
                  <li>
                    <strong>Open</strong> &mdash; launch the editor for imported
                    articles to add highlights and notes
                  </li>
                  <li>
                    <strong>Hide</strong> &mdash; declutter your feed without
                    deleting the article
                  </li>
                  <li>
                    <strong>Delete</strong> &mdash; permanently remove the
                    article (confirmation dialog warns RSS articles may reappear
                    on refresh)
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="feed-management">
              <AccordionTrigger className="text-sm">
                Feed management
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>Refresh</strong> &mdash; per-feed refresh or bulk
                    &quot;Refresh All Feeds&quot;
                  </li>
                  <li>
                    <strong>Edit URL</strong> &mdash; click the pencil icon on
                    any feed to update its URL
                  </li>
                  <li>
                    <strong>Delete feed</strong> &mdash; removes the feed and
                    all its articles
                  </li>
                  <li>
                    <strong>Auto-refresh</strong> &mdash; all feeds are
                    automatically refreshed when the app starts
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </FeatureSection>

        {/* Article Reader & Highlighting */}
        <FeatureSection
          id="article-reader"
          icon={Highlighter}
          title="Article Highlighting &amp; Notes"
          // badge="v1.3.0"
        >
          <p>
            Imported RSS articles can be opened in an advanced editor with
            color-coded highlighting and note-taking, just like Kindle
            highlights.
          </p>
          <div className="rounded-lg border bg-card p-3 space-y-1.5">
            <p className="text-xs font-medium">Capabilities:</p>
            <ul className="list-disc list-inside text-xs space-y-0.5">
              <li>Select text and highlight with four colors: yellow, blue, pink, orange</li>
              <li>Add text notes to any highlight</li>
              <li>Edit or delete existing highlights</li>
              <li>Search within article text</li>
              <li>Highlights are stored in the database and exported to Obsidian like book quotes</li>
            </ul>
          </div>
          <p className="text-xs">
            <strong>Home tab:</strong> The latest 10 RSS articles are displayed
            on the Home tab with quick-access actions (view, import, open, hide).
          </p>
        </FeatureSection>

        {/* YouTube Embeds */}
        <FeatureSection
          id="youtube"
          icon={Youtube}
          title="YouTube Embed Support"
          // badge="v1.3.0"
        >
          <p>
            RSS articles containing YouTube links are automatically detected and
            displayed with an embedded video player. Video transcripts are
            fetched and injected into the article content when available.
          </p>
          <p className="text-xs">
            <strong>Rate limiting:</strong> Transcript fetching retries
            automatically on rate limits (up to 3 attempts with exponential
            backoff).
          </p>
        </FeatureSection>

        <FeatureSection
          id="daily-reflection"
          icon={Lightbulb}
          title="Daily Reflection"
        >
          <p>
            Get a random quote from your library displayed on the dashboard each
            time you open the app. Optionally append it to your Obsidian daily
            note.
          </p>
          <div className="rounded-lg border bg-card p-3 space-y-1.5">
            <p className="text-xs font-medium">Configurable options:</p>
            <ul className="list-disc list-inside text-xs space-y-0.5">
              <li>
                Date format: full moment.js-compatible tokens (e.g.{" "}
                <CodeInline>YYYY-MM-DD</CodeInline>,{" "}
                <CodeInline>YYYY/MM-MMMM/YYYY-MM-DD-dddd</CodeInline>)
              </li>
              <li>Slashes in the format create subfolders automatically</li>
              <li>Daily notes folder path</li>
              <li>
                Append Under Heading: insert reflections under a specific
                markdown heading (e.g. <CodeInline>### Daily Reflection</CodeInline>)
                instead of at the end of the file
              </li>
              <li>Create Obsidian Daily Note if it doesn&apos;t exist</li>
              <li>Add Daily Reflection on Startup</li>
              <li>
                Template with variables: <CodeInline>{`{{content}}`}</CodeInline>,{" "}
                <CodeInline>{`{{bookTitle}}`}</CodeInline>,{" "}
                <CodeInline>{`{{author}}`}</CodeInline>,{" "}
                <CodeInline>{`{{fileName}}`}</CodeInline>
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 mt-2">
            <p className="text-xs font-medium mb-1">How these settings work together:</p>
            <p className="text-xs text-muted-foreground">
              If <strong>&quot;Create Daily Note&quot;</strong> is <em>disabled</em> but{" "}
              <strong>&quot;Add Reflection on Startup&quot;</strong> is <em>enabled</em>,
              Unearthed will wait until you manually create your daily note in Obsidian,
              then it will automatically add the reflection to it.
            </p>
          </div>
        </FeatureSection>

        {/* Global Search */}
        <FeatureSection
          id="global-search"
          icon={Search}
          title="Global Search"
        >
          <p>
            Search across all books, quotes, and notes using{" "}
            <kbd className="rounded border bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium">
              Ctrl+K
            </kbd>{" "}
            /{" "}
            <kbd className="rounded border bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium">
              Cmd+K
            </kbd>
            .
          </p>
          <ul className="list-disc list-inside text-xs space-y-0.5">
            <li>Full-text search across titles, authors, content, and notes</li>
            <li>Results grouped by source with match type indicators (title, quote, note)</li>
            <li>Keyboard navigation with arrow keys and Enter</li>
            <li>Click a result to open the book and scroll to the specific quote</li>
          </ul>
        </FeatureSection>

        {/* Library Management */}
        <FeatureSection id="library" icon={Library} title="Library Management">
          <p>
            View, search, filter, and manage all your sources from the
            dashboard.
          </p>
          <ul className="list-disc list-inside text-xs space-y-0.5">
            <li>Search books by title or author</li>
            <li>Filter: All, Active, or Ignored sources</li>
            <li>Toggle ignored status (excluded from Obsidian export)</li>
            <li>Delete individual sources or their quotes</li>
            <li>Batch select and operate on multiple sources</li>
            <li>View all quotes for any source in a detailed modal with color-coded accent bars</li>
          </ul>
        </FeatureSection>

        {/* Dark Mode */}
        <FeatureSection id="dark-mode" icon={Moon} title="Dark / Light Mode">
          <p>
            Toggle between dark and light themes from the header. Preference is
            persisted across sessions in settings.
          </p>
        </FeatureSection>

        {/* System Tray */}
        <FeatureSection
          id="tray"
          icon={TrayIcon}
          title="System Tray & Startup"
        >
          <p>
            When <strong>Keep App Running</strong> is enabled, closing the
            window minimizes to the system tray instead of quitting. The app
            continues running for auto-sync and API server availability.
          </p>

          <Tabs defaultValue="tray-menu" className="w-full mt-2">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="tray-menu">Tray Menu</TabsTrigger>
              <TabsTrigger value="startup">Run on Startup</TabsTrigger>
            </TabsList>
            <TabsContent value="tray-menu" className="mt-3 space-y-2">
              <ul className="list-disc list-inside text-xs space-y-0.5">
                <li><strong>Show App</strong> &mdash; Bring window to foreground</li>
                <li><strong>Quit</strong> &mdash; Fully exit the application</li>
              </ul>
            </TabsContent>
            <TabsContent value="startup" className="mt-3 space-y-2">
              <ul className="list-disc list-inside text-xs space-y-0.5">
                <li><strong>Windows:</strong> Use the in-app &quot;Run on Startup&quot; toggle in Settings</li>
                <li>
                  <strong>macOS:</strong> Right-click the Unearthed icon in the Dock &rarr;{" "}
                  <strong>Options</strong> &rarr; <strong>Open at Login</strong>{" "}
                  <span className="text-muted-foreground">(no in-app setting)</span>
                </li>
                <li><strong>Linux:</strong> Creates <CodeInline>.desktop</CodeInline> file in <CodeInline>~/.config/autostart/</CodeInline></li>
              </ul>
            </TabsContent>
          </Tabs>
        </FeatureSection>

        {/* Keyboard Shortcuts */}
        <FeatureSection
          id="keyboard"
          icon={Keyboard}
          title="Keyboard Shortcuts"
          badge="v1.3.2"
        >
          <p>
            Unearthed Local is designed for keyboard-first navigation with 40+
            shortcuts across every part of the app. All shortcuts are{" "}
            <strong>completely customisable</strong> — remap any shortcut to your
            preferred key combination in{" "}
            <strong>Settings &rarr; Keyboard Shortcuts</strong>. Custom bindings
            are saved automatically and take effect immediately without restarting.
          </p>
          <p>
            Press{" "}
            <kbd className="rounded border bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium">
              Ctrl/Cmd + /
            </kbd>{" "}
            at any time to view the shortcuts help overlay inside the app.
          </p>

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="global-shortcuts">
              <AccordionTrigger className="text-sm">
                Global Shortcuts
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <p className="mb-2 text-xs">Available everywhere in the app.</p>
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left font-medium px-3 py-2">Shortcut</th>
                        <th className="text-left font-medium px-3 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Ctrl/Cmd + K", "Open Global Search"],
                        ["Ctrl/Cmd + 1", "Go to Home tab"],
                        ["Ctrl/Cmd + 2", "Go to Kindle tab"],
                        ["Ctrl/Cmd + 3", "Go to RSS Feeds tab"],
                        ["Ctrl/Cmd + 4", "Go to Library tab"],
                        ["Ctrl/Cmd + ,", "Open Settings"],
                        ["Ctrl/Cmd + D", "Toggle Dark Mode"],
                        ["Ctrl/Cmd + /", "Show Keyboard Shortcuts"],
                        ["Escape", "Close Browser View"],
                      ].map(([key, action]) => (
                        <tr key={key} className="border-b last:border-0">
                          <td className="px-3 py-2">
                            <kbd className="rounded border bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium">
                              {key}
                            </kbd>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="home-shortcuts">
              <AccordionTrigger className="text-sm">
                Home Tab
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left font-medium px-3 py-2">Shortcut</th>
                        <th className="text-left font-medium px-3 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["R", "New Random Reflection"],
                        ["C", "Copy Current Reflection"],
                        ["S", "Next Article"],
                        ["A", "Previous Article"],
                        ["Enter", "Open Selected Article"],
                        ["I", "Import Selected Article"],
                        ["H", "Hide/Unhide Selected Article"],
                        ["D", "Delete Selected Article"],
                        ["Ctrl/Cmd + F", "Focus Article Search"],
                      ].map(([key, action]) => (
                        <tr key={key} className="border-b last:border-0">
                          <td className="px-3 py-2">
                            <kbd className="rounded border bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium">
                              {key}
                            </kbd>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rss-shortcuts">
              <AccordionTrigger className="text-sm">
                RSS Feeds Tab
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left font-medium px-3 py-2">Shortcut</th>
                        <th className="text-left font-medium px-3 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["S", "Next Article"],
                        ["A", "Previous Article"],
                        ["Enter", "Open Selected Article"],
                        ["I", "Import Selected Article"],
                        ["H", "Hide/Unhide Selected Article"],
                        ["D", "Delete Selected Article"],
                        ["Ctrl/Cmd + H", "Toggle Show Hidden Articles"],
                        ["Ctrl/Cmd + F", "Focus Article Search"],
                      ].map(([key, action]) => (
                        <tr key={key} className="border-b last:border-0">
                          <td className="px-3 py-2">
                            <kbd className="rounded border bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium">
                              {key}
                            </kbd>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="kindle-shortcuts">
              <AccordionTrigger className="text-sm">
                Kindle Tab
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left font-medium px-3 py-2">Shortcut</th>
                        <th className="text-left font-medium px-3 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Ctrl/Cmd + Shift + S", "Refresh Kindle Books"],
                      ].map(([key, action]) => (
                        <tr key={key} className="border-b last:border-0">
                          <td className="px-3 py-2">
                            <kbd className="rounded border bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium">
                              {key}
                            </kbd>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="library-shortcuts">
              <AccordionTrigger className="text-sm">
                Library Tab
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left font-medium px-3 py-2">Shortcut</th>
                        <th className="text-left font-medium px-3 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Ctrl/Cmd + F", "Focus Search"],
                        ["Ctrl/Cmd + A", "Select All Sources"],
                        ["Ctrl/Cmd + Shift + D", "Deselect All"],
                        ["Escape", "Clear Selection / Search"],
                      ].map(([key, action]) => (
                        <tr key={key} className="border-b last:border-0">
                          <td className="px-3 py-2">
                            <kbd className="rounded border bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium">
                              {key}
                            </kbd>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="search-modal-shortcuts">
              <AccordionTrigger className="text-sm">
                Search Modal
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left font-medium px-3 py-2">Shortcut</th>
                        <th className="text-left font-medium px-3 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Arrow Down / Up", "Navigate Results"],
                        ["Enter", "Select Result"],
                        ["Escape", "Close"],
                      ].map(([key, action]) => (
                        <tr key={key} className="border-b last:border-0">
                          <td className="px-3 py-2">
                            <kbd className="rounded border bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium">
                              {key}
                            </kbd>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article-reader-shortcuts">
              <AccordionTrigger className="text-sm">
                Article Viewer
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left font-medium px-3 py-2">Shortcut</th>
                        <th className="text-left font-medium px-3 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["I", "Import Article"],
                        ["H", "Hide/Unhide Article"],
                        ["D", "Delete Article"],
                        ["Space", "Play/Pause Video"],
                        ["Arrow Left", "Previous Article"],
                        ["Arrow Right", "Next Article"],
                        ["Arrow Up", "Scroll Up"],
                        ["Arrow Down", "Scroll Down"],
                        ["Escape", "Close"],
                      ].map(([key, action]) => (
                        <tr key={key} className="border-b last:border-0">
                          <td className="px-3 py-2">
                            <kbd className="rounded border bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium">
                              {key}
                            </kbd>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="highlighter-shortcuts">
              <AccordionTrigger className="text-sm">
                Article Highlighter
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left font-medium px-3 py-2">Shortcut</th>
                        <th className="text-left font-medium px-3 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Ctrl/Cmd + F", "Focus Search"],
                        ["Space", "Play/Pause Video"],
                        ["Arrow Left", "Previous Source"],
                        ["Arrow Right", "Next Source"],
                        ["Arrow Up", "Scroll Up"],
                        ["Arrow Down", "Scroll Down"],
                        ["Enter", "Next Search Result"],
                        ["Shift + Enter", "Previous Search Result"],
                        ["Escape", "Close"],
                      ].map(([key, action]) => (
                        <tr key={key} className="border-b last:border-0">
                          <td className="px-3 py-2">
                            <kbd className="rounded border bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium">
                              {key}
                            </kbd>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 mt-2">
            <p className="text-xs font-medium mb-1">Customising Shortcuts</p>
            <p className="text-xs text-muted-foreground">
              Open <strong>Settings &rarr; Keyboard Shortcuts</strong> to remap
              any shortcut. Click on a shortcut, press your desired key
              combination, and save. Your custom bindings are persisted across
              sessions and apply instantly — no restart required.
            </p>
          </div>
        </FeatureSection>

        {/* Custom Colors */}
        <FeatureSection
          id="colors"
          icon={Palette}
          title="Custom Highlight Colors"
        >
          <p>
            Override the default color hex values in Settings &rarr; Quote Colors.
            Three color modes available: none, background (gradient), text.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
            {[
              { name: "Yellow", hex: "#ffd700" },
              { name: "Blue", hex: "#4682b4" },
              { name: "Pink", hex: "#ff69b4" },
              { name: "Orange", hex: "#ffa500" },
              { name: "Red", hex: "#ff4d4f" },
              { name: "Green", hex: "#52c41a" },
              { name: "Olive", hex: "#b5b35c" },
              { name: "Cyan", hex: "#13c2c2" },
              { name: "Purple", hex: "#a259d9" },
              { name: "Gray", hex: "#888888" },
            ].map((color) => (
              <div
                key={color.name}
                className="flex items-center gap-2 rounded border p-2 bg-card"
              >
                <div
                  className="h-4 w-4 rounded-sm border shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <p className="text-[10px] font-medium">{color.name}</p>
                  <p className="text-[9px] text-muted-foreground font-mono">
                    {color.hex}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FeatureSection>

        {/* Templates */}
        <FeatureSection id="templates" icon={FileText} title="Custom Templates">
          <p>
            Customize how your exports look with template variables in Settings
            &rarr; Template Settings.
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="source-vars">
              <AccordionTrigger className="text-sm">
                Source template variables
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <ul className="list-disc list-inside text-xs space-y-0.5">
                  <li><CodeInline>{`{{title}}`}</CodeInline> &mdash; Book title</li>
                  <li><CodeInline>{`{{subtitle}}`}</CodeInline> &mdash; Book subtitle</li>
                  <li><CodeInline>{`{{author}}`}</CodeInline> &mdash; Author name</li>
                  <li><CodeInline>{`{{type}}`}</CodeInline> &mdash; Source type (Book, Article)</li>
                  <li><CodeInline>{`{{origin}}`}</CodeInline> &mdash; Import source (Kindle, KOReader)</li>
                  <li><CodeInline>{`{{asin}}`}</CodeInline> &mdash; Amazon ASIN</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="quote-vars">
              <AccordionTrigger className="text-sm">
                Quote template variables
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <ul className="list-disc list-inside text-xs space-y-0.5">
                  <li><CodeInline>{`{{content}}`}</CodeInline> &mdash; The highlighted text</li>
                  <li><CodeInline>{`{{note}}`}</CodeInline> &mdash; Personal annotation</li>
                  <li><CodeInline>{`{{location}}`}</CodeInline> &mdash; Page number or location</li>
                  <li><CodeInline>{`{{color}}`}</CodeInline> &mdash; Highlight color name</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="daily-vars">
              <AccordionTrigger className="text-sm">
                Daily reflection variables
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <p className="mb-1">All quote variables above, plus:</p>
                <ul className="list-disc list-inside text-xs space-y-0.5">
                  <li><CodeInline>{`{{bookTitle}}`}</CodeInline> &mdash; Source book title</li>
                  <li><CodeInline>{`{{author}}`}</CodeInline> &mdash; Source author</li>
                  <li><CodeInline>{`{{fileName}}`}</CodeInline> &mdash; Generated filename for Obsidian link</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </FeatureSection>
      </div>
    </div>
  );
}
