import Fuse, { FuseResult, IFuseOptions } from "fuse.js";

export interface SearchItem {
  id: string;
  title: string;
  section: string;
  category: "Install" | "Features" | "Settings" | "Troubleshoot" | "Advanced" | "Mobile";
  content: string;
  href: string;
  keywords: string[];
}

export const searchIndex: SearchItem[] = [
  // Installation
  {
    id: "install-requirements",
    title: "System Requirements",
    section: "Installation",
    category: "Install",
    content:
      "Windows 10+, macOS 12+, Ubuntu 20.04+, Fedora 36+. Minimum 4 GB RAM, 200 MB disk space. Network required for Kindle sync and for Craft Docs export.",
    href: "/local-docs/install#requirements",
    keywords: ["requirements", "windows", "mac", "linux", "ram", "disk"],
  },
  {
    id: "install-download",
    title: "Download & Install",
    section: "Installation",
    category: "Install",
    content:
      "Download the latest release for your platform. Windows .exe installer, macOS .zip, Linux .deb and .rpm packages available.",
    href: "/local-docs/install#download",
    keywords: ["download", "installer", "exe", "dmg", "deb", "rpm"],
  },
  {
    id: "install-windows",
    title: "Windows Installation",
    section: "Installation",
    category: "Install",
    content:
      "Download the .exe installer. Run the installer, click More info then Run anyway on SmartScreen. App installs to %LOCALAPPDATA%\\Unearthed. Desktop shortcut created automatically.",
    href: "/local-docs/install#windows",
    keywords: ["windows", "exe", "smartscreen", "installer", "setup"],
  },
  {
    id: "install-macos",
    title: "macOS Installation",
    section: "Installation",
    category: "Install",
    content:
      "Download the .zip file. Extract and drag Unearthed.app to Applications. Right-click Open on first launch to bypass Gatekeeper. Grant file access permissions when prompted.",
    href: "/local-docs/install#macos",
    keywords: ["macos", "mac", "gatekeeper", "permissions", "applications"],
  },
  {
    id: "install-linux",
    title: "Linux Installation",
    section: "Installation",
    category: "Install",
    content:
      "Debian/Ubuntu: sudo dpkg -i unearthed.deb. Fedora/RHEL: sudo rpm -i unearthed.rpm. Install dependencies with apt-get install -f if needed.",
    href: "/local-docs/install#linux",
    keywords: ["linux", "ubuntu", "debian", "fedora", "dpkg", "rpm"],
  },
  {
    id: "install-first-launch",
    title: "First Launch Setup",
    section: "Installation",
    category: "Install",
    content:
      "Configure your export destination in Settings: Obsidian vault path (Browse to your vault folder) and/or Craft Docs (paste Connection URL + API Key from Craft → Imagine → API Connection, then Test Connection). Connect Kindle by clicking Establish Connection. Fetch highlights with Refresh Kindle Books. Exports go to vault/Unearthed/Books/ as Markdown and/or to Craft collection rows.",
    href: "/local-docs/install#first-launch",
    keywords: [
      "setup",
      "configure",
      "vault",
      "first",
      "launch",
      "obsidian",
      "craft",
      "connection",
    ],
  },
  // Features
  {
    id: "feature-kindle-sync",
    title: "Kindle Highlight Sync",
    section: "Features",
    category: "Features",
    content:
      "Connect to Amazon Kindle through built-in browser. Fetches books and annotations from two Kindle endpoints in parallel. Merges and deduplicates results. Stores in local SQLite database. Auto-sync every hour when enabled.",
    href: "/local-docs/features#kindle-sync",
    keywords: [
      "kindle",
      "sync",
      "amazon",
      "highlights",
      "annotations",
      "auto-sync",
    ],
  },
  {
    id: "feature-koreader",
    title: "KOReader Integration",
    section: "Features",
    category: "Features",
    content:
      "Local HTTP API server on port 6543. KOReader sends highlights via REST API with Bearer token authentication. Configure with local IP address and secret token.",
    href: "/local-docs/features#koreader",
    keywords: [
      "koreader",
      "api",
      "port",
      "6543",
      "bearer",
      "token",
      "e-reader",
    ],
  },
  {
    id: "feature-obsidian-export",
    title: "Export to Obsidian",
    section: "Features",
    category: "Features",
    content:
      "Export highlights as Markdown files into Obsidian vault. YAML front-matter with metadata. Customisable templates for filenames, quotes, and sources. Color-coded highlights. Zero-width space markers for duplicate detection.",
    href: "/local-docs/features#obsidian-export",
    keywords: [
      "obsidian",
      "export",
      "markdown",
      "yaml",
      "template",
      "vault",
    ],
  },
  {
    id: "feature-craft-export",
    title: "Export to Craft Docs",
    section: "Features",
    category: "Features",
    content:
      "Sync highlights to Craft Docs alongside Obsidian. Each source type (Books, Articles, Videos) becomes a Craft collection in your root folder; each source is a row whose page contains the highlights and optionally the full article body. Resumable sync — re-runs only insert new quotes (per-quote Craft block IDs are persisted). Throttled to 2 requests/second with exponential backoff retry on rate limits. Cancel button stops a long-running export mid-way without losing already-synced quotes. Per-type collections (Books, Articles, etc.) plus an Authors collection populated first so the relation column is available.",
    href: "/local-docs/features#craft-export",
    keywords: [
      "craft",
      "craft docs",
      "export",
      "collection",
      "collections",
      "sync",
      "resumable",
      "incremental",
      "authors",
      "books",
      "articles",
      "videos",
    ],
  },
  {
    id: "feature-craft-setup",
    title: "Craft Docs Connection Setup",
    section: "Features",
    category: "Features",
    content:
      "Set up Craft Docs export by creating an API Connection in Craft → Imagine → API Connection with Permission Level 'Read and Write' and Access Mode 'API Key'. Generate an API Key (Craft displays it once), then paste the Connection URL and API Key into Settings → Craft Docs. Click Test Connection to verify — successful tests show the connected space name. The API key is encrypted at rest with Electron safeStorage. Use Replace to swap the saved token, Clear to remove it.",
    href: "/local-docs/features#craft-export",
    keywords: [
      "craft",
      "setup",
      "connection url",
      "api key",
      "bearer",
      "token",
      "test connection",
      "imagine",
      "permission",
      "safestorage",
      "encrypted",
    ],
  },
  {
    id: "feature-craft-collections",
    title: "Craft Collection-Based Export",
    section: "Features",
    category: "Features",
    content:
      "Craft sources are grouped by type into a Craft collection document. Each row has Type, Quotes, Notes, and (for Books) an Author relation column linking back to the Authors collection. Tap any row to open its page — highlights live there as text blocks. With Combine Sources on (default), one collection per type; off creates separate collections for finer organisation.",
    href: "/local-docs/features#craft-export",
    keywords: [
      "craft",
      "collection",
      "row",
      "type",
      "author",
      "relation",
      "combine sources",
      "books",
      "articles",
    ],
  },
  {
    id: "feature-craft-article-content",
    title: "Craft Article Content & YouTube Embeds",
    section: "Features",
    category: "Features",
    content:
      "When Include Full Article Content is enabled, RSS / web article bodies are prepended to the Craft page on first sync, followed by a Highlights heading. YouTube article URLs are inserted as a richUrl block above the article text. Long article text is split into ~6000-char text blocks to stay within Craft's per-block limit. Inserted only on first sync — re-syncing the same source will not duplicate the content.",
    href: "/local-docs/features#craft-export",
    keywords: [
      "craft",
      "article content",
      "youtube",
      "richurl",
      "embed",
      "first sync",
      "include article",
    ],
  },
  {
    id: "feature-craft-colors",
    title: "Craft Quote Color Mapping",
    section: "Features",
    category: "Features",
    content:
      "When Craft Quote Color Mode is set to highlight, each Unearthed color maps to the nearest Craft palette color: yellow→yellow, blue→blue, pink→pink, orange→yellow, red→red, green→green, olive→green, cyan→cyan, purple→purple, gray/grey→gray. Set color mode to none to skip color styling in Craft entirely.",
    href: "/local-docs/features#craft-export",
    keywords: [
      "craft",
      "color",
      "highlight",
      "palette",
      "mapping",
      "yellow",
      "blue",
      "pink",
      "orange",
      "olive",
    ],
  },
  {
    id: "feature-craft-template-translation",
    title: "Craft Template & Markdown Translation",
    section: "Features",
    category: "Features",
    content:
      "Craft uses the same Quote, Source, and Daily Reflection templates as Obsidian (or the built-in defaults). Wikilinks [[Page]] / [[Page|Display]] are flattened to plain text. YAML frontmatter is converted to a Craft <callout> block. Zero-width-space dedup markers are stripped (Obsidian-only artifact). <script> tags are stripped as defense-in-depth.",
    href: "/local-docs/features#craft-export",
    keywords: [
      "craft",
      "template",
      "wikilink",
      "frontmatter",
      "callout",
      "translate",
      "markdown",
    ],
  },
  {
    id: "feature-craft-daily-reflection",
    title: "Craft Daily Reflection",
    section: "Features",
    category: "Features",
    content:
      "Append today's random highlight to your Craft daily note alongside Obsidian (if configured) — both targets receive the same quote independently. Auto-appends as soon as Unearthed opens — no need to press 'New Reflection'. Per-destination success is recorded in the database, so the reflection is appended at most once per day across restarts. Compact pills ('Appended to Obsidian', 'Appended to Craft') confirm which destinations received the quote.",
    href: "/local-docs/features#craft-export",
    keywords: [
      "craft",
      "daily reflection",
      "daily note",
      "auto append",
      "reflection",
      "morning",
    ],
  },
  {
    id: "feature-craft-auto-export",
    title: "Craft Hourly Auto-Export",
    section: "Features",
    category: "Features",
    content:
      "Toggle Auto-export to Craft in Settings → Craft Docs to sync new highlights every hour. Runs in the background alongside the Obsidian auto-export and is toggled independently. Requires Keep App Running to continue syncing while the window is closed.",
    href: "/local-docs/features#craft-export",
    keywords: [
      "craft",
      "auto export",
      "hourly",
      "background",
      "auto sync",
    ],
  },
  {
    id: "feature-craft-recovery",
    title: "Craft Stale Document & Block Recovery",
    section: "Features",
    category: "Features",
    content:
      "If a Craft document is permanently deleted, the next export recreates it and re-uploads all quotes in a single pass. Individual deleted blocks are detected and re-synced automatically. For a full reset, use Settings → Craft Docs → Reset Craft Sync Data — clears Unearthed's ID mapping but does NOT delete anything in Craft. If you deleted a Craft document and want it recreated cleanly, empty Craft's Trash first so Unearthed can reuse the same name.",
    href: "/local-docs/features#craft-export",
    keywords: [
      "craft",
      "recovery",
      "reset",
      "stale",
      "deleted",
      "recreate",
      "trash",
      "sync data",
    ],
  },
  {
    id: "feature-csv-export",
    title: "CSV Export",
    section: "Features",
    category: "Features",
    content:
      "Export entire library as CSV files. One file per book with columns: Quote, Note, Location, Color, CreatedAt. Auto-incrementing folder names to avoid overwrites.",
    href: "/local-docs/features#csv-export",
    keywords: ["csv", "export", "spreadsheet", "columns"],
  },
  {
    id: "feature-rss-feeds",
    title: "RSS Feed Reader",
    section: "Features",
    category: "Features",
    content:
      "Subscribe to RSS feeds, browse articles newest-first with filtering by feed, import status, and search. Import articles into local database as sources. Both RSS 2.0 and Atom formats supported. Auto-refresh on app startup.",
    href: "/local-docs/features#rss-feeds",
    keywords: [
      "rss",
      "feed",
      "subscribe",
      "articles",
      "atom",
      "import",
      "reader",
    ],
  },
  {
    id: "feature-article-highlighting",
    title: "Article Highlighting & Notes",
    section: "Features",
    category: "Features",
    content:
      "Imported RSS articles can be highlighted with four colors (yellow, blue, pink, orange) and annotated with notes. Highlights are stored in the database and exported to Obsidian like book quotes.",
    href: "/local-docs/features#article-reader",
    keywords: [
      "highlight",
      "article",
      "notes",
      "annotate",
      "color",
      "yellow",
      "blue",
      "pink",
      "orange",
    ],
  },
  {
    id: "feature-youtube-embeds",
    title: "YouTube Embed Support",
    section: "Features",
    category: "Features",
    content:
      "RSS articles containing YouTube links display embedded video players. Video transcripts are fetched and injected into article content. Retries on rate limiting with exponential backoff.",
    href: "/local-docs/features#youtube",
    keywords: [
      "youtube",
      "video",
      "embed",
      "transcript",
      "player",
    ],
  },
  {
    id: "feature-daily-reflection",
    title: "Daily Reflection",
    section: "Features",
    category: "Features",
    content:
      "Random quote displayed on dashboard. Optionally append to Obsidian daily note. Full moment.js-compatible date format tokens. Append Under Heading to insert under a specific markdown heading. Auto-create daily note if not exists.",
    href: "/local-docs/features#daily-reflection",
    keywords: [
      "daily",
      "reflection",
      "quote",
      "random",
      "obsidian",
      "note",
      "heading",
      "moment",
      "date format",
    ],
  },
  {
    id: "feature-global-search",
    title: "Global Search",
    section: "Features",
    category: "Features",
    content:
      "Full-text search across all books, quotes, and notes with Ctrl+K or Cmd+K. Results grouped by source with match type indicators. Keyboard navigation with arrow keys and Enter.",
    href: "/local-docs/features#global-search",
    keywords: ["search", "ctrl+k", "find", "query", "keyboard"],
  },
  {
    id: "feature-library",
    title: "Library Management",
    section: "Features",
    category: "Features",
    content:
      "View, search, filter, and manage all sources. Filter by All, Active, or Ignored. Toggle ignored status. Batch select and delete. View quotes per source with color-coded accent bars.",
    href: "/local-docs/features#library",
    keywords: [
      "library",
      "manage",
      "filter",
      "ignore",
      "batch",
      "delete",
      "sources",
    ],
  },
  {
    id: "feature-dark-mode",
    title: "Dark / Light Mode",
    section: "Features",
    category: "Features",
    content:
      "Toggle between dark and light themes. Preference persisted across sessions. Uses Tailwind dark: prefix for all styling.",
    href: "/local-docs/features#dark-mode",
    keywords: ["dark", "light", "theme", "mode", "toggle"],
  },
  {
    id: "feature-tray",
    title: "System Tray & Startup",
    section: "Features",
    category: "Features",
    content:
      "Keep App Running minimizes Unearthed to the system tray instead of quitting, so it stays ready to accept global shortcuts even when all windows are closed. Run on Startup launches the app automatically at OS login. Combined with the Quick Import shortcut (Ctrl/Cmd+Shift+I) you can save content to Unearthed at any moment without ever opening the main window. Platform-specific: Windows taskbar tray, macOS menu bar, Linux .desktop autostart file.",
    href: "/local-docs/features#tray",
    keywords: [
      "tray",
      "startup",
      "minimize",
      "background",
      "autostart",
      "login",
      "menu bar",
      "quick import",
    ],
  },

  // Settings
  {
    id: "settings-general",
    title: "General Settings",
    section: "Settings",
    category: "Settings",
    content:
      "Keep App Running in Background minimizes to system tray. Private Mode masks sensitive paths for screen sharing. Run on System Startup launches at login.",
    href: "/local-docs/settings#general",
    keywords: [
      "general",
      "background",
      "tray",
      "private",
      "startup",
      "login",
    ],
  },
  {
    id: "settings-api",
    title: "API Endpoint",
    section: "Settings",
    category: "Settings",
    content:
      "Two local servers for device connections. KOReader and iOS use port 6543 (HTTPS) with a self-signed certificate. Android uses port 6545 (HTTP) — no certificate required. Auto-detected IP address with copy buttons. Secret token for authentication.",
    href: "/local-docs/settings#api",
    keywords: [
      "api",
      "koreader",
      "endpoint",
      "token",
      "port",
      "6543",
      "6545",
      "android",
      "ios",
      "https",
      "http",
      "url",
      "connection details",
    ],
  },
  {
    id: "settings-obsidian",
    title: "Obsidian Settings",
    section: "Settings",
    category: "Settings",
    content:
      "Configure Obsidian vault location with Browse button. Root Folder name (default: Unearthed) for organizing books and articles inside vault.",
    href: "/local-docs/settings#obsidian",
    keywords: [
      "obsidian",
      "vault",
      "location",
      "browse",
      "root",
      "folder",
    ],
  },
  {
    id: "settings-craft",
    title: "Craft Docs Settings",
    section: "Settings",
    category: "Settings",
    content:
      "Configure the Craft Docs export integration. Connection URL (https://connect.craft.do/links/XXXXX/api/v1) and API Token (encrypted via Electron safeStorage) from Craft → Settings → Connect to API. Test Connection verifies and shows the connected space name. Root Folder (default 'Unearthed') is the top-level folder in your Craft space.",
    href: "/local-docs/settings#craft",
    keywords: [
      "craft",
      "craft docs",
      "connection url",
      "api token",
      "api key",
      "bearer",
      "test connection",
      "root folder",
      "encrypted",
      "safestorage",
    ],
  },
  {
    id: "settings-craft-combine-sources",
    title: "Craft Combine Sources",
    section: "Settings",
    category: "Settings",
    content:
      "When 'Combine Sources' is enabled (default), all sources of the same type share a single collection (Books, Articles, etc.). When disabled, separate collections are created per type for finer-grained organisation. Recommended on for most users — keeps your Craft folder tidy.",
    href: "/local-docs/settings#craft",
    keywords: [
      "craft",
      "combine sources",
      "collection",
      "books",
      "articles",
      "videos",
      "organisation",
    ],
  },
  {
    id: "settings-craft-include-article-content",
    title: "Craft — Include Full Article Content",
    section: "Settings",
    category: "Settings",
    content:
      "When enabled, the full article body is prepended to the Craft document on first sync, followed by a Highlights heading. Only applies to articles (RSS / Web Page imports), not Kindle books. YouTube article URLs are inserted as a richUrl block above the article text. Long article text is split into ~6000-char text blocks. Inserted only on first sync — re-syncing the same source will not duplicate the content.",
    href: "/local-docs/settings#craft",
    keywords: [
      "craft",
      "article content",
      "include",
      "full text",
      "first sync",
      "rss",
      "web page",
    ],
  },
  {
    id: "settings-craft-daily-reflection",
    title: "Craft — Append Daily Reflection",
    section: "Settings",
    category: "Settings",
    content:
      "Enable 'Append daily reflection to Craft daily note' to send today's random highlight to your Craft daily note alongside Obsidian. Auto-appends as soon as Unearthed opens. Recorded in the database so the reflection is appended at most once per day, even after restarts. A compact 'Appended to Craft' pill confirms success.",
    href: "/local-docs/settings#craft",
    keywords: [
      "craft",
      "daily reflection",
      "daily note",
      "append",
      "auto append",
      "morning",
    ],
  },
  {
    id: "settings-craft-auto-export",
    title: "Craft — Auto-Export Hourly",
    section: "Settings",
    category: "Settings",
    content:
      "Toggle 'Auto-export to Craft (hourly)' to sync new highlights to Craft every hour, alongside Obsidian. Toggled independently from Obsidian auto-export. Requires Keep App Running to continue syncing in the background. Only new or changed quotes are sent on each run (resumable sync).",
    href: "/local-docs/settings#craft",
    keywords: [
      "craft",
      "auto export",
      "hourly",
      "background",
      "auto sync",
      "keep running",
    ],
  },
  {
    id: "settings-craft-color-mode",
    title: "Craft — Quote Color Mode",
    section: "Settings",
    category: "Settings",
    content:
      "Craft Quote Color Mode controls how highlight colors are rendered inside Craft. 'highlight' (default) maps each Unearthed color to the nearest Craft palette color (yellow, blue, pink, red, green, cyan, purple, gray). 'none' applies no color styling. Orange and olive map to yellow and green respectively (Craft has no exact equivalents).",
    href: "/local-docs/settings#craft",
    keywords: [
      "craft",
      "color",
      "color mode",
      "highlight",
      "palette",
      "none",
    ],
  },
  {
    id: "settings-craft-reset-sync",
    title: "Craft — Reset Sync Data",
    section: "Settings",
    category: "Settings",
    content:
      "Reset Craft Sync Data clears Unearthed's internal mapping of which Craft documents and blocks it previously created. Forces a clean re-export on the next run. Does NOT delete anything in Craft itself. Use this if documents ended up in the wrong location, or if you deleted individual quotes in Craft and want them re-synced. If you deleted a document in Craft, empty it from Craft's Trash first so Unearthed can recreate it.",
    href: "/local-docs/settings#craft",
    keywords: [
      "craft",
      "reset",
      "sync data",
      "clear",
      "recreate",
      "trash",
      "stale",
    ],
  },
  {
    id: "settings-daily-reflection",
    title: "Daily Reflection Settings",
    section: "Settings",
    category: "Settings",
    content:
      "Daily note date format with full moment.js token support (YYYY, MMMM, dddd, etc.). Slashes create subfolders. Append Under Heading to insert under a specific markdown heading. Daily reflection folder path. Create Daily Note if missing. Add Reflection on Startup.",
    href: "/local-docs/settings#daily-reflection",
    keywords: [
      "daily",
      "reflection",
      "date",
      "format",
      "startup",
      "note",
      "heading",
      "moment",
      "token",
    ],
  },
  {
    id: "settings-macos-dock",
    title: "macOS Show in Dock",
    section: "Settings",
    category: "Settings",
    content:
      "macOS only. When disabled, the app runs solely from the menu bar without a Dock icon. Automatically enables Keep App Running in Background.",
    href: "/local-docs/settings#macos-dock",
    keywords: [
      "macos",
      "dock",
      "menu bar",
      "tray",
      "hide",
    ],
  },
  {
    id: "settings-kindle",
    title: "Kindle Settings",
    section: "Settings",
    category: "Settings",
    content:
      "Kindle URL (default: read.amazon.com), change to regional domain if needed. Auto Sync toggle to fetch new highlights every hour in background.",
    href: "/local-docs/settings#kindle",
    keywords: [
      "kindle",
      "url",
      "amazon",
      "auto",
      "sync",
      "region",
    ],
  },
  {
    id: "settings-filename",
    title: "File Name Settings",
    section: "Settings",
    category: "Settings",
    content:
      "Source filename template with variables (title, author, type). Replace spaces in filenames. Lowercase option. Include ignored books in CSV export.",
    href: "/local-docs/settings#filename",
    keywords: [
      "filename",
      "template",
      "spaces",
      "lowercase",
      "csv",
      "ignored",
    ],
  },
  {
    id: "settings-templates",
    title: "Template Settings",
    section: "Settings",
    category: "Settings",
    content:
      "Customise exported Markdown format. Source template for YAML front-matter. Quote template for highlights. Daily reflection template with bookTitle, author, fileName variables.",
    href: "/local-docs/settings#templates",
    keywords: [
      "template",
      "source",
      "quote",
      "yaml",
      "markdown",
      "format",
      "export",
    ],
  },
  {
    id: "settings-colors",
    title: "Quote Color Settings",
    section: "Settings",
    category: "Settings",
    content:
      "Quote color mode: none, background gradient, or text color. Custom hex values for all 10 highlight colors (yellow, blue, pink, orange, red, green, olive, cyan, purple, gray).",
    href: "/local-docs/settings#colors",
    keywords: [
      "color",
      "quote",
      "hex",
      "background",
      "highlight",
      "mode",
    ],
  },
  {
    id: "settings-clean-values",
    title: "Values to Clean",
    section: "Settings",
    category: "Settings",
    content:
      "Select metadata fields to clean special characters from during export. Book fields: title, subtitle, author, type, origin, ASIN. Quote fields: content, note, location, color.",
    href: "/local-docs/settings#clean-values",
    keywords: [
      "clean",
      "sanitize",
      "special",
      "characters",
      "filename",
      "export",
    ],
  },
  {
    id: "settings-database",
    title: "Database Utilities",
    section: "Settings",
    category: "Settings",
    content:
      "Show database file path for manual backups. Delete Database to permanently remove all local data and reinitialize. Reset All Settings restores defaults without affecting database.",
    href: "/local-docs/settings#database",
    keywords: [
      "database",
      "delete",
      "reset",
      "backup",
      "path",
      "utilities",
    ],
  },

  // Troubleshooting
  {
    id: "troubleshoot-kindle",
    title: "Kindle Connection Issues",
    section: "Troubleshooting",
    category: "Troubleshoot",
    content:
      "Not Connected status: complete Amazon login, click Check Status, re-open browser. No books: verify highlights exist on read.amazon.com. Rate limited: wait a few minutes.",
    href: "/local-docs/troubleshoot#kindle",
    keywords: [
      "kindle",
      "connection",
      "not connected",
      "login",
      "amazon",
      "rate limit",
    ],
  },
  {
    id: "troubleshoot-obsidian",
    title: "Obsidian Export Issues",
    section: "Troubleshooting",
    category: "Troubleshoot",
    content:
      "Vault not configured: open Settings Obsidian Browse. Permission denied on macOS: re-select vault folder. Duplicates: zero-width markers detect existing quotes.",
    href: "/local-docs/troubleshoot#obsidian",
    keywords: [
      "obsidian",
      "export",
      "permission",
      "vault",
      "duplicate",
      "denied",
    ],
  },
  {
    id: "troubleshoot-craft",
    title: "Craft Docs Export Issues",
    section: "Troubleshooting",
    category: "Troubleshoot",
    content:
      "Connection URL or API token rejected: verify URL format https://connect.craft.do/links/XXXXX/api/v1, generate a new API key (Craft only displays it once), confirm Permission Level is 'Read and Write', click Test Connection. Documents in wrong folder or deleted: Settings → Craft Docs → Reset Craft Sync Data (does NOT delete in Craft). If you deleted a Craft document, empty Craft's Trash first. Quotes deleted in Craft: detected on next export and re-synced automatically. Slow export or rate limits: Craft API allows ~2 req/sec, throttled with exponential backoff retry on HTTP 429. Article content missing: enable Include Full Article Content (only inserted on first sync — use Reset Craft Sync Data to re-import). Wrong colors: orange→yellow, olive→green; set Color Mode to 'none' for plain quotes.",
    href: "/local-docs/troubleshoot#craft",
    keywords: [
      "craft",
      "craft docs",
      "connection",
      "rejected",
      "401",
      "rate limit",
      "429",
      "reset",
      "deleted",
      "color",
      "article content",
      "trash",
    ],
  },
  {
    id: "troubleshoot-koreader-api",
    title: "KOReader API Issues",
    section: "Troubleshooting",
    category: "Troubleshoot",
    content:
      "Can't connect: same network required, check IP in Settings, port 6543 not blocked by firewall. 401 Unauthorized: verify Bearer token matches in both app and KOReader plugin.",
    href: "/local-docs/troubleshoot#koreader-api",
    keywords: [
      "koreader",
      "api",
      "connect",
      "firewall",
      "401",
      "unauthorized",
      "token",
    ],
  },
  {
    id: "troubleshoot-rss",
    title: "RSS Feed Issues",
    section: "Troubleshooting",
    category: "Troubleshoot",
    content:
      "Feed subscription fails: verify URL is a valid RSS or Atom feed. Articles reappear after deletion: use Hide instead. Images not loading: requires internet. YouTube embed not playing: retries on rate limiting.",
    href: "/local-docs/troubleshoot#rss-feeds",
    keywords: [
      "rss",
      "feed",
      "subscribe",
      "articles",
      "youtube",
      "images",
      "hide",
      "delete",
    ],
  },
  {
    id: "troubleshoot-database",
    title: "Database Issues",
    section: "Troubleshooting",
    category: "Troubleshoot",
    content:
      "Initialization error: check disk space, verify app data directory writable. Locked/busy: close other instances, app retries 3 times. Corrupted: delete database in Settings to reinitialize.",
    href: "/local-docs/troubleshoot#database",
    keywords: [
      "database",
      "error",
      "locked",
      "corrupt",
      "initialize",
      "disk",
      "space",
    ],
  },
  {
    id: "troubleshoot-platform",
    title: "Platform-Specific Issues",
    section: "Troubleshooting",
    category: "Troubleshoot",
    content:
      "Windows: SmartScreen blocking, UAC elevation, path length 260 char limit. macOS: Gatekeeper bypass, vault permissions revoked after updates. Linux: libsqlite3 required, .desktop autostart permissions.",
    href: "/local-docs/troubleshoot#platform",
    keywords: [
      "windows",
      "macos",
      "linux",
      "smartscreen",
      "gatekeeper",
      "uac",
      "permissions",
    ],
  },
  {
    id: "troubleshoot-reset",
    title: "Reset & Recovery",
    section: "Troubleshooting",
    category: "Troubleshoot",
    content:
      "Delete Database in Settings to completely reset Unearthed. Deletes local SQLite database and reinitializes fresh. Requires re-sync from Kindle/KOReader. Obsidian files, Craft documents, and source data not affected.",
    href: "/local-docs/troubleshoot#reset",
    keywords: [
      "reset",
      "recovery",
      "delete",
      "database",
      "fresh",
      "reinitialize",
    ],
  },

  // Advanced
  {
    id: "advanced-templates",
    title: "Custom Templates",
    section: "Advanced Usage",
    category: "Advanced",
    content:
      "Source template with YAML front-matter variables: title, subtitle, author, type, origin, asin. Quote template variables: content, note, location, color. Daily reflection template with bookTitle, author, fileName.",
    href: "/local-docs/features#templates",
    keywords: ["template", "yaml", "custom", "variables", "format"],
  },
  {
    id: "advanced-colors",
    title: "Custom Highlight Colors",
    section: "Advanced Usage",
    category: "Advanced",
    content:
      "10 highlight colors: yellow #ffd700, blue #4682b4, pink #ff69b4, orange #ffa500, red #ff4d4f, green #52c41a, olive #b5b35c, cyan #13c2c2, purple #a259d9, gray #888888. Three modes: none, background, text.",
    href: "/local-docs/features#colors",
    keywords: ["color", "highlight", "hex", "yellow", "blue", "custom"],
  },
  {
    id: "advanced-keyboard",
    title: "Keyboard Shortcuts",
    section: "Advanced Usage",
    category: "Advanced",
    content:
      "55+ fully customisable keyboard shortcuts across 8 contexts. System-wide (any app): Ctrl/Cmd+Shift+I Quick Import, Ctrl/Cmd+Shift+O Go to RSS Feeds. In-app global: Ctrl/Cmd+K search, Ctrl/Cmd+1-4 tabs, Ctrl/Cmd+D dark mode, Ctrl/Cmd+/ help, Ctrl/Cmd+R Read It Later. Home tab: Z new reflection, C copy, D/A navigate, Space open, E import, Q hide, X delete, R read later. RSS tab: D/A navigate, Space open, E import, Q hide, X delete, R read later, Ctrl/Cmd+L read-later filter. Kindle: Ctrl/Cmd+Shift+S sync. Library: Ctrl/Cmd+A select all. Article Reader: E import, Q hide, X delete, R read later, W/S scroll, A/D prev/next, Space play video. Article Highlighter: Ctrl/Cmd+F search, W/S scroll, A/D prev/next, Space play video. All shortcuts remappable in Settings → Keyboard Shortcuts.",
    href: "/local-docs/features#keyboard",
    keywords: ["keyboard", "shortcut", "ctrl", "cmd", "hotkey", "customise", "remap", "keybinding", "quick import", "read later"],
  },
  {
    id: "settings-keyboard-shortcuts",
    title: "Custom Keyboard Shortcuts",
    section: "Settings",
    category: "Settings",
    content:
      "All keyboard shortcuts are fully customisable. Open Settings → Keyboard Shortcuts or press Ctrl/Cmd+/ to view and remap any shortcut. Supports Ctrl/Cmd, Shift, and Alt modifiers. Changes apply instantly without restart. Custom bindings persisted in settings.json.",
    href: "/local-docs/settings#keyboard-shortcuts",
    keywords: ["keyboard", "shortcut", "custom", "remap", "keybinding", "settings", "customise"],
  },

  // Features – missing entries
  {
    id: "feature-read-it-later",
    title: "Read It Later",
    section: "Features",
    category: "Features",
    content:
      "Bookmark any article to read later with a single key press or tap. Press R in the article list or inside the Article Reader to toggle the bookmark. A blue badge appears on bookmarked cards. Filter the RSS feed to show only bookmarked articles with the blue toggle or Ctrl/Cmd+L shortcut. Jump straight to your reading list from anywhere with the global Ctrl/Cmd+R shortcut. Hiding an article automatically clears its Read It Later bookmark. Syncs with the Unearthed Mobile app so bookmarks follow you between desktop and phone.",
    href: "/local-docs/features#read-it-later",
    keywords: ["read later", "bookmark", "save", "reading list", "ctrl+l", "ctrl+r", "blue", "filter"],
  },
  {
    id: "feature-web-page-import",
    title: "Web Page Import",
    section: "Features",
    category: "Features",
    content:
      "Import any article or blog post from the web directly into your library. Paste a URL in the RSS tab and Unearthed fetches the full text using the same Reader View technology as Firefox — stripping ads, sidebars, and clutter. The clean article is saved to your database, ready for highlighting and annotation. Works with the Quick Import shortcut too: press Ctrl/Cmd+Shift+I, paste a link, and the page is saved instantly even while the app is in the background.",
    href: "/local-docs/features#web-import",
    keywords: ["web", "page", "import", "url", "article", "readability", "reader view", "blog", "paste"],
  },
  {
    id: "feature-quick-import-shortcut",
    title: "Quick Import — System-wide Shortcut",
    section: "Features",
    category: "Features",
    content:
      "Save content to Unearthed from any app, without switching windows. Press Ctrl+Shift+I on Windows/Linux or Cmd+Shift+I on macOS to open a lightweight import dialog. Paste any URL — YouTube video, RSS feed, or web article — and Unearthed detects the type automatically and imports it. The dialog closes itself after a successful import, so you can stay in your flow. Shortcut can be customised in Settings → Keyboard Shortcuts. Enable global shortcuts in General Settings first.",
    href: "/local-docs/features#quick-import-shortcut",
    keywords: ["quick import", "global shortcut", "ctrl+shift+i", "cmd+shift+i", "background", "minimized", "url", "system shortcut"],
  },
  {
    id: "feature-global-rss-shortcut",
    title: "Go to RSS Feeds — System-wide Shortcut",
    section: "Features",
    category: "Features",
    content:
      "Jump straight to your RSS feed from any application. Press Ctrl+Shift+O on Windows/Linux or Cmd+Shift+O on macOS to instantly bring Unearthed to the front and land on the RSS Feeds tab, with your feed list automatically refreshed. Perfect for quickly scanning new articles without breaking your workflow. Shortcut can be customised in Settings → Keyboard Shortcuts. Enable global shortcuts in General Settings first.",
    href: "/local-docs/features#global-rss-shortcut",
    keywords: ["global shortcut", "rss", "ctrl+shift+o", "cmd+shift+o", "jump", "open", "feeds", "system shortcut"],
  },
  {
    id: "feature-get-full-article",
    title: "Get Full Article",
    section: "Features",
    category: "Features",
    content:
      "Many RSS feeds only publish a teaser or short summary. With Unearthed you can fetch the complete article text directly from the source website with one click. The full content is stored locally and available for offline reading, highlighting, and export to Obsidian — no need to leave the app or open a browser.",
    href: "/local-docs/features#get-full-article",
    keywords: ["full article", "fetch", "scrape", "truncated", "summary", "read more", "content"],
  },

  // Settings – missing entries
  {
    id: "settings-include-article-content",
    title: "Include Article Content in Obsidian Export",
    section: "Settings",
    category: "Settings",
    content:
      "When enabled, Unearthed includes the full article body alongside your quotes and notes when exporting to Obsidian. Disabled by default so exported files stay focused on your highlights. Turn it on in Settings → Obsidian if you want a complete record of the original text in your vault.",
    href: "/local-docs/settings#include-article-content",
    keywords: ["obsidian", "export", "article content", "full text", "include", "body"],
  },
  {
    id: "settings-rss-auto-delete",
    title: "Auto-Delete Old RSS Articles",
    section: "Settings",
    category: "Settings",
    content:
      "Keep your feed tidy by automatically removing unread articles after a set number of days. Only articles you have not imported are deleted — anything you have saved to your library is kept forever. Set the threshold (default 7 days) in Settings → RSS Articles, or set it to 0 to keep all articles indefinitely.",
    href: "/local-docs/settings#rss-auto-delete",
    keywords: ["auto delete", "clean up", "old articles", "days", "rss", "expiry", "retention"],
  },
  {
    id: "settings-global-shortcuts",
    title: "Enable System Global Shortcuts",
    section: "Settings",
    category: "Settings",
    content:
      "Turn on system-wide keyboard shortcuts so Unearthed responds even when the app is minimized or in the background. Enabling this unlocks Quick Import (Ctrl/Cmd+Shift+I) and Go to RSS Feeds (Ctrl/Cmd+Shift+O) from any application. Toggle in Settings → General. Individual shortcuts can be customised in Settings → Keyboard Shortcuts.",
    href: "/local-docs/settings#global-shortcuts",
    keywords: ["global shortcuts", "system shortcut", "background", "minimized", "enable", "general"],
  },

  // Advanced – missing entries
  {
    id: "advanced-global-shortcuts-reference",
    title: "Global System Shortcut Reference",
    section: "Advanced Usage",
    category: "Advanced",
    content:
      "System-wide shortcuts (work from any app): Ctrl+Shift+I / Cmd+Shift+I = Quick Import dialog; Ctrl+Shift+O / Cmd+Shift+O = Open RSS Feeds tab. In-app global shortcuts: Ctrl+K / Cmd+K = Search; Ctrl+1-4 / Cmd+1-4 = Switch tabs; Ctrl+D / Cmd+D = Toggle dark mode; Ctrl+/ / Cmd+/ = Keyboard Shortcuts reference; Ctrl+R / Cmd+R = Read It Later feed; Ctrl+, / Cmd+, = Settings. All shortcuts customisable in Settings → Keyboard Shortcuts.",
    href: "/local-docs/features#keyboard",
    keywords: ["global", "system shortcut", "quick import", "rss shortcut", "reference", "all shortcuts"],
  },

  // Troubleshooting – missing entries
  {
    id: "troubleshoot-global-shortcuts",
    title: "Global Shortcuts Not Working",
    section: "Troubleshooting",
    category: "Troubleshoot",
    content:
      "If Ctrl/Cmd+Shift+I or Ctrl/Cmd+Shift+O do nothing: make sure 'Enable System Global Shortcuts' is turned on in Settings → General. On macOS, grant Accessibility permissions when prompted (System Preferences → Privacy & Security → Accessibility). Conflicts with other apps using the same shortcut can prevent registration — reassign the shortcut in Settings → Keyboard Shortcuts.",
    href: "/local-docs/troubleshoot#global-shortcuts",
    keywords: ["global shortcut", "not working", "accessibility", "macos", "permissions", "conflict", "ctrl+shift+i"],
  },

  // Mobile App – all new
  {
    id: "mobile-overview",
    title: "Unearthed Mobile App",
    section: "Mobile App",
    category: "Mobile",
    content:
      "Unearthed is available as a native Android app (APK). Your entire reading life — RSS feeds, saved articles, Kindle highlights, KOReader notes, and personal quotes — is always with you. The mobile app works beautifully on its own, and when you are at your desk it stays perfectly in sync with Unearthed on your desktop over your home Wi-Fi. Everything you save, highlight, or bookmark on your phone appears on your computer, and vice versa.",
    href: "/local-docs/mobile#overview",
    keywords: ["mobile", "android", "app", "phone", "tablet"],
  },
  {
    id: "mobile-companion",
    title: "Mobile + Desktop",
    section: "Mobile App",
    category: "Mobile",
    content:
      "Unearthed Local (desktop) and Unearthed Mobile are designed to work hand-in-hand. Subscribe to a feed on your phone and it appears on your desktop. Import a Kindle book on your computer and your highlights are ready to browse on your phone during your commute. Read Later bookmarks, hidden articles, and imported sources all sync bidirectionally — you are always looking at the same library, regardless of which device you are on. Sync happens automatically over your local network, so your data never leaves your home.",
    href: "/local-docs/mobile#companion",
    keywords: ["sync", "desktop", "mobile", "together", "bidirectional", "local network", "wifi"],
  },
  {
    id: "mobile-sync-setup",
    title: "Setting Up Mobile Sync",
    section: "Mobile App",
    category: "Mobile",
    content:
      "To connect the mobile app to your desktop: open Unearthed on your desktop and go to Settings → API Endpoint — you will see your local IP address and sync token. In the mobile app, go to Settings and enter the IP address and token. iOS uses port 6543 (HTTPS); Android uses port 6545 (HTTP, no certificate required). Tap Test Connection to confirm. Both devices must be on the same Wi-Fi network.",
    href: "/local-docs/mobile#setup",
    keywords: ["setup", "connect", "ip address", "port", "6543", "6545", "android", "ios", "token", "wifi", "network", "mobile sync"],
  },
  {
    id: "mobile-sync-content",
    title: "What Syncs Between Mobile and Desktop",
    section: "Mobile App",
    category: "Mobile",
    content:
      "Unearthed syncs the following between desktop and mobile: RSS feed subscriptions, all feed articles (including hidden and read-later status), imported sources (Kindle books, KOReader notes, web articles), highlights and personal notes, and deletions. Conflict resolution favours the most recently changed version, so edits on either device are never lost. You can trigger a sync manually or set the mobile app to sync automatically every 5, 15, 30, or 60 minutes.",
    href: "/local-docs/mobile#sync-content",
    keywords: ["sync", "what syncs", "feeds", "articles", "highlights", "quotes", "read later", "hidden", "auto sync"],
  },
  {
    id: "mobile-reading",
    title: "Reading on Mobile",
    section: "Mobile App",
    category: "Mobile",
    content:
      "The mobile app's Feed tab shows all your RSS articles in a clean, distraction-free layout optimised for small screens. Swipe left or right between articles, pull down to refresh, and tap any article to open the full-text reader. Videos from YouTube channels you follow play inline with a single tap. Articles synced from the desktop — including Kindle chapters and web imports — are available to read offline once synced.",
    href: "/local-docs/mobile#reading",
    keywords: ["reading", "feed", "articles", "mobile", "swipe", "offline", "youtube", "reader"],
  },
  {
    id: "mobile-capture",
    title: "Capture Quotes on Mobile",
    section: "Mobile App",
    category: "Mobile",
    content:
      "Never lose a great passage from a physical book again. The Capture button (camera icon) in the mobile app lets you photograph highlighted text and Unearthed reads it automatically using OCR — no typing required. You can also type quotes manually. Attach a note and a colour, choose which book it belongs to, and save. Captured quotes sync to your desktop library and can be exported to Obsidian just like Kindle highlights.",
    href: "/local-docs/mobile#capture",
    keywords: ["capture", "camera", "ocr", "quote", "photo", "physical book", "highlight", "manual", "type"],
  },
  {
    id: "mobile-gestures",
    title: "Swipe Gestures & Touch Controls",
    section: "Mobile App",
    category: "Mobile",
    content:
      "Unearthed Mobile is built for one-handed use. Swipe left between adjacent articles without going back to the list. Configure what a left or right swipe does on article cards — hide the article or bookmark it for Read Later — in Settings → Gestures. Pull down on the feed list to refresh all subscribed feeds at once. The app respects your phone's notch, home bar, and screen edges so nothing is hidden behind hardware cutouts.",
    href: "/local-docs/mobile#gestures",
    keywords: ["swipe", "gesture", "touch", "left", "right", "hide", "read later", "pull to refresh", "one-handed"],
  },
  {
    id: "mobile-daily-reflection",
    title: "Daily Reflection on Mobile",
    section: "Mobile App",
    category: "Mobile",
    content:
      "Open the mobile app to your Home screen and find a handpicked quote waiting for you each morning — drawn from your entire library of Kindle highlights, KOReader notes, and captured passages. Tap the refresh icon to shuffle to a different quote, or select a specific book from the 'Currently Reading' picker to focus reflections on one source. A running count shows how many highlights you have collected so far.",
    href: "/local-docs/mobile#daily-reflection",
    keywords: ["daily", "reflection", "quote", "home", "shuffle", "currently reading", "highlights", "morning"],
  },
  {
    id: "mobile-library",
    title: "Browse Your Library on Mobile",
    section: "Mobile App",
    category: "Mobile",
    content:
      "The Sources tab on mobile shows your entire reading library — every book, article, and web page you have collected highlights from. Search by title or author, filter by source type (Kindle, KOReader, web, manual), and tap any source to browse its quotes. Everything synced from the desktop is available here, alongside quotes you captured directly on your phone.",
    href: "/local-docs/mobile#library",
    keywords: ["library", "sources", "books", "quotes", "browse", "search", "filter", "kindle", "koreader"],
  },
  {
    id: "mobile-add-content",
    title: "Add Content in the Mobile App",
    section: "Mobile App",
    category: "Mobile",
    content:
      "You don't need the desktop to add content. From the mobile app you can: subscribe to a new RSS feed by pasting a URL, import a YouTube video (with transcript), save any web article by its URL, or capture a quote from a physical book using the camera. Content added on mobile syncs to the desktop automatically on the next sync cycle.",
    href: "/local-docs/mobile#add-content",
    keywords: ["add", "import", "rss", "youtube", "web page", "url", "camera", "new", "subscribe", "mobile"],
  },
  {
    id: "mobile-troubleshoot-sync",
    title: "Mobile Sync Troubleshooting",
    section: "Mobile App",
    category: "Mobile",
    content:
      "Can't connect mobile to desktop: both devices must be on the same Wi-Fi network. Double-check the IP address in desktop Settings → API Endpoint (it can change when your router assigns a new address). Verify the token matches exactly — it is case-sensitive. Make sure Unearthed is running on the desktop and not blocked by a firewall on port 6543. Tap 'Test Connection' in mobile Settings to diagnose the issue. On Windows, allow Unearthed through Windows Defender Firewall if prompted.",
    href: "/local-docs/mobile#troubleshoot",
    keywords: ["mobile sync", "cannot connect", "ip", "token", "firewall", "port 6543", "wifi", "test connection", "troubleshoot"],
  },
  {
    id: "mobile-offline",
    title: "Using Mobile Offline",
    section: "Mobile App",
    category: "Mobile",
    content:
      "Unearthed Mobile stores everything locally on your device. Once content has been synced, you can read articles, browse highlights, and capture new quotes without any internet connection. Newly captured quotes and any changes you make offline are queued and synced to the desktop the next time both devices are on the same network.",
    href: "/local-docs/mobile#offline",
    keywords: ["offline", "no internet", "local", "stored", "queued", "sync later"],
  },
];

const fuseOptions: IFuseOptions<SearchItem> = {
  keys: [
    { name: "title", weight: 0.35 },
    { name: "content", weight: 0.3 },
    { name: "keywords", weight: 0.25 },
    { name: "section", weight: 0.1 },
  ],
  threshold: 0.4,
  includeMatches: true,
  includeScore: true,
  minMatchCharLength: 2,
};

let fuseInstance: Fuse<SearchItem> | null = null;

export function getSearchInstance(): Fuse<SearchItem> {
  if (!fuseInstance) {
    fuseInstance = new Fuse(searchIndex, fuseOptions);
  }
  return fuseInstance;
}

export function searchDocs(query: string): FuseResult<SearchItem>[] {
  const fuse = getSearchInstance();
  return fuse.search(query, { limit: 20 });
}

export const SEARCH_HISTORY_KEY = "unearthed-docs-search-history";

export function getSearchHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToSearchHistory(query: string): void {
  if (typeof window === "undefined") return;
  const history = getSearchHistory();
  const updated = [query, ...history.filter((h) => h !== query)].slice(0, 10);
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
}

export function clearSearchHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SEARCH_HISTORY_KEY);
}
