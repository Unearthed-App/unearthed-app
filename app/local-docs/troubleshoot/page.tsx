"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  BookOpen,
  FileText,
  Wifi,
  Database,
  Monitor,
  Apple,
  Terminal,
  Rss,
} from "lucide-react";

function TroubleshootSection({
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
    <section id={id} className="scroll-mt-20 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ProblemSolution({
  problem,
  children,
}: {
  problem: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem value={problem}>
      <AccordionTrigger className="text-sm text-left">
        <span className="flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          {problem}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="text-sm text-muted-foreground space-y-2 ml-5.5">
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function CodeInline({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-xs bg-primary/10 px-1 py-0.5 rounded font-mono">
      {children}
    </code>
  );
}

export default function TroubleshootPage() {

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">
        Troubleshooting
      </h1>
      <p className="text-muted-foreground mb-8">
        Common issues and how to fix them.
      </p>

      {/* Kindle */}
      <TroubleshootSection
        id="kindle"
        icon={BookOpen}
        title="Kindle Connection"
      >
        <Accordion type="single" collapsible className="w-full">
          <ProblemSolution problem='"Not Connected" status after clicking Establish Connection'>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Ensure you completed the Amazon login in the in-app browser
              </li>
              <li>
                Click <strong>Check Status</strong> to refresh the connection
              </li>
              <li>
                Clear your session by re-opening the browser and logging in
                again
              </li>
              <li>
                Verify <CodeInline>kindleUrl</CodeInline> in Settings is{" "}
                <CodeInline>https://read.amazon.com</CodeInline>
              </li>
            </ul>
          </ProblemSolution>

          <ProblemSolution problem="No books appear after Refresh Kindle Books">
            <ul className="list-disc list-inside space-y-1">
              <li>
                Verify you have highlights in your Kindle library (check
                read.amazon.com in a regular browser)
              </li>
              <li>Check the connection status indicator is green</li>
              <li>Try disconnecting and reconnecting</li>
            </ul>
          </ProblemSolution>

          <ProblemSolution problem="Rate limited error">
            <ul className="list-disc list-inside space-y-1">
              <li>Amazon may temporarily block rapid requests</li>
              <li>Wait a few minutes and try again</li>
              <li>Reduce sync frequency if using auto-sync</li>
            </ul>
          </ProblemSolution>
        </Accordion>
      </TroubleshootSection>

      {/* General Reset */}
      <TroubleshootSection id="reset" icon={Database} title="Reset & Recovery">
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 mb-4">
          <p className="text-sm font-medium mb-2">
            When to use Delete Database
          </p>
          <p className="text-sm text-muted-foreground">
            If you&apos;re experiencing persistent issues (corrupted data, syncs
            failing repeatedly, unexpected behavior), you can use the{" "}
            <strong>Delete Database</strong> button in Settings to completely
            reset Unearthed. This will:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-0.5">
            <li>Delete the local SQLite database</li>
            <li>Reinitialize with a fresh database</li>
            <li>Require you to re-sync from Kindle/KOReader</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-2">
            <strong>Note:</strong> Your Obsidian files and Kindle/KOReader data
            are not affected.
          </p>
        </div>
      </TroubleshootSection>

      {/* Obsidian Export */}
      <TroubleshootSection
        id="obsidian"
        icon={FileText}
        title="Obsidian Export"
      >
        <Accordion type="single" collapsible className="w-full">
          <ProblemSolution problem="Vault path not configured">
            <p>
              Open <strong>Settings</strong> &rarr; <strong>Obsidian</strong>{" "}
              &rarr; click <strong>Browse</strong> to select your vault folder.
            </p>
          </ProblemSolution>

          <ProblemSolution problem="Permission denied when exporting">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>macOS:</strong> Re-select the vault folder (macOS
                revokes permissions after updates)
              </li>
              <li>
                <strong>Windows:</strong> Run the app as administrator if vault
                is in a protected location
              </li>
              <li>
                <strong>Linux:</strong> Check file permissions on the vault
                directory
              </li>
            </ul>
          </ProblemSolution>

          <ProblemSolution problem="Duplicate quotes in exported files">
            <ul className="list-disc list-inside space-y-1">
              <li>
                The app uses zero-width space markers to detect existing quotes
              </li>
              <li>If you manually edited the markers, duplicates may appear</li>
              <li>Re-export will not create duplicates for unmodified files</li>
            </ul>
          </ProblemSolution>
        </Accordion>
      </TroubleshootSection>

      {/* KOReader API */}
      <TroubleshootSection id="koreader-api" icon={Wifi} title="KOReader API">
        <Accordion type="single" collapsible className="w-full">
          <ProblemSolution problem="KOReader can't connect to the API">
            <ul className="list-disc list-inside space-y-1">
              <li>
                Ensure both devices are on the{" "}
                <strong>same local network</strong>
              </li>
              <li>
                Check the IP address shown in Settings &rarr; API Endpoint
              </li>
              <li>
                Verify port <CodeInline>6543</CodeInline> is not blocked by your
                firewall
              </li>
              <li>
                Confirm the secret token matches in both the app and KOReader
                plugin
              </li>
            </ul>
          </ProblemSolution>

          <ProblemSolution problem="401 Unauthorized response">
            <ul className="list-disc list-inside space-y-1">
              <li>
                Check that your KOReader plugin is sending the correct Bearer
                token
              </li>
              <li>
                Verify the token in Settings &rarr; Secret Token matches exactly
                (case-sensitive)
              </li>
            </ul>
          </ProblemSolution>
        </Accordion>
      </TroubleshootSection>

      {/* RSS Feeds */}
      <TroubleshootSection id="rss-feeds" icon={Rss} title="RSS Feeds">
        <Accordion type="single" collapsible className="w-full">
          <ProblemSolution problem="Feed subscription fails or returns no articles">
            <ul className="list-disc list-inside space-y-1">
              <li>
                Verify the URL is a valid RSS or Atom feed (not just a website
                URL)
              </li>
              <li>
                Try opening the feed URL directly in a browser &mdash; it
                should show XML content
              </li>
              <li>
                Some sites require the full feed path (e.g.{" "}
                <CodeInline>/feed</CodeInline>,{" "}
                <CodeInline>/rss</CodeInline>, or{" "}
                <CodeInline>/atom.xml</CodeInline>)
              </li>
            </ul>
          </ProblemSolution>

          <ProblemSolution problem="Articles reappear after deletion">
            <ul className="list-disc list-inside space-y-1">
              <li>
                This is expected &mdash; deleting an RSS article removes it
                from your local database, but the next feed refresh will
                re-fetch it from the source
              </li>
              <li>
                Use <strong>Hide</strong> instead of Delete to permanently
                declutter articles without re-fetching
              </li>
            </ul>
          </ProblemSolution>

          <ProblemSolution problem="Images not loading in article reader">
            <ul className="list-disc list-inside space-y-1">
              <li>
                External images require an internet connection to load
              </li>
              <li>
                Some feeds serve images from domains that may be blocked by
                network restrictions
              </li>
            </ul>
          </ProblemSolution>

          <ProblemSolution problem="YouTube video not playing in article">
            <ul className="list-disc list-inside space-y-1">
              <li>
                YouTube embeds require an internet connection
              </li>
              <li>
                If the transcript fails to load, the app retries up to 3
                times with exponential backoff
              </li>
              <li>
                Repeated rate limiting (HTTP 429) may require waiting a few
                minutes before retrying
              </li>
            </ul>
          </ProblemSolution>
        </Accordion>
      </TroubleshootSection>

      {/* Database */}
      <TroubleshootSection id="database" icon={Database} title="Database">
        <Accordion type="single" collapsible className="w-full">
          <ProblemSolution problem="Database initialization error on startup">
            <ul className="list-disc list-inside space-y-1">
              <li>
                Check available disk space &mdash; SQLite needs write access
              </li>
              <li>
                <strong>Windows:</strong> Ensure{" "}
                <CodeInline>%APPDATA%\Unearthed\</CodeInline> is not read-only
              </li>
              <li>
                <strong>macOS:</strong> Check{" "}
                <CodeInline>
                  ~/Library/Application Support/Unearthed/
                </CodeInline>
              </li>
              <li>
                <strong>Linux:</strong> Check{" "}
                <CodeInline>~/.config/Unearthed/</CodeInline>
              </li>
            </ul>
          </ProblemSolution>

          <ProblemSolution problem="Database locked or busy">
            <ul className="list-disc list-inside space-y-1">
              <li>Close other instances of the app</li>
              <li>
                The app retries locked operations 3 times with exponential
                backoff
              </li>
              <li>If persistent, restart the app</li>
            </ul>
          </ProblemSolution>

          <ProblemSolution problem="Corrupted database">
            <ul className="list-disc list-inside space-y-1">
              <li>
                Open Settings &rarr; Database Utilities &rarr;{" "}
                <strong>Delete Database</strong>
              </li>
              <li>
                This deletes and reinitializes the database (all local data will
                be lost)
              </li>
              <li>Re-sync from Kindle or KOReader to restore data</li>
            </ul>
          </ProblemSolution>
        </Accordion>
      </TroubleshootSection>

      {/* Platform-Specific */}
      <TroubleshootSection
        id="platform"
        icon={Monitor}
        title="Platform-Specific"
      >
        <Tabs defaultValue="windows" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="windows">
              <Monitor className="h-3.5 w-3.5 mr-1.5" />
              Windows
            </TabsTrigger>
            <TabsTrigger value="macos">
              <Apple className="h-3.5 w-3.5 mr-1.5" />
              macOS
            </TabsTrigger>
            <TabsTrigger value="linux">
              <Terminal className="h-3.5 w-3.5 mr-1.5" />
              Linux
            </TabsTrigger>
          </TabsList>

          <TabsContent value="windows" className="mt-3 w-full">
            <div className="rounded-lg border p-4 space-y-2 text-sm text-muted-foreground">
              <ul className="list-disc list-inside space-y-1.5">
                <li>
                  <strong>SmartScreen:</strong> May block the installer &mdash;
                  click &quot;More info&quot; &rarr; &quot;Run anyway&quot;
                </li>
                <li>
                  <strong>UAC elevation:</strong> May be needed if installed in
                  Program Files
                </li>
                <li>
                  <strong>Path length:</strong> 260 character limit can cause
                  issues with deeply nested vault structures
                </li>
                <li>
                  <strong>Antivirus:</strong> Some AV software may interfere
                  with database operations; add an exception for the app data
                  folder
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="macos" className="mt-3">
            <div className="rounded-lg border p-4 space-y-2 text-sm text-muted-foreground">
              <ul className="list-disc list-inside space-y-1.5">
                <li>
                  <strong>Gatekeeper:</strong> Right-click &rarr; Open on first
                  launch to bypass
                </li>
                <li>
                  <strong>File access:</strong> Permissions must be granted for
                  vault folder
                </li>
                <li>
                  <strong>After updates:</strong> Re-select vault folder (macOS
                  revokes permissions)
                </li>
                <li>
                  <strong>Run on Startup:</strong> Right-click the dock icon
                  &rarr; Options &rarr; Open at Login (no in-app setting on
                  macOS)
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="linux" className="mt-3">
            <div className="rounded-lg border p-4 space-y-2 text-sm text-muted-foreground">
              <ul className="list-disc list-inside space-y-1.5">
                <li>
                  <strong>Dependencies:</strong> Ensure{" "}
                  <CodeInline>libsqlite3</CodeInline> is available on your
                  system
                </li>
                <li>
                  <strong>Autostart:</strong> Desktop file created at{" "}
                  <CodeInline>~/.config/autostart/unearthed.desktop</CodeInline>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </TroubleshootSection>

      {/* Still stuck */}
      <div className="rounded-lg border bg-primary/5 p-4">
        <h3 className="font-semibold text-sm mb-2">Still stuck?</h3>
        <p className="text-sm text-muted-foreground mb-3">
          The app keeps detailed logs that can help diagnose issues. You can
          find them here:
        </p>
        <ul className="text-sm text-muted-foreground space-y-1 mb-3">
          <li>
            <strong>Windows:</strong>{" "}
            <CodeInline>%APPDATA%\Unearthed\logs\</CodeInline>
          </li>
          <li>
            <strong>macOS:</strong>{" "}
            <CodeInline>
              ~/Library/Application Support/Unearthed/logs/
            </CodeInline>
          </li>
          <li>
            <strong>Linux:</strong>{" "}
            <CodeInline>~/.config/Unearthed/logs/</CodeInline>
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Share the most recent log file when reporting issues to support.
        </p>
      </div>
    </div>
  );
}
