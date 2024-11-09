import { Badge } from "@/components/ui/badge";
import { Copy, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { deleteQuote } from "@/server/actions-premium";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useState } from "react";

interface QuoteCardProps {
  onQuoteDeleted: () => void;
  bookTitle: string;
  bookAuthor: string;
  quote: string;
  note?: string;
  location: string;
  color: string;
  id: string;
  origin: string;
}

const colorLookup = {
  grey: {
    foreground: "bg-neutral-300 dark:bg-neutral-500 bg-opacity-100",
    background: "bg-neutral-300 bg-opacity-10",
    text: "text-neutral-700 dark:text-neutral-100",
    line: "border-black dark:border-neutral-500",
    shadow: "",
    border: "border-2 border-black dark:border-white",
    buttonShadow:
      "shadow-[2px_2px_0px_rgba(100,100,100,1)] hover:shadow-[1px_1px_0px_rgba(100,100,100,1)] active:shadow-[0px_0px_0px_rgba(100,100,100,1)]",
    buttonShadowDark:
      "dark:border-black dark:shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] dark:active:shadow-[0px_0px_0px_rgba(0,0,0,1)]",
  },
  yellow: {
    foreground: "bg-yellow-300 dark:bg-yellow-500 bg-opacity-100",
    background: "bg-yellow-600 bg-opacity-10",
    text: "text-yellow-900 dark:text-yellow-100",
    line: "border-yellow-500 dark:border-yellow-500",
    shadow: "shadow-yellow-500/10 dark:shadow-yellow-700/10",
    border: "border-2 border-yellow-500 dark:border-yellow-500",
    buttonShadow:
      "border-yellow-500 shadow-[2px_2px_0px_rgba(234,179,8,1)] hover:shadow-[1px_1px_0px_rgba(234,179,8,1)] active:shadow-[0px_0px_0px_rgba(234,179,8,1)]",
    buttonShadowDark:
      "dark:border-black dark:shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] dark:active:shadow-[0px_0px_0px_rgba(0,0,0,1)]",
  },
  blue: {
    foreground: "bg-blue-300 dark:bg-blue-500 bg-opacity-100",
    background: "bg-blue-600 bg-opacity-10",
    text: "text-blue-900 dark:text-blue-100",
    line: "border-blue-500 dark:border-blue-500",
    shadow: "shadow-blue-500/10 dark:shadow-blue-700/10",
    border: "border-2 border-blue-500 dark:border-blue-500",
    buttonShadow:
      "border-blue-500 shadow-[2px_2px_0px_rgba(59,130,246,1)] hover:shadow-[1px_1px_0px_rgba(59,130,246,1)] active:shadow-[0px_0px_0px_rgba(59,130,246,1)]",
    buttonShadowDark:
      "dark:border-black dark:shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] dark:active:shadow-[0px_0px_0px_rgba(0,0,0,1)]",
  },
  pink: {
    foreground: "bg-pink-300 dark:bg-pink-500 bg-opacity-100",
    background: "bg-pink-600 bg-opacity-10",
    text: "text-pink-900 dark:text-pink-100",
    line: "border-pink-500 dark:border-pink-500",
    shadow: "shadow-pink-500/10 dark:shadow-pink-700/10",
    border: "border-2 border-pink-500 dark:border-pink-500",
    buttonShadow:
      "border-pink-500 shadow-[2px_2px_0px_rgba(236,72,153,1)] hover:shadow-[1px_1px_0px_rgba(236,72,153,1)] active:shadow-[0px_0px_0px_rgba(236,72,153,1)]",
    buttonShadowDark:
      "dark:border-black dark:shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] dark:active:shadow-[0px_0px_0px_rgba(0,0,0,1)]",
  },
  orange: {
    foreground: "bg-orange-300 dark:bg-orange-500 bg-opacity-100",
    background: "bg-orange-600 bg-opacity-10",
    text: "text-orange-900 dark:text-orange-100",
    line: "border-orange-500 dark:border-orange-500",
    shadow: "shadow-orange-500/10 dark:shadow-orange-700/10",
    border: "border-2 border-orange-500 dark:border-orange-500",
    buttonShadow:
      "border-orange-500 shadow-[2px_2px_0px_rgba(249,115,22,1)] hover:shadow-[1px_1px_0px_rgba(249,115,22,1)] active:shadow-[0px_0px_0px_rgba(249,115,22,1)]",
    buttonShadowDark:
      "dark:border-black dark:shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] dark:active:shadow-[0px_0px_0px_rgba(0,0,0,1)]",
  },
} as const;

type ColorKey = keyof typeof colorLookup;

export function QuoteCardBrutal({
  onQuoteDeleted,
  bookTitle,
  bookAuthor,
  quote,
  note,
  location,
  color,
  id,
  origin,
}: QuoteCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const removeQuote = async () => {
    try {
      await deleteQuote({ quoteId: id });
      toast({
        title: "Quote deleted",
        description: "",
      });
      onQuoteDeleted();
    } catch (error) {
      toast({
        title: "Sorry",
        description: "Something went wrong. Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col justify-between">
      <div>
        <div
          className={`shadow-xl ${colorScheme.shadow} ${colorScheme.border} h-full p-4 flex ${colorScheme.background} rounded-lg relative py-8 `}
        >
          <div className={`border-l-4 ${colorScheme.line} pl-4 h-full`}>
            <div className="z-20 -mt-6 mr-2 right-0 absolute flex space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className={`z-50 w-6 h-6 p-1 ${colorScheme.background} ${colorScheme.buttonShadow} ${colorScheme.buttonShadowDark}`}
                      onClick={copyQuote}
                      size="tiny"
                    >
                      <Copy />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                    <p>Copy the Quote</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {origin == "UNEARTHED" && (
                <ConfirmationDialog
                  isOpen={isDialogOpen}
                  onOpenChange={(open) => {
                    setIsDialogOpen(open);
                  }}
                  onConfirm={removeQuote}
                  title="Delete Quote"
                  description={`Are you sure you want to delete this quote? This action cannot be undone.`}
                  confirmText="Yes"
                  cancelText="Cancel"
                >
                  <AlertDialogTrigger asChild>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className={`w-6 h-6 p-1 ${colorScheme.background} ${colorScheme.buttonShadow} ${colorScheme.buttonShadowDark} hover:bg-destructive dark:hover:bg-destructive`}
                            onClick={() => setIsDialogOpen(true)}
                            size="tiny"
                          >
                            <Trash />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                          <p>Delete the Quote</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </AlertDialogTrigger>
                </ConfirmationDialog>
              )}
            </div>

            <p
              className={`whitespace-pre-wrap text-sm md:text-base ${colorScheme.text}`}
            >
              {quote}
            </p>
          </div>
        </div>
        <div className="relative -top-6 right-4 flex justify-end py-2">
          <Badge className="z-0 " variant="brutal">
            {location}
          </Badge>
        </div>
        {note && (
          <div className="-mt-10 flex my-2 px-8">
            <p className="ml-2 text-sm text-muted-foreground pt-2 whitespace-pre-wrap">
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