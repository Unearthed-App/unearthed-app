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

import { Badge } from "@/components/ui/badge";

import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy } from "lucide-react";

interface QuoteCardProps {
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  quote: string;
  note?: string;
  location: string;
  color: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const colorLookup = {
  grey: {
    foreground: "bg-neutral-300 dark:bg-neutral-500 bg-opacity-100",
    background: "bg-neutral-300 bg-opacity-10",
    text: "text-neutral-700 dark:text-neutral-100",
    line: "border-black dark:border-neutral-500",
    shadow: "",
    border: "border-2 border-black dark:border-white",
  },
  yellow: {
    foreground: "bg-yellow-300 dark:bg-yellow-500 bg-opacity-100",
    background: "bg-yellow-600 bg-opacity-10",
    text: "text-yellow-900 dark:text-yellow-100",
    line: "border-yellow-500 dark:border-yellow-500",
    shadow: "shadow-yellow-500/10 dark:shadow-yellow-700/10",
    border: "border-2 border-yellow-500 dark:border-yellow-500",
  },
  blue: {
    foreground: "bg-blue-300 dark:bg-blue-500 bg-opacity-100",
    background: "bg-blue-600 bg-opacity-10",
    text: "text-blue-900 dark:text-blue-100",
    line: "border-blue-500 dark:border-blue-500",
    shadow: "shadow-blue-500/10 dark:shadow-blue-700/10",
    border: "border-2 border-blue-500 dark:border-blue-500",
  },
  pink: {
    foreground: "bg-pink-300 dark:bg-pink-500 bg-opacity-100",
    background: "bg-pink-600 bg-opacity-10",
    text: "text-pink-900 dark:text-pink-100",
    line: "border-pink-500 dark:border-pink-500",
    shadow: "shadow-pink-500/10 dark:shadow-pink-700/10",
    border: "border-2 border-pink-500 dark:border-pink-500",
  },
  orange: {
    foreground: "bg-orange-300 dark:bg-orange-500 bg-opacity-100",
    background: "bg-orange-600 bg-opacity-10",
    text: "text-orange-900 dark:text-orange-100",
    line: "border-orange-500 dark:border-orange-500",
    shadow: "shadow-orange-500/10 dark:shadow-orange-700/10",
    border: "border-2 border-orange-500 dark:border-orange-500",
  },
  red: {
    foreground: "bg-red-300 dark:bg-red-500 bg-opacity-100",
    background: "bg-red-600 bg-opacity-10",
    text: "text-red-900 dark:text-red-100",
    line: "border-red-500 dark:border-red-500",
    shadow: "shadow-red-500/10 dark:shadow-red-700/10",
    border: "border-2 border-red-500 dark:border-red-500",
  },
  green: {
    foreground: "bg-green-300 dark:bg-green-500 bg-opacity-100",
    background: "bg-green-600 bg-opacity-10",
    text: "text-green-900 dark:text-green-100",
    line: "border-green-500 dark:border-green-500",
    shadow: "shadow-green-500/10 dark:shadow-green-700/10",
    border: "border-2 border-green-500 dark:border-green-500",
  },
  olive: {
    foreground: "bg-lime-300 dark:bg-lime-500 bg-opacity-100",
    background: "bg-lime-600 bg-opacity-10",
    text: "text-lime-900 dark:text-lime-100",
    line: "border-lime-500 dark:border-lime-500",
    shadow: "shadow-lime-500/10 dark:shadow-lime-700/10",
    border: "border-2 border-lime-500 dark:border-lime-500",
  },
  cyan: {
    foreground: "bg-cyan-300 dark:bg-cyan-500 bg-opacity-100",
    background: "bg-cyan-600 bg-opacity-10",
    text: "text-cyan-900 dark:text-cyan-100",
    line: "border-cyan-500 dark:border-cyan-500",
    shadow: "shadow-cyan-500/10 dark:shadow-cyan-700/10",
    border: "border-2 border-cyan-500 dark:border-cyan-500",
  },
  purple: {
    foreground: "bg-purple-300 dark:bg-purple-500 bg-opacity-100",
    background: "bg-purple-600 bg-opacity-10",
    text: "text-purple-900 dark:text-purple-100",
    line: "border-purple-500 dark:border-purple-500",
    shadow: "shadow-purple-500/10 dark:shadow-purple-700/10",
    border: "border-2 border-purple-500 dark:border-purple-500",
  },
  gray: {
    foreground: "bg-neutral-300 dark:bg-neutral-500 bg-opacity-100",
    background: "bg-neutral-300 bg-opacity-10",
    text: "text-neutral-700 dark:text-neutral-100",
    line: "border-black dark:border-neutral-500",
    shadow: "",
    border: "border-2 border-black dark:border-white",
  },
} as const;

type ColorKey = keyof typeof colorLookup;

export function QuoteBookCardBrutal({
  bookId,
  bookTitle,
  bookAuthor,
  quote,
  note,
  location,
  color,
  setOpen,
}: QuoteCardProps) {
  const matchingColor = Object.keys(colorLookup).find((key) =>
    color.toLowerCase().includes(key)
  ) as ColorKey | undefined;

  const colorScheme = colorLookup[matchingColor || "grey"];

  const copyQuote = () => {
    let textCopied = `"${quote}"`;

    if (bookTitle || bookAuthor) {
      textCopied += " — ";
    }

    if (bookTitle) {
      textCopied += `${bookTitle}`;
    }

    if (bookAuthor && bookAuthor != bookTitle) {
      textCopied += `, ${bookAuthor}`;
    }
    navigator.clipboard.writeText(textCopied);
    toast({
      title: "Text Copied to Clipboard",
      description: textCopied,
    });
  };

  return (
    <div className="flex flex-col justify-between">
      <div>
        <div
          className={`shadow-xl ${colorScheme.shadow} ${colorScheme.border} h-full p-4 flex ${colorScheme.background} rounded-lg relative py-8`}
        >
          <div className={`border-l-4 ${colorScheme.line} pl-4 h-full`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={copyQuote}
                    className={`z-40 cursor-pointer -mt-6 mr-2 right-0 absolute w-6 h-6 p-1 ${colorScheme.border} ${colorScheme.background} flex items-center justify-center rounded-lg hover:bg-primary/90`}
                  >
                    <Copy />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                  <p>Copy the Quote</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className={`text-sm md:text-base ${colorScheme.text}`}>
              {quote}
            </p>
          </div>
        </div>

        <div className="relative -top-6 flex justify-between py-2">
          <div className="ml-4">
            <Link
              href={`/premium/book/${bookId}`}
              className="w-full text-lg block"
              onClick={(e) => {
                setOpen(false);
              }}
            >
              <Badge className="z-0" variant="brutalinvert">
                {bookTitle}
              </Badge>{" "}
            </Link>
          </div>
          <div className="mr-4">
            <Badge className="z-0" variant="brutal">
              {location}
            </Badge>
          </div>
        </div>
        {note && (
          <div className="-mt-10 flex my-2 px-8">
            <p className="ml-2 text-sm text-muted-foreground pt-2">
              <span className="text-sm md:text-base font-bold text-secondary">
                Notes:{" "}
              </span>
              {note}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
