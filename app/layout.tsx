import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import QueryClientContextProvider from "@/components/QueryClientContextProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { ModeToggle } from "@/components/ModeToggle";
import dynamic from "next/dynamic";
import CookieConsent from "@/components/CookieConsent";
import { DropdownMenuNav } from "@/components/DropdownMenuNav";

const ConditionalPH = dynamic(() => import("@/components/ConditionalPH"), {
  ssr: false,
});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unearthed - Your Personal Knowledge Curator",
  description:
    "Unearthed: Free, open-source tool to retrieve, sync, and reflect on your Amazon Kindle highlights, quotes, notes, and books. Search, tag, and connect your insights across platforms.",
  keywords: [
    "Kindle highlights",
    "digital notes",
    "knowledge management",
    "personal library",
    "daily reflections",
    "open source",
    "productivity tool",
  ],
  openGraph: {
    title: "Unearthed - Rediscover Your Digital Wisdom",
    description:
      "Sync Kindle highlights, receive daily reflections, and seamlessly integrate your insights with other apps. Free and open-source.",
    type: "website",
    url: "https://unearthed.app",
    images: [
      {
        url: "https://unearthed.app/daily-reflection.png",
        width: 1200,
        height: 630,
        alt: "Unearthed app interface showing Kindle highlights and daily reflections",
      },
    ],
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
          <body className={poppins.className + " h-full"}>
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
                <div className="fixed mt-2 ml-2 flex space-x-2">
                  <ModeToggle />
                  <DropdownMenuNav />
                </div>
              </SignedOut>
              <ConditionalPH>{children}</ConditionalPH>
              <CookieConsent />
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </QueryClientContextProvider>
    </ClerkProvider>
  );
}
