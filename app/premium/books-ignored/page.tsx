"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import React from "react";
import { getBooks, toggleIgnoredBook } from "@/server/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Frown } from "lucide-react";
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
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

export default function BooksIgnored() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: books,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["books"],
    queryFn: () =>
      getBooks({
        ignored: true,
      }),
  });

  const toggleIgnoreMutation = useMutation({
    mutationFn: toggleIgnoredBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
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

  if (!books || books.length == 0) {
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
                {books.map((book) => (
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
