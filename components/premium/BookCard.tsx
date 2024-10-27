"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import React from "react";

import { toggleIgnoredBook } from "@/server/actions";

import { useMutation } from "@tanstack/react-query";

import { Frown } from "lucide-react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface QuoteCardProps {
  id: string;
  title: string;
  ignored: boolean;
  subtitle?: string;
  author: string;
  imageUrl: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BookCard({
  id,
  title,
  ignored,
  subtitle,
  author,
  imageUrl,
  setOpen,
}: QuoteCardProps) {
  const router = useRouter();

  const {
    mutate: server_toggleIgnoredBook,
    isPending: isPendingToggleIgnoredBook,
  } = useMutation({
    mutationFn: toggleIgnoredBook,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="mb-2 flex w-full p-2 md:p-4 rounded-lg border-2 bg-card">
      <div className="flex items-center">
        {imageUrl ? (
          <Link
            href={`/premium/book/${id}`}
            className=""
            onClick={(e) => {
              setOpen(false);
            }}
          >
            <Image
              src={imageUrl}
              width={150}
              height={150}
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
            {title}
          </h4>
          <div className="text-muted text-xs">{subtitle}</div>
          <div className="text-secondary text-xs">by {author}</div>
        </div>

        <div className="flex w-full">
          <div className="w-1/2 pr-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    className="w-full md:w-64"
                    variant="destructivebrutal"
                    onClick={(e) => {
                      server_toggleIgnoredBook({
                        bookId: id,
                        ignored: !ignored,
                      });
                      router.push(`/premium/books-ignored`);
                      setOpen(false);
                    }}
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
          <div className="w-1/2 flex">
            <Link
              href={`/premium/book/${id}`}
              className="w-full text-lg block"
              onClick={(e) => {
                setOpen(false);
              }}
            >
              <Button className="w-full md:w-64">View</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
