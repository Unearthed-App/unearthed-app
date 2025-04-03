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
import { Copy, Trash, Plus, Loader2, Tag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import {
  createTagsFromIdeas,
  deleteQuote,
  updateQuoteTags,
} from "@/server/actions-premium";
import { useQueryClient } from "@tanstack/react-query";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ApplyTagGloballyDialog } from "./ApplyTagGloballyDialog";
import Highlighter from "react-highlight-words";

interface QuoteCardProps {
  onQuoteDeleted?: () => void;
  sourceId?: string;
  bookTitle: string;
  bookAuthor: string;
  quote: string;
  note?: string;
  location: string;
  color: string;
  id: string;
  origin: string;
  tags?: { id: string; title: string }[];
  existingTags?: { id: string; title: string }[];
  hideTags?: boolean;
  onCreateNewTag?: (quoteId: string) => void;
  showSource?: boolean;
  hideManualTag?: boolean;
  onTagsUpdating?: () => void;
  onTagsFinishedUpdating?: () => void;
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
  sourceId = "",
  bookTitle,
  bookAuthor,
  quote,
  note,
  location,
  color = "grey",
  id,
  origin,
  tags = [],
  existingTags = [],
  hideTags = false,
  onCreateNewTag,
  showSource = false,
  hideManualTag = false,
  onTagsUpdating,
  onTagsFinishedUpdating,
}: Omit<QuoteCardProps, "onTextTagged">) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagsUpdating, setTagsUpdating] = useState(false);
  const [newlyCreatedTag, setNewlyCreatedTag] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [selection, setSelection] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Prepare the list of words to highlight
  const wordsToHighlight = tags.map((tag) => tag.title);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (
      !selection ||
      selection.isCollapsed ||
      (!quoteRef.current && !noteRef.current)
    ) {
      setSelection(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString().trim();

    // Check if selection is within quote or note container
    const isInQuote = quoteRef.current?.contains(selection.anchorNode);
    const isInNote = noteRef.current?.contains(selection.anchorNode);

    if (selectedText && (isInQuote || isInNote)) {
      const containerRect = (
        isInQuote ? quoteRef.current : noteRef.current
      )?.getBoundingClientRect();
      const rect = range.getBoundingClientRect();

      if (containerRect) {
        const x = rect.left - containerRect.left + rect.width / 2;
        const y = rect.top - containerRect.top + rect.height + 10;

        setSelection({
          text: selectedText,
          x,
          y,
        });
      }
    } else {
      setSelection(null);
    }
  };

  useEffect(() => {
    // Add mousemove and mouseup listeners to handle selection updates
    const handleMouseMove = () => {
      if (window.getSelection()?.toString().trim()) {
        handleTextSelection();
      }
    };

    const handleMouseUp = () => {
      handleTextSelection();
    };

    document.addEventListener("selectionchange", handleTextSelection);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("selectionchange", handleTextSelection);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleTagClick = async () => {
    if (!selection || !sourceId) return;
    onTagsUpdating?.();

    setTagsUpdating(true);
    try {
      const result = await createTagsFromIdeas(sourceId, [
        {
          tag: selection.text.trim(),
          description: "",
          quoteIds: [id],
        },
      ]);

      await queryClient.invalidateQueries({ queryKey: ["book"] });

      // Set the newly created tag
      if (result && result.success) {
        setNewlyCreatedTag({
          id: result.tags[0].id,
          title: selection.text.trim(),
        });
      }

      toast({
        title: "Tag created",
        description: "New tag has been created from selected text",
      });

      setSelection(null);
      window.getSelection()?.removeAllRanges();
    } catch (error) {
      toast({
        title: "Error creating tag",
        description: "Failed to create tag from selected text",
        variant: "destructive",
      });
    } finally {
      setTagsUpdating(false);
      // onTagsFinishedUpdating?.();
    }
  };

  const handleTagsUpdate = async (tagIds: string[], removing?: boolean) => {
    setTagsUpdating(true);
    onTagsUpdating?.(); // Notify parent that tags update is starting

    try {
      await updateQuoteTags(id, tagIds);

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["book"] });
      queryClient.invalidateQueries({ queryKey: ["tag-details"] });

      toast({
        title: "Tags updated",
        description: "Quote tags have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error updating tags",
        description: "Failed to update quote tags",
        variant: "destructive",
      });
    } finally {
      setTagsUpdating(false);
      onTagsFinishedUpdating?.();
    }
  };

  const matchingColor = Object.keys(colorLookup).find((key) =>
    (color || "").toLowerCase().includes(key)
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
      onQuoteDeleted?.();
    } catch (error) {
      toast({
        title: "Sorry",
        description: "Something went wrong. Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col">
      {!hideTags && (
        <div className="pb-1 mt-2 space-y-2">
          <div className="flex flex-wrap gap-1 items-center">
            {!hideManualTag && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2"
                onClick={() => setIsAddingTag(!isAddingTag)}
                disabled={tagsUpdating}
              >
                {tagsUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Tag className="h-4 w-4" />
                )}
              </Button>
            )}
            {tags.map((tag) => (
              <TooltipProvider key={tag.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="brutalinvertsmall"
                      className={`cursor-pointer hover:bg-red-500 ${
                        tagsUpdating ? "opacity-50" : ""
                      }`}
                      onClick={() => {
                        if (!tagsUpdating) {
                          const newTagIds = tags
                            .filter((t) => t.id !== tag.id)
                            .map((t) => t.id);
                          handleTagsUpdate(newTagIds, true);
                        }
                      }}
                    >
                      {tag.title}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                    <p>Click to remove this tag</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          {isAddingTag && (
            <Select
              onValueChange={async (value) => {
                if (value === "create-new") {
                  onCreateNewTag?.(id);
                } else {
                  const newTagIds = [...tags.map((t) => t.id), value];
                  handleTagsUpdate(newTagIds);
                }
                setIsAddingTag(false);
              }}
              disabled={tagsUpdating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent>
                {existingTags
                  .filter((tag) => !tags.find((t) => t.id === tag.id))
                  .map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.title}
                    </SelectItem>
                  ))}
                <SelectItem value="create-new">
                  <Plus className="h-4 w-4 mr-2 inline-block" />
                  Create New Tag
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      )}
      <div className="flex flex-col justify-between">
        <div>
          <div
            ref={quoteRef}
            className={`shadow-xl ${colorScheme.shadow} ${colorScheme.border} h-full p-4 flex ${colorScheme.background} rounded-lg relative py-8`}
          >
            {newlyCreatedTag && (
              <div className="absolute top-0 left-0 w-full h-full bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
                <div className="border-2 bg-background p-2 rounded-lg shadow-lg max-w-md w-full">
                  <ApplyTagGloballyDialog
                    tagId={newlyCreatedTag.id}
                    tagTitle={newlyCreatedTag.title}
                    onDismiss={() => {
                      setNewlyCreatedTag(null);
                      onTagsFinishedUpdating?.();
                    }}
                  />
                </div>
              </div>
            )}
            {tagsUpdating && (
              <div className="absolute top-0 left-0 w-full h-full bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <p className="text-sm font-semibold select-none">
                    Updating tags...
                  </p>
                </div>
              </div>
            )}
            {!tagsUpdating &&
              sourceId &&
              selection &&
              !hideTags &&
              !noteRef.current?.contains(
                window.getSelection()?.anchorNode!
              ) && (
                <div
                  style={{
                    position: "absolute",
                    left: `${selection.x - 6}px`,
                    top: `${selection.y}px`,
                    transform: "translateX(-50%)",
                    zIndex: 50,
                  }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-alternate h-6 w-6 rounded-full bg-card border-2 border-black"
                          onClick={handleTagClick}
                        >
                          <Tag className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                        <p>Tag this text</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            <div
              className={`border-l-4 ${colorScheme.line} pl-4 h-full w-full`}
            >
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
                className={`whitespace-pre-wrap text-sm md:text-base ${colorScheme.text} select-text`}
              >
                <Highlighter
                  highlightClassName={`font-bold ${colorScheme.text} select-text`}
                  highlightStyle={{ backgroundColor: "transparent" }}
                  searchWords={wordsToHighlight}
                  autoEscape={true}
                  textToHighlight={quote || ""}
                />
              </p>
            </div>
          </div>
          <div className="relative -top-6 flex justify-between py-2">
            {showSource && sourceId && (
              <div className="ml-4">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`/premium/book/${sourceId}`}
                  className="w-full text-lg block"
                >
                  <Badge className="z-0" variant="brutalinvert">
                    {bookTitle}
                  </Badge>
                </Link>
              </div>
            )}
            <div className={`${showSource ? "mr-4" : "ml-auto mr-4"}`}>
              <Badge className="z-0" variant="brutal">
                {location}
              </Badge>
            </div>
          </div>
          {note && (
            <div className="-mt-10 flex my-2 px-8 relative">
              <p
                ref={noteRef}
                className="ml-2 text-sm text-muted-foreground pt-2 whitespace-pre-wrap select-text"
              >
                <span className="select-none text-sm md:text-base font-bold text-secondary">
                  Notes:{" "}
                </span>
                <span className="select-text">
                  <Highlighter
                    highlightClassName="font-bold text-muted-foreground select-text"
                    highlightStyle={{ backgroundColor: "transparent" }}
                    searchWords={wordsToHighlight}
                    autoEscape={true}
                    textToHighlight={note || ""}
                  />
                </span>
              </p>
              {!tagsUpdating &&
                sourceId &&
                selection &&
                !hideTags &&
                noteRef.current?.contains(
                  window.getSelection()?.anchorNode!
                ) && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${selection.x + 36}px`, // Larger offset for notes
                      top: `${selection.y}px`,
                      transform: "translateX(-50%)",
                      zIndex: 50,
                    }}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-alternate h-6 w-6 rounded-full bg-card border-2 border-black"
                            onClick={handleTagClick}
                          >
                            <Tag className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                          <p>Tag this text</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
