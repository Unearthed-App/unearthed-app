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

"use client";

import { Button } from "@/components/ui/button";
import { User, Crown, Home, LogOut, Download, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { SignOutButton, SignedIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { getIsPremium } from "@/lib/utils";

interface NonPremiumNavigationProps {
  className?: string;
  currentPage?: "home" | "local" | "premium" | "profile";
}

export function NonPremiumNavigation({
  className = "",
  currentPage,
}: NonPremiumNavigationProps) {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      try {
        const premiumStatus = await getIsPremium();
        setIsPremium(premiumStatus);
      } catch (error) {
        setIsPremium(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPremiumStatus();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Don't render anything while loading or if user is premium
  if (isLoading || isPremium) {
    return null;
  }

  return (
    <SignedIn>
      <div className={`max-w-6xl mx-auto mb-8 ${className}`}>
        <nav
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Left side - Home link */}
          <Link
            href="/"
            className={`flex items-center px-3 py-2 md:px-4 md:py-2 border-2 transition-colors text-sm md:text-base touch-manipulation min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md ${
              currentPage === "home"
                ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black"
                : "border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black focus:ring-black dark:focus:ring-white"
            }`}
            aria-label="Go to home page"
          >
            <Home className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>Home</span>
          </Link>

          {/* Right side - Navigation links */}
          <div
            className="flex flex-wrap gap-2 md:gap-4"
            role="group"
            aria-label="User actions"
          >
            <Link
              href="/dashboard/user-profile"
              className={`flex items-center px-3 py-2 md:px-4 md:py-2 border-2 transition-colors text-sm md:text-base touch-manipulation min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md ${
                currentPage === "profile"
                  ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black"
                  : "border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black focus:ring-black dark:focus:ring-white"
              }`}
              aria-label="Go to user profile"
            >
              <User className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Profile</span>
            </Link>

            <Link
              href="/local"
              className={`flex items-center px-3 py-2 md:px-4 md:py-2 border-2 transition-colors text-sm md:text-base touch-manipulation min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md ${
                currentPage === "local"
                  ? "border-green-600 dark:border-green-500 bg-green-600 dark:bg-green-500 text-white"
                  : "border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 hover:bg-green-600 dark:hover:bg-green-500 hover:text-white focus:ring-green-600 dark:focus:ring-green-500"
              }`}
              aria-label="Learn about Unearthed Local app"
            >
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Local App</span>
            </Link>

            <Link
              href="/dashboard/get-premium"
              className={`flex items-center px-3 py-2 md:px-4 md:py-2 border-2 transition-colors text-sm md:text-base touch-manipulation min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md ${
                currentPage === "premium"
                  ? "border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white"
                  : "border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white focus:ring-blue-600 dark:focus:ring-blue-500"
              }`}
              aria-label="Get Unearthed Online subscription"
            >
              <Crown className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Get Online</span>
            </Link>

            {/* Dark Mode Toggle */}
            {mounted && (
              <Button
                onClick={toggleTheme}
                variant="outline"
                className="flex items-center px-3 py-2 md:px-4 md:py-2 border-2 border-gray-600 dark:border-gray-400 text-gray-600 dark:text-gray-400 hover:bg-gray-600 dark:hover:bg-gray-400 hover:text-white dark:hover:text-black transition-colors text-sm md:text-base touch-manipulation min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 dark:focus:ring-gray-400 rounded-md"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="sr-only">
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </span>
              </Button>
            )}

            {/* Logout Button */}
            <SignOutButton>
              <Button
                variant="outline"
                className="flex items-center px-3 py-2 md:px-4 md:py-2 border-2 border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white transition-colors text-sm md:text-base touch-manipulation min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 dark:focus:ring-red-500 rounded-md"
                aria-label="Sign out of your account"
              >
                <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Logout</span>
              </Button>
            </SignOutButton>
          </div>
        </nav>
      </div>
    </SignedIn>
  );
}
