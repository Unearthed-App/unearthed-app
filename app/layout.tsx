/**
 * Copyright (C) 2025 Unearthed App
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

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import QueryClientContextProvider from "@/components/QueryClientContextProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import dynamic from "next/dynamic";
import CookieConsent from "@/components/CookieConsent";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { NoiseBackground } from "@/components/NoiseBackground";
import { ClientAuthLayout } from "@/components/ClientAuthLayout";

const ConditionalPH = dynamic(() => import("@/components/ConditionalPH"));

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unearthed - Kindle Auto Sync, AI-Powered Reading Insights",
  description:
    "Open-source reading insights platform. AI-powered analysis surfaces forgotten insights from your Kindle and KOReader highlights. Discover blind spots, chat with books, and sync to Notion, Obsidian, Capacities, and Supernotes. No Amazon credentials needed.",
  keywords: [
    "readwise alternative",
    "kindle highlights",
    "AI reading analysis",
    "reading insights",
    "book analytics",
    "digital notes",
    "knowledge management",
    "personal library",
    "daily reflections",
    "open source",
    "productivity tool",
    "notion integration",
    "obsidian integration",
    "kindle to notion",
    "kindle to obsidian",
    "kindle to capacities",
    "capacities integration",
    "supernotes integration",
    "kindle sync",
    "KOReader sync",
    "KOReader highlights",
    "reading patterns",
    "book recommendations",
    "chat with books",
    "blind spot detection",
    "note-taking apps",
    "kindle notebook sync",
    "past insights new revelations",
    "connected knowledge",
    "reading history analysis",
  ],
  openGraph: {
    title: "Unearthed - Kindle Auto Sync, AI-Powered Reading Insights",
    description:
      "Open-source reading insights platform with AI analysis. Discover forgotten insights, blind spots, and connections from your Kindle and KOReader highlights. Sync to Notion, Obsidian, Capacities, and Supernotes.",
    type: "website",
    url: "https://unearthed.app",
    siteName: "Unearthed",
    locale: "en_US",
    images: [
      {
        url: "https://unearthed.app/images/banner.webp",
        width: 1200,
        height: 630,
        alt: "Unearthed app interface showing AI-powered reading insights and Kindle integration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@unearthedapp",
    title: "Unearthed - AI-Powered Reading Insights & Connected Knowledge",
    description:
      "Open-source platform that transforms your Kindle highlights into connected knowledge with AI analysis and seamless integrations.",
    images: ["https://unearthed.app/images/banner.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: neobrutalism,
      }}
    >
      <QueryClientContextProvider>
        <html lang="en" className="h-full">
          <NoiseBackground />
          <body className={poppins.className + " h-full"}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ClientAuthLayout>
                <ConditionalPH>
                  <NextSSRPlugin
                    routerConfig={extractRouterConfig(ourFileRouter)}
                  />
                  {children}
                </ConditionalPH>
              </ClientAuthLayout>
              <CookieConsent />
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </QueryClientContextProvider>
    </ClerkProvider>
  );
}
