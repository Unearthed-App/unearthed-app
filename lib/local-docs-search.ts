import Fuse, { FuseResult, IFuseOptions } from "fuse.js";

export interface SearchItem {
  id: string;
  title: string;
  section: string;
  category: "Install" | "Features" | "Settings" | "Troubleshoot" | "Advanced";
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
      "Windows 10+, macOS 12+, Ubuntu 20.04+, Fedora 36+. Minimum 4 GB RAM, 200 MB disk space. Network required only for Kindle sync.",
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
      "Configure Obsidian vault path in Settings. Connect Kindle by clicking Establish Connection. Fetch highlights with Refresh Kindle Books. Exports go to vault/Unearthed/Books/ as Markdown.",
    href: "/local-docs/install#first-launch",
    keywords: [
      "setup",
      "configure",
      "vault",
      "first",
      "launch",
      "obsidian",
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
      "Export highlights as Markdown files into Obsidian vault. YAML front-matter with metadata. Customizable templates for filenames, quotes, and sources. Color-coded highlights. Zero-width space markers for duplicate detection.",
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
      "Keep App Running minimizes to system tray instead of quitting. Run on Startup launches app at OS login. Platform-specific: Windows setLoginItemSettings, macOS openAsHidden, Linux .desktop autostart file.",
    href: "/local-docs/features#tray",
    keywords: [
      "tray",
      "startup",
      "minimize",
      "background",
      "autostart",
      "login",
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
    title: "API Endpoint (KOReader)",
    section: "Settings",
    category: "Settings",
    content:
      "Local HTTP server for KOReader integration. Auto-detected API URLs based on network interfaces. Secret token for Bearer authentication. Port 6543.",
    href: "/local-docs/settings#api",
    keywords: [
      "api",
      "koreader",
      "endpoint",
      "token",
      "port",
      "6543",
      "url",
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
      "Customize exported Markdown format. Source template for YAML front-matter. Quote template for highlights. Daily reflection template with bookTitle, author, fileName variables.",
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
      "Delete Database in Settings to completely reset Unearthed. Deletes local SQLite database and reinitializes fresh. Requires re-sync from Kindle/KOReader. Obsidian files and source data not affected.",
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
      "40+ fully customisable keyboard shortcuts across 8 contexts: global (Ctrl+K search, Ctrl+1-4 tabs, Ctrl+D dark mode, Ctrl+/ help), Home (R new reflection, S/A navigate, I import, H hide, D delete), RSS Feeds, Kindle (Ctrl+Shift+S sync), Library (Ctrl+A select all), Search Modal, Article Viewer, Article Highlighter. All shortcuts can be remapped in Settings.",
    href: "/local-docs/features#keyboard",
    keywords: ["keyboard", "shortcut", "ctrl", "cmd", "hotkey", "customise", "remap", "keybinding"],
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
