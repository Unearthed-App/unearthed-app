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

import type { Metadata } from "next";
import { SITE_URL, noIndex } from "@/lib/seo";
import { Poppins } from "next/font/google";
import QueryClientContextProvider from "@/components/QueryClientContextProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
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
import NextTopLoader from "nextjs-toploader";

const ConditionalPH = dynamic(() => import("@/components/ConditionalPH"));

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Unearthed",
  description: "Reading highlights, remembered.",
  robots: noIndex,
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
        <html lang="en" className="h-full" suppressHydrationWarning>
          <body className={poppins.className + " h-full"}>
            <NoiseBackground />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NextTopLoader
                color="#f24053"
                height={4}
                showSpinner={false}
                shadow={false}
              />
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
