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

"use client";
import { useEffect, useState } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { motion } from "framer-motion";

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
import { Search } from "lucide-react";
import { search } from "@/server/actions";
import { search as searchPremium } from "@/server/actions-premium";
import { Skeleton } from "./ui/skeleton";
import { QuoteBookCardBrutal } from "@/components/QuoteBookCardBrutal";
import { QuoteBookCardBrutal as QuoteBookCardBrutalPremium } from "@/components/premium/QuoteBookCardBrutal";

import {
  selectSourceWithRelationsSchema,
  selectQuoteWithRelationsSchema,
} from "@/db/schema";
import { Input } from "./ui/input";
import { BookCard } from "@/components/BookCard";
import { BookCard as BookCardPremium } from "@/components/premium/BookCard";
import { z } from "zod";

type SearchResults = {
  books: Array<z.infer<typeof selectSourceWithRelationsSchema>>;
  quotes: Array<z.infer<typeof selectQuoteWithRelationsSchema>>;
};

import { getIsPremium } from "@/lib/utils";

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

  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      const isPremium = await getIsPremium();
      setIsPremium(isPremium);
    };

    fetchPremiumStatus();
  }, []);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true);
    try {
      if (data && data.searchQuery) {
        let searchReturned;

        if (isPremium) {
          searchReturned = await searchPremium(data.searchQuery);
        } else {
          searchReturned = await search(data.searchQuery);
        }

        if (searchReturned) {
          setSearchResults(searchReturned as SearchResults);
        }
      } else {
        setSearchResults({ books: [], quotes: [] });
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
                {isPremium
                  ? "Books, subtitles, authors, quotes, notes, and other things..."
                  : "Books, subtitles, authors, quotes..."}{" "}
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
                      {isPremium ? (
                        <BookCardPremium
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
                      ) : (
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
                      )}
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
                      {isPremium ? (
                        <QuoteBookCardBrutalPremium
                          bookId={quote.source.id}
                          bookTitle={quote.source.title}
                          bookAuthor={quote.source.author as string}
                          quote={quote.content}
                          note={quote.note ?? ""}
                          location={quote.location ?? ""}
                          color={quote.color || ""}
                          setOpen={setOpen}
                        />
                      ) : (
                        <QuoteBookCardBrutal
                          bookId={quote.source.id}
                          bookTitle={quote.source.title}
                          bookAuthor={quote.source.author as string}
                          quote={quote.content}
                          note={quote.note ?? ""}
                          location={quote.location ?? ""}
                          color={quote.color || ""}
                          setOpen={setOpen}
                        />
                      )}
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
            {isPremium
              ? "Books, subtitles, authors, quotes, notes, and other things..."
              : "Books, subtitles, authors, quotes..."}
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
                  <QuoteBookCardBrutal
                    bookId={quote.source.id}
                    bookTitle={quote.source.title}
                    bookAuthor={quote.source.author as string}
                    quote={quote.content}
                    note={quote.note ?? ""}
                    location={quote.location ?? ""}
                    color={quote.color || ""}
                    setOpen={setOpen}
                  />
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
