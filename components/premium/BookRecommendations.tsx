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

import { useState } from "react";
import { Loader2, RefreshCw, Copy, BookX, BookCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

interface Recommendation {
  title: string;
  author: string;
  reason: string;
}

interface BookRecommendationsProps {
  book: { id: string; title: string; author: string } | null;
  type: "similar" | "contrasting";
}

export function BookRecommendations({ book, type }: BookRecommendationsProps) {
  const [isRecommendationsDialogOpen, setIsRecommendationsDialogOpen] =
    useState(false);
  const [isGettingRecommendations, setIsGettingRecommendations] =
    useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const handleGetRecommendations = async (forceRefresh: boolean = false) => {
    if (!book) return;
    setIsGettingRecommendations(true);

    try {
      if (!forceRefresh) {
        const storedRecommendations = sessionStorage.getItem(
          `recommendations-${type}-${book.id}`
        );

        if (storedRecommendations) {
          const parsedRecommendations = JSON.parse(storedRecommendations);
          setRecommendations(parsedRecommendations);
          setIsRecommendationsDialogOpen(true);
          setIsGettingRecommendations(false);
          return;
        }
      }

      // If forcing refresh or no stored recommendations, fetch new ones
      const endpoint =
        type === "similar"
          ? "/api/book-recommendations-similar"
          : "/api/book-recommendations-contrasting";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceId: book.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const { recommendations: recs } = await response.json();

      setRecommendations(recs);
      sessionStorage.setItem(
        `recommendations-${type}-${book.id}`,
        JSON.stringify(recs)
      );
      setIsRecommendationsDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error getting recommendations",
        description:
          error instanceof Error
            ? error.message
            : "Failed to get recommendations",
        variant: "destructive",
      });
    } finally {
      setIsGettingRecommendations(false);
    }
  };

  const copyRecommendation = (rec: Recommendation) => {
    const text = `${rec.title} by ${rec.author}\n${rec.reason}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
    });
  };

  const copyAllRecommendations = () => {
    const text = recommendations
      .map((rec) => `${rec.title} by ${rec.author}\n${rec.reason}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    toast({
      title: "All recommendations copied to clipboard",
    });
  };

  const buttonText = type === "similar" ? "Similar" : "Contrasting";
  const tooltipText =
    type === "similar"
      ? "Get book recommendations similar to this book,<br /> based on your quotes, notes, and collection"
      : "Get book recommendations that<br />present opposing viewpoints to this book";

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="brutal"
              onClick={() => handleGetRecommendations(false)}
              disabled={isGettingRecommendations}
              className="w-full p-1"
            >
              {isGettingRecommendations ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : type === "contrasting" ? (
                <BookX className="mr-2 h-4 w-4" />
              ) : (
                <BookCheck className="mr-2 h-4 w-4" />
              )}
              {buttonText}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
            <p dangerouslySetInnerHTML={{ __html: tooltipText }} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog
        open={isRecommendationsDialogOpen}
        onOpenChange={setIsRecommendationsDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader className="flex flex-row justify-between items-center pt-2 text-start">
            <div>
              <DialogTitle>
                {type === "similar" ? "Similar" : "Contrasting"} Book
                Recommendations
              </DialogTitle>
              <DialogDescription>
                {type === "similar"
                  ? `Books with similar themes and ideas to "${book?.title}" by ${book?.author}`
                  : `Books that challenge or present alternative perspectives to "${book?.title}" by ${book?.author}`}
              </DialogDescription>
            </div>
            <Button
              variant="brutal"
              size="sm"
              onClick={async () => {
                if (!book) return;
                setIsGettingRecommendations(true);
                setRecommendations([]);
                // Remove from session storage to force new fetch
                sessionStorage.removeItem(`recommendations-${type}-${book.id}`);
                await handleGetRecommendations(true);
              }}
              disabled={isGettingRecommendations}
            >
              {isGettingRecommendations ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </DialogHeader>
          <ScrollArea
            className="w-full pr-4"
            style={{ maxHeight: "calc(80vh - 120px)" }}
          >
            <div className="space-y-4">
              {recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-4 border-2 rounded-lg relative bg-popover"
                >
                  <div className="flex justify-between">
                    <div className="pr-2">
                      <div className="font-semibold">{rec.title}</div>
                      <div className="text-sm text-muted-foreground">
                        by {rec.author}
                      </div>
                    </div>
                    <Button
                      variant="brutal"
                      size="sm"
                      onClick={() => copyRecommendation(rec)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm mt-2">{rec.reason}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="brutal"
              onClick={() => setIsRecommendationsDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              className="mb-2 md:mb-0"
              variant="brutalprimary"
              onClick={copyAllRecommendations}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
