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
    const textCopied = `"${quote}" — ${bookTitle}, ${bookAuthor}`;
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
                    className={`cursor-pointer -mt-6 mr-2 right-0 absolute w-6 h-6 p-1 bordersdf-2 ${colorScheme.border} ${colorScheme.background} flex items-center justify-center rounded-lg hover:bg-primary/90`}
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
