"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Monitor,
  Apple,
  Terminal,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";

function CopyBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-md border bg-[hsl(169.4,43.6%,7.6%)] text-gray-100 overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white transition-colors"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-3 text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function StepItem({
  step,
  title,
  children,
  last = false,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className="relative flex gap-4 pb-8">
      {!last && (
        <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />
      )}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground z-10">
        {step}
      </div>
      <div className="flex-1 pt-0.5">
        <h3 className="font-medium text-sm mb-2">{title}</h3>
        <div className="text-sm text-muted-foreground space-y-2">{children}</div>
      </div>
    </div>
  );
}

export default function InstallPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">Installation</h1>
      <p className="text-muted-foreground mb-8">
        Get Unearthed Local running on your machine in minutes.
      </p>

      {/* Requirements */}
      <section id="requirements" className="mb-10">
        <h2 className="text-lg font-semibold mb-4">System Requirements</h2>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-primary/10/50">
                <th className="text-left font-medium px-4 py-2.5">Requirement</th>
                <th className="text-left font-medium px-4 py-2.5">Minimum</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2.5 font-medium">Operating System</td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  Windows 10+, macOS 12+, Ubuntu 20.04+, Fedora 36+
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2.5 font-medium">RAM</td>
                <td className="px-4 py-2.5 text-muted-foreground">4 GB</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2.5 font-medium">Disk Space</td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  200 MB + database growth
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium">Network</td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  Required only for Kindle sync
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Download */}
      <section id="download" className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Download</h2>
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm text-muted-foreground">
            Download Unearthed Local from{" "}
            <a
              href="/local-download"
              className="text-primary hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              unearthed.app/local-download
            </a>
            . You&apos;ll need your <strong>Distinct ID</strong> to access the download page.
          </p>
          <p className="text-sm text-muted-foreground mt-2 border-t pt-2">
            <strong>Note:</strong> Premium users can log in and select &apos;D/L Unearthed Local&apos; from the menu.
          </p>
        </div>
        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { platform: "Windows", icon: Monitor, file: ".exe installer", badge: "x64" },
            { platform: "macOS", icon: Apple, file: ".zip bundle", badge: "ARM64 / x64" },
            { platform: "Linux", icon: Terminal, file: ".AppImage / .deb / .rpm", badge: "x64" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.platform}
                className="flex flex-col items-center gap-2 rounded-lg border p-4 bg-card text-center"
              >
                <Icon className="h-8 w-8 text-primary" />
                <p className="font-medium text-sm">{item.platform}</p>
                <p className="text-xs text-muted-foreground">{item.file}</p>
                <Badge variant="outline" className="text-[10px]">
                  {item.badge}
                </Badge>
              </div>
            );
          })}
        </div> */}
      </section>

      {/* Platform-specific install */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Platform Setup</h2>
        <p className="text-sm text-muted-foreground mb-4">
          All platforms: Download the <code className="text-xs bg-primary/10 px-1 py-0.5 rounded">.zip</code> file for your OS and unzip it.
        </p>
        <Tabs defaultValue="windows" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="windows" className="px-4">Windows</TabsTrigger>
            <TabsTrigger value="macos" className="px-4">macOS</TabsTrigger>
            <TabsTrigger value="linux" className="px-4">Linux</TabsTrigger>
          </TabsList>

          <TabsContent value="windows" id="windows" className="mt-4 space-y-1">
            <StepItem step={1} title="Run the installer">
              <p>
                Windows SmartScreen may block the installer. Click{" "}
                <strong>More info</strong> then <strong>Run anyway</strong>.
              </p>
            </StepItem>
            <StepItem step={2} title="Installation completes">
              <p>
                The app installs to{" "}
                <code className="text-xs bg-primary/10 px-1 py-0.5 rounded">%LOCALAPPDATA%\Unearthed</code>.
                A desktop shortcut is created automatically.
              </p>
            </StepItem>
            <StepItem step={3} title="Launch" last>
              <p>Open Unearthed from the Start Menu or desktop shortcut.</p>
            </StepItem>
          </TabsContent>

          <TabsContent value="macos" id="macos" className="mt-4 space-y-1">
            <StepItem step={1} title="Move to Applications">
              <p>
                Drag <strong>Unearthed.app</strong> into your{" "}
                <strong>Applications</strong> folder.
              </p>
            </StepItem>
            <StepItem step={2} title="Bypass Gatekeeper">
              <p>
                On first launch, <strong>right-click</strong> the app and choose{" "}
                <strong>Open</strong> to bypass Gatekeeper.
              </p>
            </StepItem>
            <StepItem step={3} title="Grant permissions">
              <p>
                Grant file access permissions when prompted. These are needed for
                exporting to your Obsidian vault.
              </p>
            </StepItem>
            <StepItem step={4} title="Run on Startup (optional)" last>
              <p>
                To launch Unearthed automatically when you log in:{" "}
                <strong>right-click</strong> the Unearthed icon in the Dock &rarr;{" "}
                <strong>Options</strong> &rarr; <strong>Open at Login</strong>.
              </p>
              <p className="text-xs mt-1 text-muted-foreground">
                Note: There is no in-app &quot;Run on Startup&quot; setting on macOS.
              </p>
            </StepItem>
          </TabsContent>

          <TabsContent value="linux" id="linux" className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Debian / Ubuntu (.deb)</h4>
              <p className="text-sm text-muted-foreground">
                Double-click the <code className="text-xs bg-primary/10 px-1 py-0.5 rounded">.deb</code> file to open it in your software center and install.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Fedora / RHEL (.rpm)</h4>
              <p className="text-sm text-muted-foreground">
                Double-click the <code className="text-xs bg-primary/10 px-1 py-0.5 rounded">.rpm</code> file to open it in your software center and install.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* First launch */}
      <section id="first-launch" className="mb-10">
        <h2 className="text-lg font-semibold mb-4">First Launch Setup</h2>
        <div className="space-y-1">
          <StepItem step={1} title="Configure Obsidian Vault">
            <p>
              Open <strong>Settings</strong> &rarr; <strong>Obsidian</strong>{" "}
              section &rarr; click <strong>Browse</strong> to select your vault
              folder.
            </p>
          </StepItem>
          <StepItem step={2} title="Connect to Kindle">
            <p>
              Click <strong>Establish Kindle Connection</strong> on the
              dashboard. Log into your Amazon account in the built-in browser.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              <strong>Privacy:</strong> Your Amazon credentials are never seen or stored by Unearthed. 
              The login happens directly with Amazon, and only the browser session is used to fetch your highlights.
            </p>
          </StepItem>
          <StepItem step={3} title="Fetch Highlights">
            <p>
              Click <strong>Refresh Kindle Books</strong> to import all your
              highlights and annotations.
            </p>
          </StepItem>
          <StepItem step={4} title="Connect KOReader (Optional)">
            <p>
              If you use KOReader, you can sync highlights wirelessly (no USB needed):
            </p>
            <ol className="list-decimal list-inside mt-2 space-y-1.5">
              <li>
                Install the{" "}
                <a
                  href="https://github.com/Unearthed-App/unearthed-koreader"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Unearthed KOReader Plugin
                </a>{" "}
                on your e-reader
              </li>
              <li>
                In Unearthed Local, go to <strong>Settings</strong> &rarr;{" "}
                <strong>API Endpoint</strong> section
              </li>
              <li>
                Copy the API URL shown
              </li>
              <li>
                Set a <strong>Secret Token</strong> in Unearthed Local
              </li>
              <li>
                Enter both the API URL and Secret Token in your KOReader plugin settings
              </li>
            </ol>
            <p className="text-xs text-muted-foreground mt-2">
              <strong>Note:</strong> Multiple IPs may be listed (especially with VPNs enabled). Try each one until it works. Both devices must be on the same network.
            </p>
          </StepItem>
          <StepItem step={5} title="Done!" last>
            <p>
            Your highlights are now in your configured Obsidian vault location
              as Markdown files. They update automatically on each sync.
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs font-medium">Setup complete</span>
            </div>
          </StepItem>
        </div>
      </section>

    </div>
  );
}
