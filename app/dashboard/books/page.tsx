"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import React from "react";
import {
  getBooks,
  getProfile,
  syncSourceToNotion,
  toggleIgnoredBook,
} from "@/server/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { toast } from "@/hooks/use-toast";
import { selectSourceSchema } from "@/db/schema";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });
type Source = z.infer<typeof selectSourceSchema>;

export default function Books() {
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading: isLoadingProfile,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
  });

  const {
    data: books,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["books"],
    queryFn: () =>
      getBooks({
        ignored: false,
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

  async function forceNotionSync(book: Source) {
    try {
      
      await syncSourceToNotion(book.id);

      toast({
        title: `Notion Sync started for ${book.title}`,
        description: "Please wait and then check Notion.",
      });
    } catch (error) {
      console.error("Failed:", error);

      toast({
        title: "There was an error",
        description: error as string,
        variant: "destructive",
      });
    }
  }

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
            <b>None found.</b> You might need to check your{" "}
            <Link href="/dashboard/books-ignored">
              <span className="font-bold text-secondary">Ignored Books</span>
            </Link>
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
                        {book.imageUrl ? (
                          <Link
                            href={`/dashboard/book/${book.id}`}
                            className="w-[90px] md:w-[100px]"
                          >
                            <Image
                              src={book.imageUrl}
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
                                    variant="destructivebrutal"
                                    onClick={() =>
                                      toggleIgnoreMutation.mutate({
                                        bookId: book.id,
                                        ignored: !book.ignored,
                                      })
                                    }
                                    disabled={toggleIgnoreMutation.isPending}
                                  >
                                    <Frown className="mr-2 h-4 w-4" /> Ignore me
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                                  <p>Click to ignore this book</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <div className="flex w-full md:w-auto">
                            <Link
                              href={`/dashboard/book/${book.id}`}
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
                          {!isLoadingProfile && profile?.notionAuthData &&
                            profile?.notionDatabaseId && (
                              <div className="w-full md:w-auto md:pl-2 pb-2 md:pb-0 mt-2 md:mt-0">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        className="w-full md:w-36"
                                        onClick={() => forceNotionSync(book)}
                                      >
                                        Force Notion Sync
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                                      <p>Click to update Notion database</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            )}
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
