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

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unearthed",
  description: "Unearthed",
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
                <div className="fixed mt-2 ml-2">
                  <ModeToggle />
                </div>
              </SignedOut>
              {children}
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </QueryClientContextProvider>
    </ClerkProvider>
  );
}