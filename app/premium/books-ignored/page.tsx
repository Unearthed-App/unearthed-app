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

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useState } from "react";

import {
  getBooks,
  toggleIgnoredBook,
  stopIgnoreAllSources,
} from "@/server/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { AnimatedLoader } from "@/components/AnimatedLoader";
import { Crimson_Pro } from "next/font/google";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Smile } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

export default function BooksIgnored() {
  const queryClient = useQueryClient();
  const [isStopIgnoreAllDialogOpen, setIsStopIgnoreAllDialogOpen] = useState(false);

    const stopIgnoreAllMutation = useMutation({
      mutationFn: stopIgnoreAllSources,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ignored-books"] });
        toast({
          title: `Stopped ignoring successfully`,
          description: "",
        });
        setIsStopIgnoreAllDialogOpen(false);
      },
    });

      const handleConfirmStopIgnoreAll = async () => {
        await stopIgnoreAllMutation.mutate();
      };

  const {
    data: ignoredBooks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ignored-books"],
    queryFn: () =>
      getBooks({
        ignored: true,
      }),
  });

  const toggleIgnoreMutation = useMutation({
    mutationFn: toggleIgnoredBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ignored-books"] });
    },
  });

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

  if (isLoading)
    return (
      <div className="pt-32 flex items-center justify-center">
        <AnimatedLoader />
      </div>
    );

  if (!ignoredBooks || ignoredBooks.length == 0) {
    return (
      <div className="pt-32 p-4">
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <p className="text-center py-12">
            <b>None found.</b>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 p-4 flex flex-col">
      <div className="flex items-center justify-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <ConfirmationDialog
                isOpen={isStopIgnoreAllDialogOpen}
                onOpenChange={(open) => {
                  setIsStopIgnoreAllDialogOpen(open);
                }}
                onConfirm={handleConfirmStopIgnoreAll}
                title="Stop Ignoring All Books"
                description="Are you sure you want to stop ignoring all of your books?"
                confirmText="Stop Ignoring"
                cancelText="Cancel"
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="brutal"
                    onClick={() => setIsStopIgnoreAllDialogOpen(true)}
                    disabled={stopIgnoreAllMutation.isPending}
                  >
                    <Smile className="w-6 h-6 mr-2" />
                    Stop Ignoring All
                  </Button>
                </AlertDialogTrigger>
              </ConfirmationDialog>
            </TooltipTrigger>
            <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
              <p>Stop ignoring everything</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div>
        <div className="">
          <div className="py-4 w-full flex items-center justify-center">
            <div className="w-full">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-x-4 gap-y-2 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3"
              >
                {ignoredBooks.map((book) => (
                  <motion.div
                    variants={itemVariants}
                    key={book.id}
                    className="flex justify-center"
                  >
                    <div className="mb-2 flex w-full p-2 md:p-4 rounded-lg border-2 bg-card">
                      <div className="flex items-center">
                        {book.media && book.media.url ? (
                          <Link
                            href={`/premium/book/${book.id}`}
                            className="w-[90px] md:w-[100px]"
                          >
                            <Image
                              src={book.media.url}
                              width={100}
                              height={100}
                              alt="Picture of the book"
                              className="rounded-lg border-2 border-black dark:border-white shadow-xl"
                            />
                          </Link>
                        ) : (
                          <p></p>
                        )}
                      </div>
                      <div className="pl-2 md:pl-4 flex flex-wrap justify-between">
                        <div className="text-foreground font-semibold text-sm mb-4">
                          <h4
                            className={`${crimsonPro.className} font-extrabold text-xl md:text-3xl`}
                          >
                            {book.title}
                          </h4>
                          <div className="text-muted text-xs">
                            {book.subtitle}
                          </div>
                          <div className="text-secondary text-xs">
                            by {book.author}
                          </div>
                        </div>

                        <div className="flex flex-wrap w-full">
                          <div className="w-full md:w-auto md:pr-2 pb-2 md:pb-0">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    className="w-full md:w-36"
                                    variant="brutal"
                                    onClick={() =>
                                      toggleIgnoreMutation.mutate({
                                        bookId: book.id,
                                        ignored: !book.ignored,
                                      })
                                    }
                                    disabled={toggleIgnoreMutation.isPending}
                                  >
                                    Stop Ignoring
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                                  <p>Click to stop ignoring this book</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <div className="flex w-full md:w-auto">
                            <Link
                              href={`/premium/book/${book.id}`}
                              className="w-full text-lg block"
                            >
                              <Button className="w-full md:w-36">
                                {book.quotes.length}{" "}
                                <span className="ml-2">
                                  {" "}
                                  {book.quotes.length == 1 ? "Quote" : "Quotes"}
                                </span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
