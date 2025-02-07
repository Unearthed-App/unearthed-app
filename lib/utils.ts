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

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { z } from "zod";
import { selectQuoteSchema } from "@/db/schema";
type Quote = z.infer<typeof selectQuoteSchema>;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrentBreakPoint(width: number) {
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  };

  let breakpoint;
  breakpoint = "none";
  if (width >= breakpoints.sm && width < breakpoints.md) {
    breakpoint = "sm";
  } else if (width >= breakpoints.md && width < breakpoints.lg) {
    breakpoint = "md";
  } else if (width >= breakpoints.lg && width < breakpoints["2xl"]) {
    breakpoint = "lg";
  } else if (width >= breakpoints["2xl"]) {
    breakpoint = "2xl";
  }

  return breakpoint;
}
export function getTodaysDate(utcOffset: number): string {
  const now = new Date();
  now.setHours(now.getUTCHours() + utcOffset);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getUserUtcOffset(): number {
  // Try to get the offset from the browser if available
  if (typeof window !== "undefined" && window.Intl && Intl.DateTimeFormat) {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = new Date()
      .toLocaleString("en-US", { timeZone, timeStyle: "long" })
      .split("GMT")[1];
    return parseInt(offset.replace(":", "."));
  }

  // Fallback to server-side calculation
  const now = new Date();
  const januaryOffset = new Date(now.getFullYear(), 0, 1).getTimezoneOffset();
  const julyOffset = new Date(now.getFullYear(), 6, 1).getTimezoneOffset();
  const standardOffset = Math.max(januaryOffset, julyOffset);

  return -standardOffset / 60;
}

export function splitArray<T>(array: T[] | undefined, parts: number): T[][] {
  if (!Array.isArray(array) || array.length === 0) {
    return new Array(parts).fill([]);
  }
  const result: T[][] = [];
  const itemsPerPart = Math.ceil(array.length / parts);
  for (let i = 0; i < array.length; i += itemsPerPart) {
    result.push(array.slice(i, i + itemsPerPart));
  }
  return result;
}

export async function getIsPremium() {
  const isPremium = localStorage.getItem("isPremium");
  return isPremium === "true" ? true : false;
}

export function extractNumber(str: string) {
  if (typeof str !== "string") {
    return NaN;
  }

  const numStr = str.replace(/\D/g, "");
  if (numStr === "") {
    return NaN;
  }

  return parseInt(numStr, 10);
}

export function sortQuotes(quotes: Quote[]) {
  return [...quotes].sort((a, b) => {
    const aLoc = a.location || "";
    const bLoc = b.location || "";

    const aNum = extractNumber(aLoc);
    const bNum = extractNumber(bLoc);

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    } else if (isNaN(aNum) && !isNaN(bNum)) {
      return 1;
    } else if (!isNaN(aNum) && isNaN(bNum)) {
      return -1;
    }

    return aLoc.localeCompare(bLoc);
  });
}

export function generateUUID() {
  let dt = new Date().getTime();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}
