import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

  return `${year}/${month}/${day}`;
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
