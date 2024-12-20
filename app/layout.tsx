/**
 * Copyright (C) 2024 Unearthed App
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
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Navbar as NavBarPremium } from "@/components/premium/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { ModeToggle } from "@/components/ModeToggle";
import dynamic from "next/dynamic";
import CookieConsent from "@/components/CookieConsent";
import { DropdownMenuNav } from "@/components/DropdownMenuNav";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { IsPremiumSetter } from "@/components/IsPremiumSetter";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { NoiseBackground } from "@/components/NoiseBackground";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const ConditionalPH = dynamic(() => import("@/components/ConditionalPH"));

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unearthed - Past insights, new revelations",
  description:
    "Free, open-source tool to retrieve, sync, and reflect on your Amazon Kindle highlights, quotes, notes, and books. Receive Daily Reflection. Search, tag, and connect your insights across platforms. Notion, Obsidian, Capacities.",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png" }],
    apple: [{ url: "/apple-icon.png" }],
    shortcut: ["/shortcut-icon.png"],
  },
  keywords: [
    "kindle highlights",
    "digital notes",
    "knowledge management",
    "personal library",
    "daily reflections",
    "open source",
    "productivity tool",
    "notion",
    "capacities kindle",
    "notion kindle",
    "obsidian kindle",
    "kindle integration",
    "kindle to notion",
    "kindle to obsidian",
    "kindle to capacities",
    "capacities integration",
  ],
  openGraph: {
    title: "Unearthed - Past insights, new revelations",
    description:
      "Sync Kindle highlights, receive daily reflections, and seamlessly integrate your insights with other apps. Free and open-source. Notion, Obsidian, Capacities.",
    type: "website",
    url: "https://unearthed.app",
    images: [
      {
        url: "https://unearthed.app/daily-reflection.png",
        width: 1200,
        height: 630,
        alt: "Unearthed app interface showing Kindle highlights and daily reflections. Notion, Obsidian, Capacities.",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId }: { userId: string | null } = await auth();

  let isPremium = false;
  try {
    if (userId) {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      isPremium = user.privateMetadata.isPremium as boolean;
    }
  } catch (error) {
    isPremium = false;
  }

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
            <IsPremiumSetter isPremium={isPremium} />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SignedIn>
                {isPremium ? <NavBarPremium /> : <Navbar />}
              </SignedIn>
              <SignedOut>
                <div className="z-50 fixed mt-2 ml-2 flex space-x-2">
                  <ModeToggle />
                  <DropdownMenuNav />
                  <SignInButton>
                    <Button size="icon">
                      <LogIn />
                    </Button>
                  </SignInButton>
                </div>
              </SignedOut>
              <ConditionalPH>
                <NextSSRPlugin
                  routerConfig={extractRouterConfig(ourFileRouter)}
                />
                {children}
              </ConditionalPH>
              <CookieConsent />
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </QueryClientContextProvider>
    </ClerkProvider>
  );
}
