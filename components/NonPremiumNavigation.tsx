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

"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, SignedIn } from "@clerk/nextjs";
import { User, Crown, Home, LogOut, Download, Sun, Moon, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Crimson_Pro } from "next/font/google";

const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

interface NonPremiumNavigationProps {
  className?: string;
  currentPage?: "home" | "local" | "online" | "premium" | "profile";
}

const navLinks = [
  {
    href: "/",
    label: "Home",
    Icon: Home,
    bgHint: "",
    activeBg: "bg-foreground/[0.07] dark:bg-white/10",
    mobileTextColor: "text-foreground",
  },
  {
    href: "/dashboard/user-profile",
    label: "Profile",
    Icon: User,
    bgHint: "",
    activeBg: "bg-foreground/[0.07] dark:bg-white/10",
    mobileTextColor: "text-foreground",
  },
  {
    href: "/local",
    label: "Local",
    Icon: Download,
    bgHint:
      "bg-[#f66e1b]/[0.10] hover:bg-[#f66e1b]/[0.20] dark:bg-[#f66e1b]/15 dark:hover:bg-[#f66e1b]/25",
    activeBg: "bg-[#f66e1b]/[0.20] dark:bg-[#f66e1b]/25",
    mobileTextColor: "text-orange-700 dark:text-orange-400",
  },
];

export function NonPremiumNavigation({
  className = "",
}: NonPremiumNavigationProps) {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      try {
        const response = await fetch("/api/auth/premium-status");
        const data = await response.json();
        setIsPremium(data.isPremium || false);
      } catch (error) {
        console.error("Error fetching premium status:", error);
        setIsPremium(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPremiumStatus();
  }, []);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/stripe-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (isLoading || isPremium) return null;

  return (
    <SignedIn>
      {/* Desktop navbar */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 hidden md:flex justify-center px-4 pt-4 ${className}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-0.5 rounded-full border-[3px] border-foreground/80 bg-background/80 px-1.5 py-1.5 shadow-lg shadow-black/[0.03] backdrop-blur-xl dark:border-white/80 dark:bg-background/60 dark:shadow-black/20">
          {navLinks.map(({ href, label, Icon, bgHint, activeBg, mobileTextColor }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="relative"
                aria-label={label}
              >
                <div
                  className={`
                    ${crimsonPro.className} relative z-10 flex items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-200
                    ${isActive ? mobileTextColor : "text-foreground/60 hover:text-foreground"}
                    ${isActive && activeBg ? activeBg : ""}
                    ${!isActive && bgHint ? bgHint : ""}
                    ${!isActive && !bgHint ? "hover:bg-foreground/[0.07]" : ""}
                  `}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                  {isActive && !activeBg.includes("f66e1b") && (
                    <motion.div
                      layoutId="nonPremiumActiveTab"
                      className="absolute inset-0 rounded-full bg-foreground/[0.07] dark:bg-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </div>
              </Link>
            );
          })}

          {/* Separator */}
          <div className="mx-0.5 h-5 w-px bg-foreground/15" />

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="relative flex h-8 w-8 items-center justify-center rounded-full text-foreground/50 transition-all duration-200 hover:text-foreground hover:bg-foreground/[0.07]"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
            </button>
          )}

          {/* Get Online CTA */}
          <button
            onClick={handleCheckout}
            className={`${crimsonPro.className} ml-0.5 flex items-center gap-1.5 rounded-full bg-[#25b1a6] px-3.5 py-1.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.03] active:scale-95`}
            aria-label="Get Unearthed Online"
          >
            <Crown className="h-3.5 w-3.5" />
            Get Online
          </button>

          {/* Logout */}
          <SignOutButton>
            <button
              className={`${crimsonPro.className} ml-0.5 flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-sm font-semibold text-background transition-all duration-200 hover:opacity-90 hover:scale-[1.03] active:scale-95`}
              aria-label="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </SignOutButton>
        </div>
      </motion.nav>

      {/* Mobile navbar */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex md:hidden justify-center px-4 pt-4"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-2 rounded-full border-[3px] border-foreground/80 bg-background/80 px-2 py-1.5 shadow-lg shadow-black/[0.03] backdrop-blur-xl dark:border-white/80 dark:bg-background/60 dark:shadow-black/20">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/[0.05]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <span className={`${crimsonPro.className} text-sm font-semibold text-foreground`}>
            Unearthed
          </span>

          {mounted && (
            <button
              onClick={toggleTheme}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground hover:bg-foreground/[0.05]"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
            </button>
          )}

          <button
            onClick={handleCheckout}
            className={`${crimsonPro.className} flex items-center gap-1.5 rounded-full bg-[#25b1a6] px-3 py-1.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95`}
          >
            <Crown className="h-3.5 w-3.5" />
            Get Online
          </button>
        </div>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-[72px] left-0 right-0 z-50 flex justify-center px-4 md:hidden"
          >
            <div className="w-full max-w-sm rounded-2xl border-[3px] border-foreground/80 bg-background/95 p-2 shadow-xl backdrop-blur-xl dark:border-white/80 dark:bg-background/90">
              <div className="flex flex-col gap-0.5">
                {navLinks.map(({ href, label, Icon, bgHint, activeBg, mobileTextColor }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`${crimsonPro.className} flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200 ${
                        isActive
                          ? `${activeBg} ${mobileTextColor}`
                          : bgHint
                            ? `${mobileTextColor} ${bgHint}`
                            : `${mobileTextColor ?? "text-muted-foreground"} hover:text-foreground hover:bg-foreground/[0.05]`
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {label}
                    </Link>
                  );
                })}

                <SignOutButton>
                  <button
                    className={`${crimsonPro.className} flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all duration-200`}
                  >
                    <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Logout
                  </button>
                </SignOutButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </SignedIn>
  );
}
