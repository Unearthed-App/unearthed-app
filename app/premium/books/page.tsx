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

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export const dynamic = "force-dynamic";
import { useCallback, useState } from "react";
import {
  ignoreAllSources,
  deleteAllSources,
  getPaginatedBooks,
  getProfile,
  syncSourceToNotion,
  toggleIgnoredBook,
} from "@/server/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash, Book, Eye } from "lucide-react";
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
import { PaginationControls } from "@/components/PaginationControls";
import { BookCardDetailed } from "@/components/premium/BookCardDetailed";
type Source = z.infer<typeof selectSourceWithRelationsSchema>;
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

export default function Books() {
  const queryClient = useQueryClient();
  const [bookToDelete, setBookToDelete] = useState<Source | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isIgnoreAllDialogOpen, setIsIgnoreAllDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
  });

  const {
    data: booksData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["books", currentPage],
    queryFn: () =>
      getPaginatedBooks({
        ignored: false,
        page: currentPage,
        pageSize,
      }),
  });

  const totalPages = Math.ceil((booksData?.total || 0) / pageSize);
  const books = booksData?.books || [];

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

  const ignoreAllMutation = useMutation({
    mutationFn: ignoreAllSources,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast({
        title: `Ignored successfully`,
        description: "",
      });
      setIsIgnoreAllDialogOpen(false);
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

  const handleConfirmIgnoreAll = async () => {
    await ignoreAllMutation.mutate();
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
    <BookCardDetailed
      key={book.id}
      book={book}
      onDeleteClick={handleDeleteClick}
      onToggleIgnore={(bookId, ignored) =>
        toggleIgnoreMutation.mutate({ bookId, ignored })
      }
      onForceNotionSync={forceNotionSync}
      isDeleteDialogOpen={isDeleteDialogOpen}
      setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      handleConfirmDelete={handleConfirmDelete}
      bookToDelete={bookToDelete}
      setBookToDelete={setBookToDelete}
      showNotionSync={
        !isLoadingProfile &&
        !!profile?.notionAuthData &&
        !!profile?.notionDatabaseId
      }
    />
  );
  return (
    <>
      <div className="pt-32 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between mb-8">
            <h1
              className={`${crimsonPro.className} text-xl md:text-4xl font-bold flex items-center`}
            >
              <Book className="h-8 w-8 mr-2" />
              Books ({booksData?.total || 0})
            </h1>
            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              <ConfirmationDialog
                isOpen={isIgnoreAllDialogOpen}
                onOpenChange={(open) => setIsIgnoreAllDialogOpen(open)}
                onConfirm={handleConfirmIgnoreAll}
                title="Ignore All Books"
                description="Are you sure you want to ignore all books? You can always un-ignore them later."
                confirmText="Ignore"
                cancelText="Cancel"
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="brutal"
                    size={"sm"}
                    onClick={() => setIsIgnoreAllDialogOpen(true)}
                    disabled={ignoreAllMutation.isPending}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ignore All
                  </Button>
                </AlertDialogTrigger>
              </ConfirmationDialog>
              <ConfirmationDialog
                isOpen={isDeleteAllDialogOpen}
                onOpenChange={(open) => setIsDeleteAllDialogOpen(open)}
                onConfirm={handleConfirmDeleteAll}
                title="Delete All Books"
                description="Are you sure you want to delete all books? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructivebrutal"
                    size={"sm"}
                    onClick={() => setIsDeleteAllDialogOpen(true)}
                    disabled={deleteAllMutation.isPending}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete All
                  </Button>
                </AlertDialogTrigger>
              </ConfirmationDialog>
              <UploadFormDialog onUpload={refreshBooks} />
              <SourceFormDialog
                buttonText="Add a Book"
                onSourceAdded={refreshBooks}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto mt-4">
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
      {books.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
}
