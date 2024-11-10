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

import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { selectSourceSchema, selectQuoteSchema } from "@/db/schema";
import { getBook, getBookTitles } from "@/server/actions";

type Source = z.infer<typeof selectSourceSchema>;
const QuotesArraySchema = z.array(selectQuoteSchema);

import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Frown } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { QuoteCardBrutal } from "@/components/QuoteCardBrutal";
import { AnimatedLoader } from "@/components/AnimatedLoader";

export default function Book(props: { params: Promise<{ bookId: string }> }) {
  const params = use(props.params);

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const {
    data: book,
    mutate: server_getBook,
    isPending: isPendingBook,
  } = useMutation({
    mutationFn: getBook,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const {
    data: bookTitles,
    mutate: server_getBookTitles,
    isPending: isPendingBookTitles,
  } = useMutation({
    mutationFn: getBookTitles,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const displayQuotes =
    book && "quotes" in book ? QuotesArraySchema.parse(book.quotes) : [];
  const transformBookTitles = (books: Source[]) => {
    return books.map((book) => ({
      id: book.id,
      value: book.title.toLowerCase(),
      label: book.title,
      ignored: book.ignored,
    }));
  };

  useEffect(() => {
    // Load book titles
    server_getBookTitles();

    // Load quotes for the current book
    if (params.bookId) {
      server_getBook(params.bookId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBookSelect = (bookValue: string) => {
    const selectedBook = displayBookTitles.find(
      (book) => book.value === bookValue
    );
    if (selectedBook) {
      // Reload the page with the new book ID in the URL
      router.push(`/dashboard/book/${selectedBook.id}`);
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

  if (isPendingBook)
    return (
      <div className="pt-32 flex items-center justify-center">
        <AnimatedLoader />
      </div>
    );

  return (
    <div className="pt-32 px-4 md:px-12 lg:px-24 xl:px-12 2xl:px-24">
      <div className="flex flex-wrap items-center mb-4">
        <div className="mb-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                role="combobox"
                aria-expanded={open}
                className="justify-between"
              >
                {params.bookId
                  ? displayBookTitles.find((book) => book.id === params.bookId)
                      ?.label || "Select book..."
                  : "Select book..."}
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
                            className={cn("mr-2 h-4 w-4 text-destructive")}
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
      </div>

      {book && !("error" in book) && (
        <div className="flex flex-wrap">
          <div className="w-full xl:w-1/6 pr-2">
            <BookHeader
              title={book.title}
              subtitle={book.subtitle as string}
              author={book.author as string}
              imageUrl={book.media ? (book.media.url as string) : ""}
              ignored={book.ignored as boolean}
            />
          </div>

          <div className="w-full xl:w-5/6 pt-4 xl:pt-0 flex">
            {displayQuotes.length === 0 ? (
              <h3 className="text-xl text-center my-4 text-secondary">
                {/* No quotes in the selected book. */}
              </h3>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="columns-1 md:columns-2 xl:columns-3 gap-4"
              >
                {displayQuotes.map((quote) => (
                  <motion.div
                    className="mb-4 break-inside-avoid-column"
                    key={quote.id}
                    variants={itemVariants}
                  >
                    <QuoteCardBrutal
                      bookTitle={book.title}
                      bookAuthor={book.author as string}
                      quote={quote.content}
                      note={quote.note ?? ""}
                      location={quote.location ?? ""}
                      color={quote.color || ""}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
