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

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrCreateDailyReflection } from "@/server/actions";
import { Button } from "@/components/ui/button";
import { QuoteCardBrutal } from "@/components/QuoteCardBrutal";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";

import { z } from "zod";
import { selectQuoteSchema, selectSourceSchema } from "@/db/schema";
import { AnimatedLoader } from "../AnimatedLoader";
type Quote = z.infer<typeof selectQuoteSchema>;
type Source = z.infer<typeof selectSourceSchema>;
import { getUserUtcOffset } from "@/lib/utils";

import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ConfirmationDialog from "@/components/ConfirmationDialog"; // Import the ConfirmationDialog we created

import { Crimson_Pro } from "next/font/google";
import { useState } from "react";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

interface DailyQuote {
  book: Source;
  quote: Quote;
}

interface DailyQuoteCardProps {
  initialData?: DailyQuote;
}

export function DailyQuoteCard({ initialData }: DailyQuoteCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data: utcOffset, isLoading: isUtcOffsetLoading } = useQuery({
    queryKey: ["utcOffset"],
    queryFn: getUserUtcOffset,
  });
  const {
    data: dailyQuote,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dailyQuote"],
    queryFn: () => getOrCreateDailyReflection({ utcOffset: utcOffset ?? 0 }),
    initialData: initialData,
  });

  const { mutate: getNewQuote, isPending } = useMutation({
    mutationFn: () =>
      getOrCreateDailyReflection({
        replaceDailyQuote: true,
        utcOffset: utcOffset ?? 0,
      }),
    onSuccess: (newQuote) => {
      queryClient.setQueryData(["dailyQuote"], newQuote);
    },
  });

  if (isLoading || isUtcOffsetLoading)
    return (
      <div className="pt-32 flex items-center justify-center">
        <AnimatedLoader />
      </div>
    );

  if (isError) return <div>Error fetching quote</div>;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {dailyQuote && (
        <div className="relative">
          {dailyQuote.book && (
            <div className="flex">
              <div className="hidden md:block -mr-2 w-[100px]">
                {dailyQuote.book.media && dailyQuote.book.media.url && (
                  <Link
                    href={`/premium/book/${dailyQuote.book.id}`}
                    className="w-[90px] md:w-[100px]"
                  >
                    <Image
                      src={dailyQuote.book.media.url}
                      width={100}
                      height={100}
                      alt="Picture of the book"
                      className="rounded-tl-lg rounded-bl-lg border-2 border-black shadow"
                    />
                  </Link>
                )}
              </div>
              <div className="border-2 border-black rounded-lg bg-black max-w-[500px]">
                <div className="">
                  <div className="rounded-t-lg  bg-black text-white p-4 text-center">
                    <Link
                      href={`/premium/book/${dailyQuote.book.id}`}
                      className="w-[90px] md:w-[100px]"
                    >
                      <h2
                        className={`${crimsonPro.className} font-extrabold text-2xl md:text-5xl text-center`}
                      >
                        {dailyQuote?.book.title}{" "}
                      </h2>
                    </Link>
                    <span className="text-xs text-center">
                      by {dailyQuote.book.author}
                    </span>
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg">
                  <QuoteCardBrutal
                    bookTitle={dailyQuote.book.title}
                    bookAuthor={dailyQuote.book.author as string}
                    quote={dailyQuote?.quote.content}
                    note={dailyQuote?.quote.note ?? ""}
                    location={dailyQuote?.quote.location ?? ""}
                    color={dailyQuote?.quote.color || ""}
                  />
                  <div className="flex md:hidden justify-center">
                    {dailyQuote.book.media && dailyQuote.book.media.url && (
                      <Link
                        href={`/premium/book/${dailyQuote.book.id}`}
                        className="w-[90px] md:w-[100px]"
                      >
                        <Image
                          src={dailyQuote.book.media.url}
                          width={100}
                          height={100}
                          alt="Picture of the book"
                          className="rounded-lg border-2 border-black shadow"
                        />
                      </Link>
                    )}
                  </div>
                  <ConfirmationDialog
                    isOpen={isDialogOpen}
                    onOpenChange={(open) => {
                      setIsDialogOpen(open);
                    }}
                    onConfirm={getNewQuote}
                    title="Replace Daily Reflection"
                    description={`Are you sure you want to replace this Daily Reflection with a new one? This action cannot be undone.`}
                    confirmText="Yes"
                    cancelText="Cancel"
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        id="newQuoteButton"
                        className="mt-4 w-full"
                        type="button"
                        onClick={() => setIsDialogOpen(true)}
                        disabled={isPending}
                      >
                        {isPending
                          ? "Loading..."
                          : "Get a new Daily Reflection"}
                      </Button>
                    </AlertDialogTrigger>
                  </ConfirmationDialog>
                </div>
              </div>
              <div className="hidden md:block -ml-2 w-[100px]"></div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
