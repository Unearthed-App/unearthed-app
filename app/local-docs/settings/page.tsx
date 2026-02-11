"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Cog,
  FolderDot,
  Link,
  Lightbulb,
  BookUserIcon,
  FileText,
  Palette,
  Sparkles,
  Monitor,
  Keyboard,
} from "lucide-react";

function SettingSection({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
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

function SettingItem({
  name,
  defaultValue,
  description,
  tips,
}: {
  name: string;
  defaultValue?: string | boolean;
  description: string;
  tips?: string[];
}) {
  return (
    <div className="rounded-lg border bg-card p-3 space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium">{name}</p>
        {defaultValue !== undefined && (
          <Badge variant="outline" className="text-[10px] shrink-0">
            Default: {String(defaultValue)}
          </Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {tips && tips.length > 0 && (
        <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5 mt-2">
          {tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">Settings Guide</h1>
      <p className="text-muted-foreground mb-8">
        Complete reference for all Unearthed Local settings and configuration
        options.
      </p>

      <div className="space-y-10">
        {/* General Settings */}
        <SettingSection id="general" icon={Cog} title="General">
          <SettingItem
            name="Keep App Running in Background"
            defaultValue={true}
            description="When enabled, closing the window minimizes to system tray instead of quitting the app."
            tips={[
              "Useful for auto-sync and keeping the KOReader API server running",
              "Access the app from the system tray icon",
              "Right-click tray icon to fully quit",
            ]}
          />

          <SettingItem
            name="Private Mode"
            defaultValue={false}
            description="Masks sensitive file paths and data in the UI and error messages for screen sharing or recording."
            tips={[
              "Hides Obsidian vault paths, API URLs, and database paths",
              "Useful when creating tutorials or sharing screenshots",
            ]}
          />

          <SettingItem
            name="Run on System Startup"
            defaultValue={true}
            description="Automatically launch Unearthed when you log into your computer."
            tips={[
              "Windows: Managed via in-app toggle",
              "macOS: Use Dock → Options → Open at Login (no in-app setting)",
              "Linux: Creates .desktop file in ~/.config/autostart/",
            ]}
          />
        </SettingSection>

        {/* macOS Dock */}
        <SettingSection id="macos-dock" icon={Monitor} title="macOS Dock">
          <SettingItem
            name="Show in Dock"
            defaultValue={true}
            description="macOS only. When disabled, the app runs solely from the menu bar without a Dock icon."
            tips={[
              "Automatically enables 'Keep App Running in Background' when disabled",
              "The tray/menu bar icon is used to access the app instead",
              "This setting only appears on macOS",
            ]}
          />
        </SettingSection>

        {/* Keyboard Shortcuts */}
        <SettingSection
          id="keyboard-shortcuts"
          icon={Keyboard}
          title="Keyboard Shortcuts"
        >
          <p>
            All keyboard shortcuts in Unearthed Local are fully customisable.
            Remap any shortcut to your preferred key combination — your custom
            bindings are saved automatically and take effect immediately.
          </p>

          <SettingItem
            name="Custom Keyboard Shortcuts"
            description="Click any shortcut in the list to remap it. Press your desired key combination (including modifier keys like Ctrl, Shift, or Alt) and save."
            tips={[
              "Open via Settings → Keyboard Shortcuts, or press Ctrl/Cmd + /",
              "Supports modifier combinations: Ctrl/Cmd, Shift, Alt",
              "Changes apply instantly — no restart required",
              "Custom bindings are persisted across sessions in settings.json",
              "Use 'Reset' to restore any shortcut to its default binding",
            ]}
          />

          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3">
            <p className="text-xs font-medium mb-1">40+ shortcuts available</p>
            <p className="text-xs text-muted-foreground">
              Shortcuts cover every part of the app: global navigation, Home tab,
              RSS Feeds tab, Kindle tab, Library tab, Search Modal, Article
              Viewer, and Article Highlighter. See the{" "}
              <a
                href="/local-docs/features#keyboard"
                className="text-primary hover:underline"
              >
                Features &rarr; Keyboard Shortcuts
              </a>{" "}
              page for the complete reference.
            </p>
          </div>
        </SettingSection>

        {/* API Endpoint (KOReader) */}
        <SettingSection id="api" icon={Link} title="API Endpoint (KOReader)">
          <p>
            Unearthed runs a local HTTP server that KOReader can send highlights
            to. The API URLs are automatically generated based on your network
            interfaces.
          </p>

          <SettingItem
            name="API URLs"
            description="Automatically detected local network addresses where the API server is accessible."
            tips={[
              "Multiple URLs may appear if you have VPN or multiple network adapters",
              "Try each URL in KOReader if one doesn't work",
              "Format: http://[IP_ADDRESS]:6543",
              "Copy button available for each URL",
            ]}
          />

          <SettingItem
            name="Secret Token"
            // defaultValue=""
            description="Authentication token that KOReader must provide to send data to this app."
            tips={[
              "Can be any text you choose",
              "Must match exactly in KOReader plugin settings",
              "Leave empty to disable authentication (not recommended)",
            ]}
          />
        </SettingSection>

        {/* Obsidian Settings */}
        <SettingSection id="obsidian" icon={FolderDot} title="Obsidian">
          <SettingItem
            name="Location"
            // defaultValue=""
            description="The folder where your Obsidian vault is located. This is where the Root Folder will be created."
            tips={[
              "Use the Browse button to select your vault folder",
              "Must have write permissions to this location",
              "Can be any folder, doesn't have to be an Obsidian vault",
            ]}
          />

          <SettingItem
            name="Root Folder"
            defaultValue="Unearthed"
            description="The main folder name created inside your vault location where all books will be organized."
            tips={[
              "Books are organized as: [Location]/[Root Folder]/Books/",
              "Articles go in: [Location]/[Root Folder]/Articles/",
              "Change this to match your vault structure",
            ]}
          />
        </SettingSection>

        {/* Daily Reflection */}
        <SettingSection
          id="daily-reflection"
          icon={Lightbulb}
          title="Daily Reflection"
        >
          <SettingItem
            name="Daily Note Date Format"
            defaultValue="YYYY-MM-DD"
            description="The date format used for your Obsidian daily note filenames. Supports full moment.js-compatible token replacement."
            tips={[
              "Tokens: YYYY, YY, MMMM, MMM, MM, M, DD, D, Do, dddd, ddd, dd, d, DDD, DDDD, w, ww, W, WW, E, e, Q",
              "Slashes create subfolders: YYYY/MM-MMMM/YYYY-MM-DD-dddd → 2025/02-February/2025-02-10-Monday",
              "Escaped literals: [Week] WW → Week 06",
              "Must match your Obsidian daily notes plugin settings",
            ]}
          />

          <SettingItem
            name="Daily Reflection Location"
            // defaultValue=""
            description="The folder where your Obsidian daily notes are stored."
            tips={[
              "Use Browse button to select the folder",
              "Typically something like: YourVault/Daily Notes/",
              "Must match your Obsidian daily notes plugin folder",
            ]}
          />

          <SettingItem
            name="Create Obsidian Daily Note if it doesn't exist"
            defaultValue={false}
            description="Automatically create a daily note file if one doesn't exist for today."
            tips={[
              "When disabled, Unearthed waits for you to create the note manually",
              "When enabled, creates the file immediately on startup",
            ]}
          />

          <SettingItem
            name="Add Daily Reflection on Startup"
            defaultValue={true}
            description="Automatically append a random quote to your daily note when the app starts."
            tips={[
              "Works together with 'Create Daily Note' setting",
              "If both are disabled, no automatic reflection is added",
              "If 'Create' is off but 'Add' is on, waits for manual note creation",
            ]}
          />

          <SettingItem
            name="Append Under Heading"
            description="Optional. Insert daily reflections under a specific markdown heading instead of appending at the end of the file."
            tips={[
              "Example: ### Daily Reflection",
              "Finds the heading in your daily note and inserts content below it",
              "If the heading is not found, falls back to appending at the end",
              "Respects heading hierarchy — content is placed before the next same-level heading",
            ]}
          />

          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
            <p className="text-xs font-medium mb-1">
              💡 How these work together:
            </p>
            <p className="text-xs text-muted-foreground">
              If <strong>&quot;Create Daily Note&quot;</strong> is disabled but{" "}
              <strong>&quot;Add Reflection on Startup&quot;</strong> is enabled, Unearthed
              will wait until you create your daily note in Obsidian, then
              automatically add the reflection to it.
            </p>
          </div>
        </SettingSection>

        {/* Kindle Settings */}
        <SettingSection id="kindle" icon={BookUserIcon} title="Kindle Settings">
          <SettingItem
            name="Kindle URL"
            defaultValue="https://read.amazon.com"
            description="The URL where you'll log into Amazon to sync Kindle highlights."
            tips={[
              "Default works for most users",
              "Change to your regional Amazon domain if needed (e.g., amazon.co.uk)",
              "This is where the in-app browser navigates when establishing connection",
            ]}
          />

          <SettingItem
            name="Auto Sync"
            defaultValue={true}
            description="Automatically fetch new Kindle highlights every hour in the background."
            tips={[
              "Requires 'Keep App Running' to be enabled",
              "Syncs silently without interrupting your work",
              "Manual sync always available via 'Refresh Kindle Books' button",
            ]}
          />
        </SettingSection>

        {/* File Name Settings */}
        <SettingSection id="filename" icon={FileText} title="File Name">
          <SettingItem
            name="Source (Book) Filename Template"
            // defaultValue="{{title}}"
            description="Template for generating Markdown filenames from book metadata."
            tips={[
              "Available variables: {{title}}, {{subtitle}}, {{author}}, {{type}}, {{origin}}, {{asin}}",
              "Example: '{{title}} - {{author}}' → 'Atomic Habits - James Clear.md'",
              "Keep it simple to avoid filesystem issues",
            ]}
          />

          <SettingItem
            name="Replace Spaces In Filename With"
            // defaultValue=" "
            description="Character to replace spaces with in generated filenames."
            tips={[
              "Common options: space ' ', underscore '_', dash '-'",
              "Use underscore for wiki-link compatibility",
              "Leave as space for human-readable names",
            ]}
          />

          <SettingItem
            name="Source (Book) Filename Lowercase"
            defaultValue={false}
            description="Convert all filenames to lowercase."
            tips={[
              "Useful for consistent naming across platforms",
              "Example: 'Atomic Habits.md' → 'atomic habits.md'",
            ]}
          />

          <SettingItem
            name="Include ignored books in CSV export"
            defaultValue={false}
            description="When exporting to CSV, include books marked as 'ignored' in a separate 'Ignored' subfolder."
            tips={[
              "Ignored books are excluded from Obsidian export by default",
              "This setting only affects CSV exports",
            ]}
          />
        </SettingSection>

        {/* Template Settings */}
        <SettingSection
          id="templates"
          icon={FileText}
          title="Template Settings"
        >
          <p>
            Customize how your exported Markdown files are formatted using
            template variables. Leave empty to use the default templates.
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="source-template">
              <AccordionTrigger className="text-sm">
                Source Template
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Controls the YAML front-matter and header section of each book
                  file.
                </p>
                <p className="font-medium">Available variables:</p>
                <ul className="list-disc list-inside text-xs space-y-0.5">
                  <li>
                    <CodeInline>{`{{title}}`}</CodeInline> — Book title
                  </li>
                  <li>
                    <CodeInline>{`{{subtitle}}`}</CodeInline> — Book subtitle
                  </li>
                  <li>
                    <CodeInline>{`{{author}}`}</CodeInline> — Author name
                  </li>
                  <li>
                    <CodeInline>{`{{type}}`}</CodeInline> — Source type (Book,
                    Article)
                  </li>
                  <li>
                    <CodeInline>{`{{origin}}`}</CodeInline> — Import source
                    (Kindle, KOReader)
                  </li>
                  <li>
                    <CodeInline>{`{{asin}}`}</CodeInline> — Amazon ASIN
                    identifier
                  </li>
                </ul>
                <div className="rounded-lg border bg-[hsl(169.4,43.6%,7.6%)] text-gray-100 p-3 mt-2">
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                    {`---
title: {{title}}
author: [[{{author}}]]
type: {{type}}
origin: {{origin}}
tags: [books, highlights]
---

# {{title}}
by [[{{author}}]]`}
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="quote-template">
              <AccordionTrigger className="text-sm">
                Quote Template
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Controls how each individual highlight is formatted in the
                  book file.
                </p>
                <p className="font-medium">Available variables:</p>
                <ul className="list-disc list-inside text-xs space-y-0.5">
                  <li>
                    <CodeInline>{`{{content}}`}</CodeInline> — Styled quote with
                    color formatting
                  </li>
                  <li>
                    <CodeInline>{`{{quote}}`}</CodeInline> — Raw quote text
                    without styling
                  </li>
                  <li>
                    <CodeInline>{`{{note}}`}</CodeInline> — Your personal
                    annotation
                  </li>
                  <li>
                    <CodeInline>{`{{location}}`}</CodeInline> — Page number or
                    location
                  </li>
                  <li>
                    <CodeInline>{`{{color}}`}</CodeInline> — Highlight color
                    name
                  </li>
                </ul>
                <div className="rounded-lg border bg-[hsl(169.4,43.6%,7.6%)] text-gray-100 p-3 mt-2">
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                    {`{{content}}

{{note}}

*Location: {{location}} • Color: {{color}}*

---`}
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="daily-template">
              <AccordionTrigger className="text-sm">
                Daily Reflection Template
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Controls how the random quote is formatted when added to your
                  daily note.
                </p>
                <p className="font-medium">Available variables:</p>
                <ul className="list-disc list-inside text-xs space-y-0.5">
                  <li>All quote template variables above, plus:</li>
                  <li>
                    <CodeInline>{`{{bookTitle}}`}</CodeInline> — Source book
                    title
                  </li>
                  <li>
                    <CodeInline>{`{{author}}`}</CodeInline> — Source author
                  </li>
                  <li>
                    <CodeInline>{`{{fileName}}`}</CodeInline> — Generated
                    filename for linking
                  </li>
                </ul>
                <div className="rounded-lg border bg-[hsl(169.4,43.6%,7.6%)] text-gray-100 p-3 mt-2">
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                    {`---
{{content}}

**From:** {{bookTitle}} by [[{{author}}]]
**File:** [[{{fileName}}]]

---`}
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </SettingSection>

        {/* Quote Colors */}
        <SettingSection id="colors" icon={Palette} title="Quote Colors">
          <SettingItem
            name="Quote Color Mode"
            defaultValue="background"
            description="How highlight colors are displayed in exported Markdown files."
            tips={[
              "none: No color styling applied",
              "background: Gradient background behind text",
              "text: Colored text only",
            ]}
          />

          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs font-medium mb-2">Custom Color Values</p>
            <p className="text-xs text-muted-foreground mb-3">
              Override the default hex color values for each highlight color.
              All 10 colors are customizable.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
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
                  className="flex items-center gap-2 rounded border p-2"
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
          </div>
        </SettingSection>

        {/* Values to Clean */}
        <SettingSection
          id="clean-values"
          icon={Sparkles}
          title="Values to Clean"
        >
          <p>
            Select which metadata fields should have special characters removed
            or replaced during export. This helps avoid issues with filenames
            and formatting.
          </p>

          <div className="rounded-lg border bg-card p-3 space-y-3">
            <div>
              <p className="text-xs font-medium mb-2">Book Fields</p>
              <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                <li>Title</li>
                <li>Subtitle</li>
                <li>Author</li>
                <li>Type</li>
                <li>Origin</li>
                <li>ASIN</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium mb-2">Quote Fields</p>
              <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                <li>Content (quote text)</li>
                <li>Note (personal annotation)</li>
                <li>Location</li>
                <li>Color</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3">
            <p className="text-xs font-medium mb-1">ℹ️ What gets cleaned:</p>
            <p className="text-xs text-muted-foreground">
              Special characters like <CodeInline>/</CodeInline>,{" "}
              <CodeInline>\</CodeInline>, <CodeInline>:</CodeInline>,{" "}
              <CodeInline>*</CodeInline>, <CodeInline>?</CodeInline>,{" "}
              <CodeInline>&quot;</CodeInline>, <CodeInline>&lt;</CodeInline>,{" "}
              <CodeInline>&gt;</CodeInline>, <CodeInline>|</CodeInline> are
              removed or replaced to ensure compatibility with filesystems and
              Markdown formatting.
            </p>
          </div>
        </SettingSection>

        {/* Database Utilities */}
        <SettingSection id="database" icon={Cog} title="Database Utilities">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
            <p className="text-xs font-medium mb-1">⚠️ Advanced Settings</p>
            <p className="text-xs text-muted-foreground mb-3">
              These utilities are for troubleshooting and advanced users only.
            </p>
          </div>

          <SettingItem
            name="Show Database Path"
            description="Displays the full file path to your local SQLite database."
            tips={[
              "Useful for manual backups or inspection",
              "Location varies by platform (AppData on Windows, Application Support on macOS)",
            ]}
          />

          <SettingItem
            name="Delete Database"
            description="Permanently removes all locally stored books and quotes."
            tips={[
              "⚠️ This action cannot be undone",
              "Requires double confirmation",
              "Use this to start fresh or troubleshoot corruption issues",
              "You can re-sync from Kindle/KOReader after deletion",
            ]}
          />
        </SettingSection>

        {/* Reset to Defaults */}
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-semibold mb-2">Reset All Settings</h3>
          <p className="text-sm text-muted-foreground mb-3">
            The settings modal includes a &quot;Reset to Defaults&quot; button that
            restores all settings to their original values.
          </p>
          <p className="text-xs text-muted-foreground">
            This does not affect your database or exported files—only the
            configuration settings.
          </p>
        </div>
      </div>
    </div>
  );
}
