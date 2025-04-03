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
import { useState } from "react";
import Link from "next/link";

import { useMediaQuery } from "@/hooks/use-media-query";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Search, Tag } from "lucide-react";
import { search } from "@/server/actions-premium";
import { Skeleton } from "@/components//ui/skeleton";
import { QuoteCardBrutal } from "@/components/premium/QuoteCardBrutal";

import { Input } from "@/components//ui/input";
import { BookCard } from "@/components/premium/BookCard";
import { z } from "zod";

type SearchResults = {
  books: Array<{
    id: string;
    title: string;
    subtitle: string | null;
    author: string | null;
    type: string | null;
    origin: string | null;
    asin: string | null;
    userId: string;
    createdAt: Date | null;
    mediaId: string | null;
    ignored: boolean | null;
    media: { url: string } | null;
  }>;
  quotes: Array<{
    id: string;
    content: string;
    note: string | null;
    color: string | null;
    location: string | null;
    userId: string;
    createdAt: Date | null;
    sourceId: string;
    source: {
      id: string;
      title: string;
      author: string | null;
      origin: string | null;
    };
    tags: { id: string; title: string }[];
  }>;
  tags: Array<{
    id: string;
    title: string;
    description: string | null;
  }>;
};

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";

export function SearchDialog() {
  const [open, setOpen] = useState(false);

  const [searchResults, setSearchResults] = useState<SearchResults>({
    books: [],
    quotes: [],
    tags: [], // Add this line
  });
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isLoading, setIsLoading] = useState(false);

  const schema = z.object({
    searchQuery: z.string(),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      searchQuery: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true);
    try {
      if (data && data.searchQuery) {
        let searchReturned;
        searchReturned = await search(data.searchQuery);

        // make sure the results have books, quotes, tags arrays. if not add empty array
        if (!searchReturned.books) {
          searchReturned.books = [];
        }
        if (!searchReturned.quotes) {
          searchReturned.quotes = [];
        }
        if (!searchReturned.tags) {
          searchReturned.tags = [];
        }

        if (searchReturned) {
          setSearchResults(searchReturned as SearchResults);
        }
      } else {
        setSearchResults({ books: [], quotes: [], tags: [] }); // Add tags: []
      }
    } catch (error) {
      console.log("error", error);

      setIsLoading(false);

      toast({
        title: "Error",
        description: "Failed to search. Please refresh and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.ctrlKey && event.key === "k") {
      event.preventDefault();
      setOpen(true);
    }

    if (event.ctrlKey && event.key === "p") {
      event.preventDefault();
      setOpen(true);
    }

    if (event.metaKey && event.key === "k") {
      event.preventDefault();
      setOpen(true);
    }

    if (event.metaKey && event.key === "p") {
      event.preventDefault();
      setOpen(true);
    }

    if (event.ctrlKey && event.shiftKey && event.key === "p") {
      event.preventDefault();
      setOpen(true);
    }

    if (event.ctrlKey && event.shiftKey && event.key === "k") {
      event.preventDefault();
      setOpen(true);
    }
  };

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

  if (isDesktop) {
    const searchInput = document.getElementById("searchQueryDesktopInput");
    if (searchInput) {
      searchInput.focus();
    }

    document.addEventListener("keydown", handleKeyDown);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="">
            <Search />
            <div className="hidden lg:flex items-center space-x-4 ml-4">
              <span>Search</span>
              <div className="p-1 rounded bg-background dark:bg-black dark:text-white">
                ⌘K
              </div>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <div>
            <DialogHeader className="mb-2">
              <DialogTitle>Search</DialogTitle>
              <DrawerDescription>
                Books, subtitles, authors, quotes, notes, tags, and other
                things...
              </DrawerDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }}
                className="flex flex-wrap"
              >
                <div className="w-10/12">
                  <FormField
                    control={form.control}
                    name="searchQuery"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            placeholder="Search for something..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-2/12 pl-4">
                  <Button
                    className="w-full"
                    variant="brutalprimary"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="overflow-y-auto overflow-x-auto"
            >
              {searchResults.books && searchResults.books.length > 0 && (
                <div>
                  {searchResults.books.map((book) => (
                    <motion.div
                      className="mb-4"
                      key={book.id}
                      variants={itemVariants}
                    >
                      <BookCard
                        id={book.id}
                        title={book.title}
                        ignored={book.ignored ?? false}
                        subtitle={book.subtitle ?? ""}
                        author={book.author ?? ""}
                        imageUrl={
                          book.media && book.media.url ? book.media.url : ""
                        }
                        setOpen={setOpen}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {searchResults.quotes && searchResults.quotes.length > 0 && (
                <div>
                  {searchResults.quotes.map((quote) => (
                    <motion.div
                      className="mb-4"
                      key={quote.id}
                      variants={itemVariants}
                    >
                      <>
                        <QuoteCardBrutal
                          origin={quote.source.origin as string}
                          bookTitle={quote.source.title}
                          bookAuthor={quote.source.author as string}
                          quote={quote.content}
                          note={quote.note ?? ""}
                          location={quote.location ?? ""}
                          color={quote.color || ""}
                          id={quote.id}
                          showSource
                          hideManualTag
                          sourceId={quote.source.id}
                          tags={quote.tags || []}
                          onTagsFinishedUpdating={() => {
                            form.handleSubmit(onSubmit)();
                          }}
                        />
                      </>
                    </motion.div>
                  ))}
                </div>
              )}

              {searchResults.tags && searchResults.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2 text-muted-foreground">
                    Tags
                  </h3>
                  {searchResults.tags.map((tag) => (
                    <motion.div
                      className="mb-4"
                      key={tag.id}
                      variants={itemVariants}
                    >
                      <Link
                        href={`/premium/tag/${tag.id}`}
                        onClick={() => setOpen(false)}
                      >
                        <div className="p-4 rounded-lg border-2 bg-card hover:bg-accent transition-colors">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-primary" />
                            <h4 className="font-medium">{tag.title}</h4>
                          </div>
                          {tag.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {tag.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="icon">
          <Search />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Search</DrawerTitle>
          <DrawerDescription>
            Books, subtitles, authors, quotes, notes, tags, and other things...
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(onSubmit)(e);
              }}
              className="flex flex-wrap mb-4"
            >
              <div className="w-7/12">
                <FormField
                  control={form.control}
                  name="searchQuery"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Search for something..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-5/12 pl-2">
                <Button
                  className="w-full"
                  variant="brutalprimary"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </div>
            </form>
          </Form>
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-h-[600px] overflow-y-auto overflow-x-auto pb-24"
            >
              {searchResults.books.map((quote) => (
                <motion.div
                  className="mb-4"
                  key={quote.id}
                  variants={itemVariants}
                >
                  <BookCard
                    id={quote.id}
                    title={quote.title}
                    ignored={quote.ignored ?? false}
                    subtitle={quote.subtitle ?? ""}
                    author={quote.author ?? ""}
                    imageUrl={
                      quote.media && quote.media.url ? quote.media.url : ""
                    }
                    setOpen={setOpen}
                  />
                </motion.div>
              ))}
              {searchResults.quotes.map((quote) => (
                <motion.div
                  className="mb-4"
                  key={quote.id}
                  variants={itemVariants}
                >
                  <QuoteCardBrutal
                    origin={quote.source.origin as string}
                    bookTitle={quote.source.title}
                    bookAuthor={quote.source.author as string}
                    quote={quote.content}
                    note={quote.note ?? ""}
                    location={quote.location ?? ""}
                    color={quote.color || ""}
                    id={quote.id}
                    showSource
                    hideManualTag
                    sourceId={quote.source.id}
                    tags={quote.tags || []}
                    onTagsFinishedUpdating={() => {
                      form.handleSubmit(onSubmit)();
                    }}
                  />
                </motion.div>
              ))}
              {searchResults.tags.map((tag) => (
                <motion.div
                  className="mb-4"
                  key={tag.id}
                  variants={itemVariants}
                >
                  <Link
                    href={`/premium/tag/${tag.id}`}
                    onClick={() => setOpen(false)}
                  >
                    <div className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary" />
                        <h4 className="font-medium">{tag.title}</h4>
                      </div>
                      {tag.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {tag.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const LoadingSkeleton = () => {
  return (
    <div className="mt-4 flex flex-col space-y-3">
      <div className="space-y-2">
        <Skeleton className="bg-card h-12 w-full rounded-lg" />
        <Skeleton className="bg-card h-12 w-full rounded-lg" />
        <Skeleton className="bg-card h-12 w-full rounded-lg" />
      </div>
    </div>
  );
};
