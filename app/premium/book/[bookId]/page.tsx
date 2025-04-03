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

import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { selectSourceSchema, selectQuoteSchema } from "@/db/schema";
import { getBookTitles } from "@/server/actions";
import {
  Quote,
  Tags,
  StickyNote,
  Microscope,
  CheckSquare,
  Square,
  Check,
  ChevronsUpDown,
  Frown,
  Copy,
  Loader2,
  Trash,
  Lightbulb,
  Tag,
  X,
  ChevronDown,
  ChevronUp,
  Telescope,
  GraduationCap,
} from "lucide-react";

import {
  updateBookImage,
  deleteBookImage,
  getBook,
  createTagsFromIdeas,
  deleteTagFromBook,
  deleteAllTagsFromBook,
  getQuotesByTag,
  updateQuoteTags,
  getUnusedTagsForSource,
  addExistingTagToSource,
} from "@/server/actions-premium";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BookHeader } from "@/components/BookHeader";
import { QuoteCardBrutal } from "@/components/premium/QuoteCardBrutal";
import { AnimatedLoader } from "@/components/AnimatedLoader";
import { QuoteFormDialog } from "@/components/premium/QuoteForm/QuoteFormDialog";
import { UploadButton } from "@/utils/uploadthing";
import { ChatBotPopup } from "@/components/premium/ChatBotPopup";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { Skeleton } from "@/components/ui/skeleton";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

import { Checkbox } from "@/components/ui/checkbox";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { ManualTagDialog } from "@/components/premium/ManualTagDialog";
import { PaginationControls } from "@/components/PaginationControls";
import { BookRecommendations } from "@/components/premium/BookRecommendations";
import { ExistingTagDialog } from "@/components/premium/ExistingTagDialog";
import Link from "next/link";

interface ExamineResult {
  summary: string;
  themes: string[];
  takeaways: string[];
  readerPerspective: string;
}

interface BookIdea {
  tag: string;
  description: string;
  quoteIndices: number[];
}

interface ExistingTag {
  id: string;
  tag: string;
  description: string;
  isExisting: true;
}

interface NewIdea extends BookIdea {
  isExisting: false;
  id?: string; // Optional id for consistency
}

interface Tag {
  id: string;
  title: string;
  description?: string | null; // Update this line to allow null
}

// type Quote = {
//   id: string;
//   content: string;
//   note: string | null;
//   location: string | null;
//   color: string | null;
//   createdAt: Date;
//   updatedAt: Date;
// };
type Quote = z.infer<typeof selectQuoteSchema> & {
  tags?: {
    id: string;
    title: string;
    description: string | null;
  }[];
};

type SourceExtended = z.infer<typeof selectSourceSchema> & {
  media?: {
    id: string;
    appUrl?: string;
    key?: string;
    name?: string;
    uploadedBy: string;
    url: string;
    userId: string;
    createdAt: Date;
  } | null;
  totalQuotes: number;
  totalNotes: number;
  tags?: {
    id: string;
    title: string;
    description: string | null;
    createdAt: Date | null;
    userId: string;
  }[];
  quotes: Quote[];
};

type BasicBookData = z.infer<typeof selectSourceSchema>;

export default function BookPage({
  params: paramsPromise,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const params = use(paramsPromise);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);
  const [isViewTagDialogOpen, setIsViewTagDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [reflection, setReflection] = useState<{
    question: string;
    answer: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [comparison, setComparison] = useState<{
    analysis: string;
    score: number;
  } | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const answerRef = useRef<HTMLTextAreaElement>(null);
  const [ideas, setIdeas] = useState<BookIdea[]>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [isLinkingIdeas, setIsLinkingIdeas] = useState(false);
  const [selectedIdeas, setSelectedIdeas] = useState<Set<number>>(new Set());
  const [showIdeasSection, setShowIdeasSection] = useState(false);
  const [showManualTagDialog, setShowManualTagDialog] = useState(false);
  const [quoteIdForNewTag, setQuoteIdForNewTag] = useState<string | null>(null);
  const [isDeletingTag, setIsDeletingTag] = useState(false);

  useEffect(() => {
    if (showIdeasSection) {
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
    }
  }, [showIdeasSection]);

  const [deletingTagId, setDeletingTagId] = useState<string | null>(null);
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [isDeleteAllTagsDialogOpen, setIsDeleteAllTagsDialogOpen] =
    useState(false);
  const [isDeletingAllTags, setIsDeletingAllTags] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [selectedTagQuotes, setSelectedTagQuotes] = useState<Quote[]>([]);
  const [isLoadingTagQuotes, setIsLoadingTagQuotes] = useState(false);
  const [isExamining, setIsExamining] = useState(false);
  const [examineResult, setExamineResult] = useState<ExamineResult | null>(
    null
  );
  const [isExamineDialogOpen, setIsExamineDialogOpen] = useState(false);
  const [updatingTagsMap, setUpdatingTagsMap] = useState<
    Record<string, boolean>
  >({});

  const fetchTagQuotesMutation = useMutation({
    mutationFn: ({ bookId, tagId }: { bookId: string; tagId: string }) =>
      getQuotesByTag(bookId, tagId),
    onSuccess: (data) => {
      setSelectedTagQuotes(data);
    },
    onError: () => {
      toast({
        title: "Error fetching quotes",
        description: "Failed to load quotes for this tag",
        variant: "destructive",
      });
    },
  });

  const copyReflection = () => {
    if (!reflection) return;

    let textToCopy = `Question:\n${reflection.question}\n\n`;
    textToCopy += `Your Answer:\n${userAnswer}\n\n`;

    if (showAnswer) {
      textToCopy += `Suggested Answer:\n${reflection.answer}\n\n`;
      if (comparison) {
        textToCopy += `Analysis:\n${comparison.analysis}\n`;
        textToCopy += `Score: ${comparison.score}/10`;
      }
    }

    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied to clipboard",
      description: "Question, answers, and analysis copied to clipboard",
    });
  };

  const handleDialogOpen = (open: boolean) => {
    setIsReflectionOpen(open);
    if (!open) {
      setReflection(null);
      setShowAnswer(false);
      setUserAnswer("");
      setComparison(null);
    }
  };

  const generateReflection = async (
    book: SourceExtended | null | { error: string }, // Explicitly type 'book'
    params: { bookId: string }, // Explicitly type 'params'
    setIsGenerating: (value: boolean) => void,
    setShowAnswer: (value: boolean) => void,
    setUserAnswer: (value: string) => void,
    setComparison: (value: any) => void,
    setReflection: (value: any) => void,
    setIsReflectionOpen: (value: boolean) => void,
    toast: (options: {
      title: string;
      description: string;
      variant: "destructive";
    }) => void
  ) => {
    setIsGenerating(true);
    setShowAnswer(false);
    setUserAnswer("");
    setComparison(null);
    try {
      if (!book || (typeof book === "object" && "error" in book)) {
        throw new Error("Book data not available");
      }

      if (typeof book === "object" && "title" in book) {
        const response = await fetch("/api/book-reflection", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookId: params.bookId,
            bookTitle: book.title,
            bookAuthor: book.author || "",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate question");
        }

        const result = await response.json();
        console.log("result:", result);
        setReflection(result);
        setIsReflectionOpen(true);
      } else {
        throw new Error("Book data is not in the correct format");
      }
    } catch (error) {
      toast({
        title: "Error generating question",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateIdeas = async (
    book: SourceExtended | null | { error: string },
    setIsGeneratingIdeas: (value: boolean) => void,
    setIdeas: (value: BookIdea[]) => void,
    setSelectedIdeas: (value: Set<number>) => void,
    toast: (options: {
      title: string;
      description: string;
      variant?: "destructive";
    }) => void
  ) => {
    if (isGeneratingIdeas) return;
    if (!book || (typeof book === "object" && "error" in book)) return;

    setIsGeneratingIdeas(true);
    try {
      const response = await fetch("/api/book-ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book.id,
          bookTitle: book.title,
          bookAuthor: book.author,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate ideas");
      }

      // Filter out ideas that already exist as tags
      const filteredIdeas = result.ideas.filter(
        (idea: { tag: string }) =>
          !book?.tags?.some(
            (tag) => tag.title.toLowerCase() === idea.tag.toLowerCase()
          )
      );

      setIdeas(filteredIdeas);
      setSelectedIdeas(
        new Set(filteredIdeas.map((_: BookIdea, index: number) => index))
      );
    } catch (error) {
      toast({
        title: "Error generating ideas",
        description:
          error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const {
    data: book,
    isLoading: isLoadingBook,
    isError,
  } = useQuery({
    queryKey: ["book", params.bookId, currentPage],
    queryFn: async () => {
      const result = await getBook(params.bookId, currentPage, pageSize);
      if ("error" in result) {
        return result as { error: string };
      }
      return result as SourceExtended;
    },
  });
  const { data: allTags = [] } = useQuery({
    queryKey: ["allTags", book && "id" in book ? book.id : undefined],
    queryFn: () =>
      book && "id" in book
        ? getUnusedTagsForSource(book.id)
        : Promise.resolve([]),
    enabled: !!(book && "id" in book),
  });

  const {
    data: bookTitles,
    mutate: server_getBookTitles,
    isPending: isPendingBookTitles,
  } = useMutation<BasicBookData[], Error>({
    mutationFn: getBookTitles,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const displayQuotes = book && !("error" in book) ? book.quotes : [];
  const totalPages = Math.ceil(
    (book && !("error" in book) ? book.totalQuotes : 0) / pageSize
  );
  const transformBookTitles = (books: BasicBookData[]) => {
    return books.map((book) => ({
      id: book.id,
      value: book.title.toLowerCase(),
      label: book.title,
      ignored: book.ignored,
      origin: book.origin,
    }));
  };

  useEffect(() => {
    server_getBookTitles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBookSelect = (bookValue: string) => {
    const selectedBook = displayBookTitles.find(
      (book) => book.value === bookValue
    );
    if (selectedBook) {
      router.push(`/premium/book/${selectedBook.id}`);
    }
    setOpen(false);
  };

  const displayBookTitles = bookTitles ? transformBookTitles(bookTitles) : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 33 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const refreshQuotes = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["book"] });
  }, [queryClient]);

  if (isLoadingBook)
    return (
      <div className="pt-32 flex items-center justify-center">
        <AnimatedLoader />
      </div>
    );

  const ErrorMessage: React.FC = () => {
    return (
      <div className="error-message">
        <p>Something went wrong.</p>
      </div>
    );
  };

  const ReflectionQuestionSkeleton = () => {
    return (
      <div className="space-y-4">
        <div className="p-4 border-2 rounded-lg">
          <h3 className="font-semibold mb-2">Question:</h3>
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        {/* <Button variant="brutal" className="w-full">
                <Skeleton className="h-4 w-32" />
              </Button> */}
      </div>
    );
  };

  const handleLinkIdeas = async () => {
    if (!book || "error" in book) return;

    try {
      setIsLinkingIdeas(true);
      const selectedIdeasArray = Array.from(selectedIdeas).map((index) => ({
        ...ideas[index],
        quoteIds: ideas[index].quoteIndices
          .filter((quoteIndex) => displayQuotes[quoteIndex])
          .map((quoteIndex) => displayQuotes[quoteIndex].id),
      }));

      await createTagsFromIdeas(book.id, selectedIdeasArray);

      await queryClient.invalidateQueries({ queryKey: ["book"] });

      toast({
        title: "Ideas linked successfully",
        description: "The selected ideas have been added as tags to your book",
      });

      setShowIdeasSection(false);
    } catch (error) {
      console.error("Failed to create tags from ideas:", error);
      toast({
        title: "Error linking ideas",
        description: "Failed to create tags from ideas",
        variant: "destructive",
      });
    } finally {
      setIsLinkingIdeas(false);
    }
  };

  const handleConfirmDeleteTag = async () => {
    if (!selectedTag || !book || "error" in book) return;

    setIsDeletingTag(true);
    setDeletingTagId(selectedTag.id);
    try {
      await deleteTagFromBook(selectedTag.id, book.id);
      await queryClient.invalidateQueries({ queryKey: ["book"] });

      toast({
        title: "Tag removed",
        description: "The tag has been removed from the book",
      });
    } catch (error) {
      toast({
        title: "Error removing tag",
        description: "Failed to remove the tag",
        variant: "destructive",
      });
    } finally {
      setIsViewTagDialogOpen(false);
      setDeletingTagId(null);
      setSelectedTag(null);
      setIsDeletingTag(false);
    }
  };

  const handleSelectAll = () => {
    setSelectedIdeas(new Set(ideas.map((_, index) => index)));
  };

  const handleDeselectAll = () => {
    setSelectedIdeas(new Set());
  };

  const handleCompareAnswers = async () => {
    if (!showAnswer) {
      const currentAnswer = answerRef.current?.value;
      if (!currentAnswer) return;

      setIsComparing(true);
      try {
        const response = await fetch("/api/compare-answers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userAnswer: currentAnswer,
            modelAnswer: reflection?.answer,
            question: reflection?.question,
          }),
        });

        if (!response.ok) throw new Error("Failed to compare answers");

        const result = await response.json();
        setComparison(result);
        setUserAnswer(currentAnswer); // Only set the state after submission
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to compare answers. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsComparing(false);
      }
    } else {
      if (answerRef.current) answerRef.current.value = "";
      setUserAnswer("");
      setComparison(null);
    }
    setShowAnswer(!showAnswer);
  };

  const IdeasContent = () => {
    const allItems = [
      ...ideas.map(
        (idea): NewIdea => ({
          ...idea,
          isExisting: false,
          id: undefined,
        })
      ),
      ...(book && !("error" in book) && book.tags
        ? book.tags.map(
            (tag): ExistingTag => ({
              tag: tag.title,
              description: tag.description || "",
              isExisting: true,
              id: tag.id,
            })
          )
        : []),
    ];

    return (
      <div className="space-y-6 w-full">
        <ScrollArea className="h-[400px] w-full">
          {isGeneratingIdeas ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm text-muted-foreground text-center">
                  Generating ideas from your quotes and notes...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2 w-full">
              {allItems.map((item, index) => (
                <div
                  key={item.isExisting ? `tag-${item.id}` : `idea-${index}`}
                  className={cn(
                    "flex items-center space-x-2 p-2 px-4 rounded-md group",
                    item.isExisting ? "bg-background" : "hover:bg-popover",
                    item.isExisting && deletingTagId === item.id
                      ? "animate-pulse duration-800"
                      : ""
                  )}
                >
                  {!item.isExisting ? (
                    <Checkbox
                      checked={selectedIdeas.has(index)}
                      onCheckedChange={(checked) => {
                        setSelectedIdeas((prev) => {
                          const newSet = new Set(prev);
                          if (checked) {
                            newSet.add(index);
                          } else {
                            newSet.delete(index);
                          }
                          return newSet;
                        });
                      }}
                    />
                  ) : (
                    <Checkbox checked={true} disabled />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 justify-between">
                      <h3 className="font-semibold text-secondary text-xs">
                        {item.tag}
                      </h3>
                      {item.isExisting && (
                        <Badge variant="outline" className="text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Saved
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {item.description}
                    </p>
                  </div>
                  {item.isExisting && book && !("error" in book) && (
                    <Button
                      variant="destructivebrutal"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={async () => {
                        setDeletingTagId(item.id);
                        try {
                          await deleteTagFromBook(item.id, book.id);
                          await queryClient.invalidateQueries({
                            queryKey: ["book"],
                          });
                          toast({
                            title: "Tag removed",
                            description:
                              "The tag has been removed from the book",
                          });
                        } catch (error) {
                          toast({
                            title: "Error removing tag",
                            description: "Failed to remove the tag",
                            variant: "destructive",
                          });
                        } finally {
                          setDeletingTagId(null);
                        }
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {(ideas.length === 0 || !ideas) && (
                <div className="text-center py-4 space-y-2">
                  <Button
                    variant="brutal"
                    onClick={() =>
                      generateIdeas(
                        book as SourceExtended,
                        setIsGeneratingIdeas,
                        setIdeas,
                        setSelectedIdeas,
                        toast
                      )
                    }
                    disabled={isGeneratingIdeas}
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    No new ideas found. All potential tags may already exist.
                  </p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    );
  };

  const handleConfirmDeleteAllTags = async () => {
    if (!book || "error" in book) return;

    setIsDeletingAllTags(true);

    // Store the current tags for rollback if needed
    const previousTags = book.tags;

    // Optimistically update the UI
    queryClient.setQueryData(["book"], {
      ...book,
      tags: [],
    });

    try {
      await deleteAllTagsFromBook(book.id);

      toast({
        title: "Tags removed",
        description: "All tags have been removed from the book",
      });

      await queryClient.invalidateQueries({ queryKey: ["book"] });
    } catch (error) {
      // Rollback on error
      queryClient.setQueryData(["book"], {
        ...book,
        tags: previousTags,
      });

      toast({
        title: "Error removing tags",
        description: "Failed to remove all tags",
        variant: "destructive",
      });
    } finally {
      setIsDeletingAllTags(false);
      setIsDeleteAllTagsDialogOpen(false);
    }
  };

  const handleExamineBook = async () => {
    if (!book || "error" in book) return;

    setIsExamining(true);
    try {
      const response = await fetch("/api/book-examine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book.id,
          bookTitle: book.title,
          bookAuthor: book.author,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to examine book");
      }

      const result = await response.json();
      setExamineResult(result);
      setIsExamineDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to examine book",
        variant: "destructive",
      });
    } finally {
      setIsExamining(false);
    }
  };

  const handleCreateNewTag = (quoteId: string) => {
    setShowManualTagDialog(true);
    setQuoteIdForNewTag(quoteId);
  };

  return (
    <>
      {selectedTag && (
        <Dialog
          open={isViewTagDialogOpen}
          onOpenChange={setIsViewTagDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedTag.title}</DialogTitle>
              <DialogDescription>
                <div className="mb-4">{selectedTag.description}</div>
                <div className="space-y-2">
                  <h4 className="font-medium">
                    Related Quotes/Notes from this book:
                  </h4>
                  {isLoadingTagQuotes ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : selectedTagQuotes.length > 0 &&
                    book &&
                    !("error" in book) ? (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                      {selectedTagQuotes.map((quote) => (
                        <QuoteCardBrutal
                          key={quote.id}
                          origin={book.origin!}
                          bookTitle={book.title}
                          bookAuthor={book.author as string}
                          quote={quote.content}
                          note={quote.note ?? ""}
                          location={quote.location ?? ""}
                          color={quote.color || ""}
                          id={quote.id}
                          hideTags
                          onQuoteDeleted={() => {
                            queryClient.invalidateQueries({
                              queryKey: ["tagQuotes", selectedTag?.id],
                            });
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No quotes found with this tag.
                    </p>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <div className="flex items-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsViewTagDialogOpen(false)}
                >
                  Close
                </Button>
                <Link href={`/premium/tag/${selectedTag.id}`}>
                  <Button variant="brutal">View Tag Page</Button>
                </Link>
                <Button
                  variant="destructivebrutal"
                  onClick={handleConfirmDeleteTag}
                  disabled={isDeletingTag}
                >
                  {isDeletingTag ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4 mr-2" />
                  )}
                  {isDeletingTag ? "Deleting..." : "Delete Tag"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <div className="pt-32 px-4 md:px-12 lg:px-24 xl:px-12 2xl:px-24">
        <div className="flex flex-wrap items-center mb-4 w-full">
          {book && !("error" in book) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {/* Reflect Card */}
              <div>
                <Card className="[&>details>summary]:cursor-pointer [&>details>summary]:list-none [&>details>summary::-webkit-details-marker]:hidden [&>details>summary::marker]:hidden">
                  <details className="group">
                    <summary className="hover:bg-accent transition-colors rounded-t-lg p-6">
                      <CardTitle className="flex text-lg font-semibold items-center justify-between">
                        <div className="flex items-center select-none">
                          <GraduationCap className="mr-2 h-8 w-8" />
                          Test Yourself
                        </div>
                        <ChevronDown className="ml-2 h-6 w-6 transition-transform duration-300 group-open:-rotate-180" />
                      </CardTitle>
                    </summary>
                    <CardHeader className="pt-2">
                      <CardDescription>
                        Engage with your reading through AI-powered reflection
                        questions, receive personalized feedback, and deepen
                        your understanding.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Dialog
                        open={isReflectionOpen}
                        onOpenChange={handleDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="brutal"
                                  onClick={() =>
                                    generateReflection(
                                      book,
                                      params,
                                      setIsGenerating,
                                      setShowAnswer,
                                      setUserAnswer,
                                      setComparison,
                                      setReflection,
                                      setIsReflectionOpen,
                                      toast
                                    )
                                  }
                                  disabled={isGenerating}
                                  className="w-full"
                                >
                                  <GraduationCap className="mr-2 h-4 w-4" />
                                  {isGenerating
                                    ? "Generating..."
                                    : "Generate Reflection Question"}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                                <p>
                                  Generate a reflection question about this
                                  <br />
                                  book, using your quotes and notes
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
                          <DialogHeader className="flex justify-between">
                            <DialogTitle>Reflection Question</DialogTitle>
                          </DialogHeader>
                          <ScrollArea
                            className="w-full pr-4"
                            style={{ maxHeight: "calc(80vh - 120px)" }}
                          >
                            {isGenerating ? (
                              <ReflectionQuestionSkeleton />
                            ) : reflection ? (
                              <div className="space-y-4">
                                <div className="p-4 border-2 rounded-lg relative bg-card">
                                  <div className="absolute top-2 right-2 flex space-x-2">
                                    {showAnswer && (
                                      <Button
                                        variant="brutal"
                                        size="sm"
                                        onClick={copyReflection}
                                      >
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                  <h3 className="font-semibold mb-2">
                                    Question:
                                  </h3>
                                  <p className="mt-8">{reflection.question}</p>

                                  <div className="mt-4">
                                    <h3 className="font-semibold mb-2">
                                      Your Answer:
                                    </h3>
                                    <Textarea
                                      ref={answerRef}
                                      defaultValue=""
                                      placeholder="Type your answer here..."
                                      className="w-full min-h-[100px]"
                                      disabled={isComparing || showAnswer}
                                    />
                                  </div>
                                </div>
                                {showAnswer && (
                                  <>
                                    {comparison && (
                                      <div className="mt-4 p-4 border-2 rounded-lg bg-muted">
                                        <h3 className="font-semibold mb-2">
                                          Analysis:
                                        </h3>
                                        <p>{comparison.analysis}</p>
                                        <div className="mt-2">
                                          <span className="font-semibold">
                                            Score:{" "}
                                          </span>
                                          <span>{comparison.score}/10</span>
                                        </div>
                                      </div>
                                    )}
                                    <div className="mt-4 p-4 border-2 rounded-lg">
                                      <h3 className="font-semibold mb-2">
                                        Suggested Answer:
                                      </h3>
                                      <p>{reflection.answer}</p>
                                    </div>
                                  </>
                                )}
                              </div>
                            ) : null}
                            <ScrollBar orientation="vertical" />
                          </ScrollArea>
                          {reflection && (
                            <DialogFooter className="flex justify-center items-end space-x-2">
                              <Button
                                variant="brutal"
                                onClick={() =>
                                  generateReflection(
                                    book,
                                    params,
                                    setIsGenerating,
                                    setShowAnswer,
                                    setUserAnswer,
                                    setComparison,
                                    setReflection,
                                    setIsReflectionOpen,
                                    toast
                                  )
                                }
                                disabled={isGenerating}
                                className="w-full"
                              >
                                {isGenerating ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <GraduationCap className="mr-2 h-4 w-4" />
                                    Generate New Question
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="brutalprimary"
                                onClick={handleCompareAnswers}
                                disabled={isComparing}
                                className="w-full mb-2 md:mb-0"
                              >
                                {isComparing ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Comparing...
                                  </>
                                ) : showAnswer ? (
                                  "Try Again"
                                ) : (
                                  "Submit Answer"
                                )}
                              </Button>
                            </DialogFooter>
                          )}
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </details>
                </Card>
              </div>

              {/* Deep Analysis Card */}
              <div>
                <Card className="[&>details>summary]:cursor-pointer [&>details>summary]:list-none [&>details>summary::-webkit-details-marker]:hidden [&>details>summary::marker]:hidden">
                  <details className="group">
                    <summary className="hover:bg-accent transition-colors rounded-t-lg p-6">
                      <CardTitle className="flex text-lg font-semibold items-center justify-between">
                        <div className="flex items-center select-none">
                          <Microscope className="mr-2 h-8 w-8" />
                          Deep Analysis
                        </div>
                        <ChevronDown className="ml-2 h-6 w-6 transition-transform duration-300 group-open:-rotate-180" />
                      </CardTitle>
                    </summary>
                    <CardHeader className="pt-2">
                      <CardDescription>
                        Uncover hidden patterns, key themes, and meaningful
                        connections across your highlights and notes.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="brutal"
                              onClick={handleExamineBook}
                              disabled={isExamining}
                              className="w-full"
                            >
                              {isExamining ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Microscope className="mr-2 h-4 w-4" />
                              )}
                              {isExamining ? "Examining..." : "Examine"}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                            <p>
                              Get a comprehensive analysis
                              <br />
                              of your book notes and takeaways
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardContent>
                  </details>
                </Card>
              </div>

              {/* Discover More Card */}
              <div>
                <Card className="[&>details>summary]:cursor-pointer [&>details>summary]:list-none [&>details>summary::-webkit-details-marker]:hidden [&>details>summary::marker]:hidden">
                  <details className="group">
                    <summary className="hover:bg-accent transition-colors rounded-t-lg p-6">
                      <CardTitle className="flex text-lg font-semibold items-center justify-between">
                        <div className="flex items-center select-none">
                          <Telescope className="mr-2 h-8 w-8" />
                          Discover More
                        </div>
                        <ChevronDown className="ml-2 h-6 w-6 transition-transform duration-300 group-open:-rotate-180" />
                      </CardTitle>
                    </summary>
                    <CardHeader className="pt-2">
                      <CardDescription>
                        Find complementary and contrasting books that are not
                        currently in your library to broaden your perspective.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="w-full">
                        <BookRecommendations
                          book={{
                            id: book.id,
                            title: book.title,
                            author: book.author as string,
                          }}
                          type="similar"
                        />
                      </div>
                      <div className="w-full">
                        <BookRecommendations
                          book={{
                            id: book.id,
                            title: book.title,
                            author: book.author as string,
                          }}
                          type="contrasting"
                        />
                      </div>
                    </CardContent>
                  </details>
                </Card>
              </div>
            </div>
          )}
        </div>

        {showIdeasSection && (
          <Card className="mt-2 mb-4 w-full max-w-3xl mx-auto">
            <CardHeader className="p-3">
              <div className="flex justify-between">
                <div className="">
                  <CardTitle className="text-sm">Tags</CardTitle>
                  <CardDescription className="text-xs">
                    Review existing tags and generate new ones from this book
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowIdeasSection(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-1 md:space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    disabled={isGeneratingIdeas}
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeselectAll}
                    disabled={isGeneratingIdeas}
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Deselect All
                  </Button>
                </div>
              </div>
              <IdeasContent />
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-end">
                {ideas.length > 0 && !isGeneratingIdeas && (
                  <div className="">
                    <div className="flex justify-end items-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="brutalprimary"
                              size="sm"
                              onClick={handleLinkIdeas}
                              disabled={
                                isLinkingIdeas || selectedIdeas.size == 0
                              }
                            >
                              {isLinkingIdeas ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Linking...
                                </>
                              ) : (
                                `Link ${selectedIdeas.size} ${
                                  selectedIdeas.size === 1
                                    ? "New Tag"
                                    : "New Tags"
                                }`
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                            <p>
                              Convert selected ideas into permanent tags for
                              this book
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                )}
              </div>{" "}
            </CardFooter>
          </Card>
        )}

        {book && !("error" in book) && (
          <div className="flex flex-wrap">
            <div className="w-full xl:w-1/6 pr-4">
              <div className="w-full mb-2">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      role="combobox"
                      aria-expanded={open}
                      className="justify-between"
                      variant="brutalprimary"
                    >
                      <span className="truncate max-w-[140px] text-left">
                        {params.bookId
                          ? displayBookTitles.find(
                              (book) => book.id === params.bookId
                            )?.label || "Select book..."
                          : "Select book..."}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search book..." />
                      <CommandList>
                        <CommandEmpty>No book found.</CommandEmpty>
                        <CommandGroup>
                          {displayBookTitles.map((book) => (
                            <CommandItem
                              key={book.id}
                              value={book.value}
                              onSelect={handleBookSelect}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  params.bookId === book.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {book.ignored && (
                                <Frown
                                  className={cn(
                                    "mr-2 h-4 w-4 text-destructive"
                                  )}
                                />
                              )}
                              {book.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {book && !("error" in book) && book.origin === "UNEARTHED" && (
                <div className="w-full mb-2">
                  <QuoteFormDialog
                    buttonText="Add a Quote"
                    onQuoteAdded={refreshQuotes}
                    source={book as SourceExtended}
                  />
                </div>
              )}
              <BookHeader
                title={book.title}
                subtitle={book.subtitle as string}
                author={book.author as string}
                imageUrl={book.media?.url as string}
                ignored={book.ignored as boolean}
              />
              <div className="mt-4 text-sm">
                <div className="flex items-center gap-2 text-alternate font-semibold">
                  <Quote className="h-4 w-4" />
                  <span>
                    {book.totalQuotes || 0}{" "}
                    {book.totalQuotes === 1 ? "quote" : "quotes"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-alternate mt-1 font-semibold">
                  <Tags className="h-4 w-4" />
                  <span>
                    {book.tags?.length || 0}{" "}
                    {book.tags?.length === 1 ? "tag" : "tags"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-alternate mt-1 font-semibold">
                  <StickyNote className="h-4 w-4" />
                  <span>
                    {book.totalNotes || 0}{" "}
                    {book.totalNotes === 1 ? "note" : "notes"}
                  </span>
                </div>
              </div>
              {book && !("error" in book) && (
                <div className="mr-2 my-2 md:mb-0 w-full md:w-auto">
                  <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="brutalprimary"
                            size={"sm"}
                            onClick={() => {
                              setShowIdeasSection(true);
                              generateIdeas(
                                book as SourceExtended,
                                setIsGeneratingIdeas,
                                setIdeas,
                                setSelectedIdeas,
                                toast
                              );
                            }}
                            disabled={isGeneratingIdeas || showIdeasSection}
                            className=""
                          >
                            <Lightbulb className="mr-2 h-4 w-4" />
                            {isGeneratingIdeas
                              ? "Extracting..."
                              : "Auto Generate Tags"}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                          <p>Extract key ideas and themes from your quotes</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <ManualTagDialog
                      sourceId={book.id}
                      open={showManualTagDialog}
                      onOpenChange={(open) => {
                        setShowManualTagDialog(open);
                        if (!open) {
                          setQuoteIdForNewTag(null);
                        }
                      }}
                      quoteIds={quoteIdForNewTag ? [quoteIdForNewTag] : []}
                    />

                    <ExistingTagDialog sourceId={book.id} />

                    {book.tags && book.tags.length > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <ConfirmationDialog
                              isOpen={isDeleteAllTagsDialogOpen}
                              onOpenChange={(open) => {
                                setIsDeleteAllTagsDialogOpen(open);
                              }}
                              onConfirm={handleConfirmDeleteAllTags}
                              title="Delete All Tags"
                              description="Are you sure you want to delete all tags from this book?"
                              confirmText="Delete"
                              cancelText="Cancel"
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructivebrutal"
                                  size="sm"
                                  disabled={isDeletingAllTags}
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Tags
                                </Button>
                              </AlertDialogTrigger>
                            </ConfirmationDialog>
                          </TooltipTrigger>
                          <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                            <p>Remove all tags from this book</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              )}
              {book.tags && book.tags.length > 0 && (
                <div className="mt-4 relative">
                  <div
                    className={cn(
                      "flex flex-wrap gap-2 pb-2",
                      !isTagsExpanded && "max-h-[80px] overflow-hidden"
                    )}
                  >
                    {book.tags.map((sourceTag) => (
                      <Badge
                        key={sourceTag.id}
                        variant="brutalinvertsmall"
                        className={cn(
                          "cursor-pointer hover:bg-primary",
                          deletingTagId === sourceTag.id
                            ? "animate-pulse duration-800"
                            : ""
                        )}
                        onClick={async (e) => {
                          e.preventDefault();
                          setIsViewTagDialogOpen(true);
                          setSelectedTag(sourceTag);
                          setIsLoadingTagQuotes(true);
                          await fetchTagQuotesMutation.mutateAsync({
                            bookId: book.id,
                            tagId: sourceTag.id,
                          });
                          setIsLoadingTagQuotes(false);
                        }}
                      >
                        {sourceTag.title}
                      </Badge>
                    ))}
                  </div>
                  {book.tags.length > 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="border-t-2 w-full rounded-none hover:bg-transparent"
                      onClick={() => setIsTagsExpanded(!isTagsExpanded)}
                    >
                      {isTagsExpanded ? (
                        <ChevronUp className="h-4 w-4 mr-2" />
                      ) : (
                        <ChevronDown className="h-4 w-4 mr-2" />
                      )}
                      {isTagsExpanded
                        ? "Show Less"
                        : `Show All (${book.tags.length}) Tags`}
                    </Button>
                  )}
                </div>
              )}
              {book.origin === "UNEARTHED" && (
                <>
                  {!showImageUpload && (
                    <div className="mt-2 flex">
                      <Button
                        onClick={() => setShowImageUpload(true)}
                        size="sm"
                      >
                        {book.mediaId ? "Change Image" : "Upload Image"}
                      </Button>
                      {book.mediaId && (
                        <Button
                          onClick={async () => {
                            await deleteBookImage(book);
                            toast({
                              title: `Image Removed`,
                              description: `Reloading the page, please wait`,
                            });
                            queryClient.invalidateQueries({
                              queryKey: ["book"],
                            });
                          }}
                          size="sm"
                          variant="destructivebrutal"
                          className="ml-1"
                        >
                          Remove Image
                        </Button>
                      )}
                    </div>
                  )}
                  {showImageUpload && (
                    <div className="w-64 xl:w-full mt-4">
                      <UploadButton
                        appearance={{
                          button: ` text-xs font-bold w-full ut-ready:bg-primary ut-ready:text-black ut-uploading:text-black ut-uploading:cursor-not-allowed
                            border-2 p-2.5 rounded-md transition-all duration-200
                            bg-card border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] 
                            hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]
                            active:shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px]
                            dark:hover:bg-accent dark:bg-[rgb(238,157,138)] dark:text-black`,
                          container: "flex justify-start",
                          allowedContent:
                            "flex h-8 flex-col items-center justify-center px-2 text-muted dark:text-white mt-2",
                        }}
                        endpoint="imageUploader"
                        onClientUploadComplete={async (res) => {
                          const firstFile = res[0];

                          const fileToUpload = {
                            appUrl: firstFile.appUrl,
                            key: firstFile.key,
                            name: firstFile.name,
                            userId: firstFile.serverData.uploadedBy,
                            url: firstFile.url,
                            uploadedBy: firstFile.serverData.uploadedBy,
                          };

                          if (firstFile) {
                            await updateBookImage(fileToUpload, book);
                            toast({
                              title: `Uploaded image successfully`,
                              description: `Reloading the page, please wait`,
                            });
                            queryClient.invalidateQueries({
                              queryKey: ["book"],
                            });
                          }
                        }}
                        onUploadError={(error: Error) => {
                          console.log(`ERROR! ${error.message}`);
                          toast({
                            title: `Error`,
                            description: `Make sure the file is an Image under the file size limit`,
                            variant: "destructive",
                          });
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="w-full xl:w-5/6 pt-4 xl:pt-0 flex flex-col">
              {displayQuotes.length === 0 ? (
                <h3 className="text-xl text-center my-4 text-secondary">
                  No quotes in the selected book.
                </h3>
              ) : (
                <>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="columns-1 md:columns-2 xl:columns-3 gap-4"
                  >
                    {displayQuotes.map((quote: Quote) => (
                      <motion.div
                        className="mb-4 break-inside-avoid-column"
                        key={quote.id}
                        variants={itemVariants}
                      >
                        <QuoteCardBrutal
                          sourceId={book.id}
                          origin={book.origin!}
                          bookTitle={book.title}
                          bookAuthor={book.author as string}
                          quote={quote.content}
                          note={quote.note ?? ""}
                          location={quote.location ?? ""}
                          color={quote.color || ""}
                          id={quote.id}
                          onQuoteDeleted={refreshQuotes}
                          tags={quote.tags || []}
                          existingTags={[...(book.tags || []), ...allTags]} // Combine current book tags with all other available tags
                          onCreateNewTag={handleCreateNewTag}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </>
              )}
            </div>
          </div>
        )}
        <motion.div
          className="fixed z-40 bottom-4 right-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <ErrorBoundary fallback={<ErrorMessage />}>
            <ChatBotPopup
              book={book as SourceExtended}
              quotes={displayQuotes}
            />
          </ErrorBoundary>
        </motion.div>
        <Dialog
          open={isExamineDialogOpen}
          onOpenChange={setIsExamineDialogOpen}
        >
          <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
            <DialogHeader className="flex flex-row justify-between items-center">
              <DialogTitle>Book Analysis</DialogTitle>
              {examineResult && (
                <Button
                  variant="brutal"
                  size="sm"
                  onClick={() => {
                    const formattedText =
                      `Book Analysis\n\n` +
                      `Summary:\n${examineResult.summary}\n\n` +
                      `Themes:\n${examineResult.themes
                        .map((theme) => `• ${theme}`)
                        .join("\n")}\n\n` +
                      `Key Takeaways:\n${examineResult.takeaways
                        .map((takeaway) => `• ${takeaway}`)
                        .join("\n")}\n\n` +
                      `Reader's Potential Perspective:\n${examineResult.readerPerspective}`;

                    navigator.clipboard.writeText(formattedText);
                    toast({
                      title: "Analysis copied to clipboard",
                      description:
                        "The complete analysis has been copied to your clipboard",
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </DialogHeader>
            <ScrollArea
              className="w-full pr-4"
              style={{ maxHeight: "calc(80vh - 120px)" }}
            >
              {examineResult && (
                <div className="space-y-4">
                  <div className="p-4 border-2 rounded-lg bg-popover">
                    <h3 className="font-semibold mb-2">Summary</h3>
                    <p>{examineResult.summary}</p>
                  </div>

                  <div className="p-4 border-2 rounded-lg bg-popover">
                    <h3 className="font-semibold mb-2">Themes</h3>
                    <ul className="list-disc pl-4">
                      {examineResult.themes.map((theme, index) => (
                        <li key={index}>{theme}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 border-2 rounded-lg bg-popover">
                    <h3 className="font-semibold mb-2">Key Takeaways</h3>
                    <ul className="list-disc pl-4">
                      {examineResult.takeaways.map((takeaway, index) => (
                        <li key={index}>{takeaway}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 border-2 rounded-lg bg-popover">
                    <h3 className="font-semibold mb-2">
                      Reader&apos;s Potential Perspective
                    </h3>
                    <p>{examineResult.readerPerspective}</p>
                  </div>
                </div>
              )}
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
      {book && !("error" in book) && displayQuotes.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          className="z-30 fixed bottom-0 w-full pb-2"
        />
      )}
    </>
  );
}
