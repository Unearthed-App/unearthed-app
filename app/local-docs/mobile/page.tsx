"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Wifi, Camera, BookOpen, Rss } from "lucide-react";

function Section({
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

export default function MobilePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">
        Mobile App
      </h1>
      <p className="text-muted-foreground mb-2">
        Unearthed for Android &amp; iOS : a Progressive Web App (PWA) that keeps your
        entire library with you.
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        <Badge variant="outline" className="text-[10px]">Android &amp; iOS</Badge>
        <Badge variant="outline" className="text-[10px]">PWA</Badge>
      </div>

      <div className="space-y-10">

        {/* Overview */}
        <Section id="overview" icon={Smartphone} title="Overview">
          <p>
            The Unearthed mobile app is a Progressive Web App (PWA) for
            Android and iOS. It is a separate one-time purchase from Unearthed Local.
          </p>

          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3">
            <p className="text-xs font-medium mb-1">Installing the PWA</p>
            <ol className="list-decimal list-inside text-xs space-y-1 text-muted-foreground">
              <li><strong>Android:</strong> Open the Unearthed mobile URL in Chrome, tap the menu and select <strong>Add to Home Screen</strong></li>
              <li><strong>iPhone / iPad:</strong> Open the URL in Safari, tap the Share icon and select <strong>Add to Home Screen</strong> (certificate setup required for desktop sync)</li>
              <li>The app icon appears on your home screen like a native app</li>
            </ol>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-medium mb-1">
              One library. Every device. All local.
            </p>
            <p className="text-xs text-muted-foreground">
              Sync happens entirely over your home Wi-Fi : no cloud account, no
              third-party servers. Your data never leaves your home.
            </p>
          </div>
        </Section>

        {/* Companion sync */}
        <Section id="companion" icon={Wifi} title="Desktop Companion Sync">
          <p>
            The mobile app syncs with Unearthed Local running on your desktop
            over your home Wi-Fi network. The desktop app must be running for
            sync to work.
          </p>

          <div className="rounded-lg border bg-card p-3 space-y-2 mb-2">
            <p className="text-xs font-medium">Setup</p>
            <ol className="list-decimal list-inside text-xs space-y-1.5 text-muted-foreground">
              <li>
                On the desktop, open{" "}
                <strong>Settings &rarr; API Endpoint</strong> : note the IP
                address and Secret Token
              </li>
              <li>
                Open the mobile app, go to <strong>Settings</strong>, and enter
                the same IP address, port (
                <code className="text-xs bg-primary/10 px-1 py-0.5 rounded font-mono">
                  6543
                </code>
                ), and token
              </li>
              <li>
                Tap <strong>Test Connection</strong> to confirm the link
              </li>
              <li>
                Tap <strong>Sync</strong> or wait for the auto-sync interval
                (configurable: 5, 15, 30, or 60 minutes)
              </li>
            </ol>
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Both devices must be on the same Wi-Fi
              network.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what-syncs">
              <AccordionTrigger className="text-sm">
                What gets synced
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>RSS feeds</strong> : subscribe on either device and
                    it appears on both
                  </li>
                  <li>
                    <strong>Articles</strong> : including hidden status, Read It
                    Later bookmarks, and imported state
                  </li>
                  <li>
                    <strong>Sources</strong> : Kindle books, KOReader notes, and
                    web imports from the desktop appear on mobile
                  </li>
                  <li>
                    <strong>Highlights &amp; notes</strong> : quotes created on
                    mobile sync to the desktop and can be exported to Obsidian
                  </li>
                  <li>
                    <strong>Deletions</strong> : articles or feeds deleted on
                    one device are removed from the other on the next sync
                  </li>
                </ul>
                <p className="text-xs mt-2">
                  Conflict resolution always keeps the most recently changed
                  version.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Section>

        {/* Reading */}
        <Section id="reading" icon={BookOpen} title="Reading &amp; Browsing">
          <ul className="list-disc list-inside space-y-1">
            <li>
              Browse all RSS articles in the <strong>Feed</strong> tab,
              sorted newest-first
            </li>
            <li>
              Filter by feed, sort order, hidden status, or Read It Later
            </li>
            <li>Pull down to refresh all subscribed feeds at once</li>
            <li>
              Tap any article to open the full-text reader; swipe between
              adjacent articles
            </li>
            <li>
              YouTube videos from subscribed channels play inline with a
              single tap
            </li>
            <li>
              All synced content is available <strong>offline</strong> once
              synced
            </li>
            <li>
              The <strong>Home</strong> screen shows your daily reflection : a
              new quote from your library each morning, and a random quote from what you are currently reading
            </li>
            <li>
              The <strong>Sources</strong> tab lets you browse every book,
              article, and web page with all its highlights
            </li>
          </ul>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="gestures">
              <AccordionTrigger className="text-sm">
                Touch gestures &amp; swipe actions
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>Swipe left / right</strong> on article cards —
                    configurable: hide or Read It Later (Settings &rarr;
                    Gestures)
                  </li>
                  <li>
                    <strong>Swipe between articles</strong> in the reader
                    without returning to the list
                  </li>
                  <li>
                    <strong>Pull to refresh</strong> on the feed list to fetch
                    new articles
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Section>

        {/* Adding content */}
        <Section id="add-content" icon={Rss} title="Adding Content">
          <p>
            You don&apos;t need the desktop to save new content. From mobile
            you can:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Subscribe to a new RSS feed by pasting its URL</li>
            <li>Import a YouTube video (with transcript) via URL or video ID</li>
            <li>
              Save any web article by pasting its URL : full text is extracted
              automatically
            </li>
            <li>Capture a quote from a physical book using the camera</li>
          </ul>
          <p className="text-xs">
            Everything added on mobile syncs to the desktop on the next sync
            cycle.
          </p>
        </Section>

        {/* OCR capture */}
        <Section id="capture" icon={Camera} title="Capturing Physical Book Quotes">
          <p>
            Photograph highlighted text in a physical book and Unearthed reads
            it automatically using <strong>OCR</strong> : no typing required.
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Tap the camera (Capture) button on the Home screen</li>
            <li>Select which book the quote belongs to</li>
            <li>
              Take a photo of the highlighted passage : crop to the relevant
              area
            </li>
            <li>Unearthed extracts the text automatically; edit if needed</li>
            <li>Add a personal note and choose a highlight color</li>
            <li>Save : the quote syncs to your desktop on next sync</li>
          </ol>
          <p className="text-xs">
            You can also type quotes manually. Captured quotes are exported to
            Obsidian (after syncing with Unearthed Local) just like Kindle
            highlights.
          </p>
        </Section>

      </div>
    </div>
  );
}
