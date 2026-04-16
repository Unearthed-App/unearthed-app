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
import { SignInButton } from "@clerk/nextjs";
import { LogIn, Menu, X, Home, Shield, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Crimson_Pro } from "next/font/google";

const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

interface NavLink {
  href: string;
  label: string;
  icon?: true;
  bgHint?: string;
  activeBg?: string;
  mobileTextColor?: string;
}

const navLinks: NavLink[] = [
  { href: "/", label: "", icon: true },
  {
    href: "/local",
    label: "Local",
    bgHint:
      "bg-[#f66e1b]/[0.10] hover:bg-[#f66e1b]/[0.20] dark:bg-[#f66e1b]/15 dark:hover:bg-[#f66e1b]/25",
    activeBg: "bg-[#f66e1b]/[0.20] dark:bg-[#f66e1b]/25",
    mobileTextColor: "text-orange-700 dark:text-orange-400",
  },
  {
    href: "/mobile",
    label: "Mobile",
    bgHint:
      "bg-[#7c3aed]/[0.10] hover:bg-[#7c3aed]/[0.20] dark:bg-[#7c3aed]/15 dark:hover:bg-[#7c3aed]/25",
    activeBg: "bg-[#7c3aed]/[0.20] dark:bg-[#7c3aed]/25",
    mobileTextColor: "text-purple-700 dark:text-purple-400",
  },
  {
    href: "/online",
    label: "Online",
    bgHint:
      "bg-[#25b1a6]/[0.10] hover:bg-[#25b1a6]/[0.20] dark:bg-[#25b1a6]/15 dark:hover:bg-[#25b1a6]/25",
    activeBg: "bg-[#25b1a6]/[0.20] dark:bg-[#25b1a6]/25",
    mobileTextColor: "text-teal-700 dark:text-teal-400",
  },
  { href: "/local-docs", label: "Docs", mobileTextColor: "text-foreground" },
  { href: "/privacy", label: "", icon: true },
];

function NavIcon({ href }: { href: string }) {
  if (href === "/") return <Home className="h-4 w-4" />;
  if (href === "/privacy") return <Shield className="h-4 w-4" />;
  return null;
}

export function PublicNavbar() {
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setMobileOpen(false), [pathname]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <>
      {/* Desktop navbar */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:flex justify-center px-4 pt-4"
      >
        <div className="flex items-center gap-0.5 rounded-full border-[3px] border-foreground/80 bg-background/80 px-1.5 py-1.5 shadow-lg shadow-black/[0.03] backdrop-blur-xl dark:border-white/80 dark:bg-background/60 dark:shadow-black/20">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const isIcon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredPath(link.href)}
                onMouseLeave={() => setHoveredPath(null)}
                className="relative"
                aria-label={isIcon ? link.label : undefined}
              >
                <div
                  className={`
                    ${crimsonPro.className} relative z-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200
                    ${isIcon && !link.label ? "h-8 w-8" : "gap-1.5 px-3.5 py-1.5"}
                    ${isActive ? (link.mobileTextColor ?? "text-foreground") : "text-foreground/60 hover:text-foreground"}
                    ${isActive && link.activeBg ? link.activeBg : ""}
                    ${!isActive && !link.bgHint && link.label ? "" : ""}
                    ${!isActive && link.bgHint ? link.bgHint : ""}
                    ${!isActive && !link.bgHint && !link.label ? "hover:bg-foreground/[0.07]" : ""}
                  `}
                >
                  {isIcon && <NavIcon href={link.href} />}
                  {link.label || null}

                  {isActive && !link.activeBg && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-full bg-foreground/[0.07] dark:bg-white/10"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  {hoveredPath === link.href && !isActive && !link.bgHint && (
                    <motion.div
                      layoutId="hoverTab"
                      className="absolute inset-0 rounded-full bg-foreground/[0.05] dark:bg-white/[0.06]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
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

          {/* Sign In */}
          <div className="ml-0.5">
            <SignInButton>
              <button
                className={`${crimsonPro.className} flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-sm font-semibold text-background transition-all duration-200 hover:opacity-90 hover:scale-[1.03] active:scale-95`}
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </motion.nav>

      {/* Mobile navbar */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex md:hidden justify-center px-4 pt-4"
      >
        <div className="flex items-center gap-2 rounded-full border-[3px] border-foreground/80 bg-background/80 px-2 py-1.5 shadow-lg shadow-black/[0.03] backdrop-blur-xl dark:border-white/80 dark:bg-background/60 dark:shadow-black/20">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/[0.05]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <span
            className={`${crimsonPro.className} text-sm font-semibold text-foreground`}
          >
            Unearthed
          </span>

          {/* Mobile theme toggle */}
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

          <SignInButton>
            <button
              className={`${crimsonPro.className} flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-sm font-semibold text-background transition-all duration-200 hover:opacity-90 active:scale-95`}
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign In
            </button>
          </SignInButton>
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
            className="fixed top-[72px] left-0 right-0 z-40 flex justify-center px-4 md:hidden"
          >
            <div className="w-full max-w-sm rounded-2xl border-[3px] border-foreground/80 bg-background/95 p-2 shadow-xl backdrop-blur-xl dark:border-white/80 dark:bg-background/90">
              <div className="flex flex-col gap-0.5">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`${crimsonPro.className} flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200 ${
                        isActive
                          ? `${link.activeBg ?? "bg-foreground/[0.07] dark:bg-white/10"} ${link.mobileTextColor ?? "text-foreground"}`
                          : link.bgHint
                            ? `${link.mobileTextColor ?? "text-foreground"} ${link.bgHint}`
                            : `${link.mobileTextColor ?? "text-muted-foreground"} hover:text-foreground hover:bg-foreground/[0.05]`
                      }`}
                    >
                      {link.icon && (
                        <span className="shrink-0">
                          <NavIcon href={link.href} />
                        </span>
                      )}
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
