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
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import {
  deleteAllSources,
  getBooks,
  getProfile,
  syncSourceToNotion,
  toggleIgnoredBook,
} from "@/server/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Frown,
  Trash,
  ImageIcon,
  MessageSquareQuote,
  EllipsisVertical,
  BookMarked,
  BookUp,
  Eye,
} from "lucide-react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Link from "next/link";
import { AnimatedLoader } from "@/components/AnimatedLoader";
import { Crimson_Pro } from "next/font/google";
import { toast } from "@/hooks/use-toast";
import { selectSourceWithRelationsSchema } from "@/db/schema";
import { deleteSource } from "@/server/actions";
import { SourceFormDialog } from "@/components/premium/SourceForm/SourceFormDialog";
import { UploadFormDialog } from "@/components/premium/UploadForm/UploadFormDialog";
import ConfirmationDialog from "@/components/ConfirmationDialog"; // Import the ConfirmationDialog we created
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });
type Source = z.infer<typeof selectSourceWithRelationsSchema>;

export default function Books() {
  const queryClient = useQueryClient();
  const [bookToDelete, setBookToDelete] = useState<Source | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
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
      toast({
        title: `Ignored successfully`,
        description: "You can always reverse this later",
      });
    },
  });
  const deleteBookMutation = useMutation({
    mutationFn: deleteSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast({
        title: `Removed successfully`,
        description: "",
      });
      setBookToDelete(null);
      setIsDeleteDialogOpen(false);
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllSources,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast({
        title: `Removed successfully`,
        description: "",
      });
      setIsDeleteAllDialogOpen(false);
    },
  });

  const handleDeleteClick = (book: Source) => {
    setBookToDelete(book);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (bookToDelete) {
      await deleteBookMutation.mutate({ source: bookToDelete });
    }
  };

  const handleConfirmDeleteAll = async () => {
    await deleteAllMutation.mutate();
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

  const refreshBooks = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["books"] });
  }, [queryClient]);

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
        <div className="flex items-center justify-center space-x-2">
          <UploadFormDialog onUpload={refreshBooks} />
          <SourceFormDialog
            buttonText="Add a Book"
            onSourceAdded={refreshBooks}
          />
        </div>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <p className="text-center py-12">
            <b>None found.</b> You might need to check your{" "}
            <Link href="/premium/books-ignored">
              <span className="font-bold text-secondary">Ignored Books</span>
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const renderBookCard = (book: Source) => (
    <motion.div
      variants={itemVariants}
      key={book.id}
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
                  <Button variant="ghost" size={"icon"}>
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    <Link
                      className=""
                      href={`https://read.amazon.com/?asin=${book.asin}`}
                      target="_blank"
                    >
                      <DropdownMenuItem>
                        <BookMarked className="mr-2 h-4 w-4" />
                        <span>Read on Kindle</span>
                      </DropdownMenuItem>
                    </Link>

                    {!isLoadingProfile &&
                      profile?.notionAuthData &&
                      profile?.notionDatabaseId && (
                        <DropdownMenuItem onClick={() => forceNotionSync(book)}>
                          <BookUp className="mr-2 h-4 w-4" />
                          <span>Update Notion</span>
                        </DropdownMenuItem>
                      )}

                    <DropdownMenuItem
                      onClick={() =>
                        toggleIgnoreMutation.mutate({
                          bookId: book.id,
                          ignored: !book.ignored,
                        })
                      }
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
                            handleDeleteClick(book);
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
                    {book.quotes.length}
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
                      className="hover:text-primary md:pr-36"
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
  return (
    <div className="pt-32 p-4 flex flex-col">
      <div className="flex items-center justify-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <ConfirmationDialog
                isOpen={isDeleteAllDialogOpen}
                onOpenChange={(open) => {
                  setIsDeleteAllDialogOpen(open);
                }}
                onConfirm={handleConfirmDeleteAll}
                title="Delete All Books"
                description="Are you sure you want to delete all of your books?"
                confirmText="Delete"
                cancelText="Cancel"
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructivebrutal"
                    onClick={() => setIsDeleteAllDialogOpen(true)}
                    disabled={deleteAllMutation.isPending}
                  >
                    <Trash className="w-6 h-6 mr-2" />
                    Delete All
                  </Button>
                </AlertDialogTrigger>
              </ConfirmationDialog>
            </TooltipTrigger>
            <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
              <p>Remove this completely</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <UploadFormDialog onUpload={refreshBooks} />
        <SourceFormDialog
          buttonText="Add a Book"
          onSourceAdded={refreshBooks}
        />
      </div>
      <div>
        <div className="">
          <div className="py-4 w-full flex items-center justify-center">
            <div className="w-full">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-x-4 gap-y-2 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
              >
                {books.map(renderBookCard)}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
