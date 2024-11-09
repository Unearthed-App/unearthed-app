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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { selectSourceSchema, selectQuoteSchema } from "@/db/schema";
import { getBook, getBookTitles } from "@/server/actions";
import { updateBookImage } from "@/server/actions-premium";

type Source = z.infer<typeof selectSourceSchema>;
const QuotesArraySchema = z.array(selectQuoteSchema);
import { toast } from "@/hooks/use-toast";

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
import { UploadButton } from "@/utils/uploadthing";

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
          <div className="w-full xl:w-1/6 pr-4">
            <BookHeader
              title={book.title}
              subtitle={book.subtitle as string}
              author={book.author as string}
              imageUrl={book.media ? (book.media.url as string) : ""}
              ignored={book.ignored as boolean}
            />
            {book.origin == "UNEARTHED" && (
              <div className="w-64 xl:w-full mt-4">
                <h4 className="font-semibold mb-1 block">Change the image:</h4>
                <UploadButton
                  appearance={{
                    button: `w-full ut-ready:bg-card ut-ready:text-black ut-uploading:text-black ut-uploading:cursor-not-allowed
                    h-12 border-2 p-2.5 rounded-md transition-all duration-200
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
                      router.refresh();
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
                      color={quote.color || ""}
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
