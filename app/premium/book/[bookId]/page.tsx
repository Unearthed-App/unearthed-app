"use client";

import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
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
import { QuoteCardBrutal } from "@/components/premium/QuoteCardBrutal";
import { AnimatedLoader } from "@/components/AnimatedLoader";
import { QuoteFormDialog } from "@/components/premium/QuoteForm/QuoteFormDialog";

export default function Book({ params }: { params: { bookId: string } }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: book,
    isLoading: isLoadingBook,
    isError,
  } = useQuery({
    queryKey: ["book"],
    queryFn: () => getBook(params.bookId),
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

  return (
    <div className="pt-32 px-4 md:px-12 lg:px-24 xl:px-12 2xl:px-24">
      <div className="flex flex-wrap items-center mb-4">
        {book && !("error" in book) && book.origin === "UNEARTHED" && (
          <div className="mr-2 mb-2 md:mb-0">
            <QuoteFormDialog
              buttonText="Add a Quote"
              onQuoteAdded={refreshQuotes}
              source={book as Source}
            />
          </div>
        )}
        <div className="w-full md:w-auto">
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
              imageUrl={book.imageUrl as string}
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
                      origin={book.origin!}
                      bookTitle={book.title}
                      bookAuthor={book.author as string}
                      quote={quote.content}
                      note={quote.note ?? ""}
                      location={quote.location ?? ""}
                      color={quote.color || "Blue highlight"}
                      id={quote.id}
                      onQuoteDeleted={refreshQuotes}
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
