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

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  ImageIcon,
  MessageSquareQuote,
  EllipsisVertical,
  BookMarked,
  BookUp,
  Eye,
  Frown,
  Trash,
} from "lucide-react";
import { Crimson_Pro } from "next/font/google";
import { z } from "zod";
import { selectSourceWithRelationsSchema } from "@/db/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ConfirmationDialog from "@/components/ConfirmationDialog";

const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

type Source = z.infer<typeof selectSourceWithRelationsSchema>;

interface BookCardDetailedProps {
  book: Source;
  onDeleteClick: (book: Source) => void;
  onToggleIgnore: (bookId: string, ignored: boolean) => void;
  onForceNotionSync?: (book: Source) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  handleConfirmDelete: () => void;
  bookToDelete: Source | null;
  setBookToDelete: (book: Source | null) => void;
  showNotionSync: boolean;
}

export function BookCardDetailed({
  book,
  onDeleteClick,
  onToggleIgnore,
  onForceNotionSync,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  handleConfirmDelete,
  bookToDelete,
  setBookToDelete,
  showNotionSync,
}: BookCardDetailedProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 33 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
          },
        },
      }}
      className="flex justify-center"
    >
      <div className="relative mb-2 flex w-full p-2 rounded-lg border-2 bg-card">
        <div className="flex items-center">
          {book.media && book.media.url ? (
            <Link
              href={`/premium/book/${book.id}`}
              className="w-[40px] md:w-[100px]"
            >
              <Image
                src={book.media.url}
                width={100}
                height={100}
                alt="Picture of the book"
                className="hover:opacity-70 rounded-lg border-2 border-black dark:border-white shadow-xl"
              />
            </Link>
          ) : (
            <Link
              href={`/premium/book/${book.id}`}
              className="w-[40px] md:w-[100px] h-full flex items-center"
            >
              <div className="w-[40px] md:w-[100px] h-full max-h-[160px] rounded-lg border-2 border-black dark:border-white shadow-xl flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-muted" />
              </div>
            </Link>
          )}
        </div>
        <div className="w-full flex flex-col justify-between">
          <div className="h-full w-full flex justify-between">
            <div className="h-full w-full px-2 md:px-4">
              <h3
                className={`${crimsonPro.className} font-extrabold text-xl md:text-3xl`}
              >
                {book.title}
              </h3>
              <div className="text-muted text-xs">{book.subtitle}</div>
              <div className="text-secondary text-xs">by {book.author}</div>
            </div>
            <div className="h-full w-12">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    <Link
                      href={`https://read.amazon.com/?asin=${book.asin}`}
                      target="_blank"
                    >
                      <DropdownMenuItem>
                        <BookMarked className="mr-2 h-4 w-4" />
                        <span>Read on Kindle</span>
                      </DropdownMenuItem>
                    </Link>

                    {showNotionSync && onForceNotionSync && (
                      <DropdownMenuItem onClick={() => onForceNotionSync(book)}>
                        <BookUp className="mr-2 h-4 w-4" />
                        <span>Update Notion</span>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      onClick={() => onToggleIgnore(book.id, !book.ignored)}
                    >
                      <Frown className="mr-2 h-4 w-4" />
                      <span>Ignore this book</span>
                    </DropdownMenuItem>

                    <ConfirmationDialog
                      isOpen={
                        isDeleteDialogOpen && bookToDelete?.id === book.id
                      }
                      onOpenChange={(open) => {
                        setIsDeleteDialogOpen(open);
                        if (!open) setBookToDelete(null);
                      }}
                      onConfirm={handleConfirmDelete}
                      title="Delete Book"
                      description={
                        book.origin === "KINDLE"
                          ? `Are you sure you want to delete "${book.title}"? As this is a Kindle book, it will reappear here on the next sync, so you should use the 'Ignore' button instead.`
                          : `Are you sure you want to delete "${book.title}"? This action cannot be undone.`
                      }
                      confirmText="Delete"
                      cancelText="Cancel"
                    >
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            onDeleteClick(book);
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Remove completely</span>
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </ConfirmationDialog>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="h-12 w-full flex justify-between space-x-6 px-2 md:px-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-14 h-10 flex items-center font-bold text-xs">
                    <MessageSquareQuote className="h-6 w-6 mr-2" />{" "}
                    {book.quotes?.length ?? 0}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                  <p># Quotes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-8 h-10 flex items-center">
                    <Link
                      className="hover:text-primary"
                      href={`/premium/book/${book.id}`}
                    >
                      <Button className="p-1" variant="ghost" size="icon">
                        <Eye className="w-6 h-6" />
                      </Button>
                    </Link>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                  <p>View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
