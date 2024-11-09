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

const ConditionalPH = dynamic(() => import("@/components/ConditionalPH"), {
  ssr: false,
});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unearthed - Lost wisdom, found again",
  description:
    "Free, open-source tool to retrieve, sync, and reflect on your Amazon Kindle highlights, quotes, notes, and books. Search, tag, and connect your insights across platforms. Notion, Obsidian, Capacities.",
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
    title: "Unearthed - Lost wisdom, found again",
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
  const { userId }: { userId: string | null } = auth();

  let isPremium = false;
  try {
    if (userId) {
      const user = await clerkClient().users.getUser(userId);
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
                <Navbar />
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
