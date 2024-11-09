"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import {
  getBooks,
  getProfile,
  syncSourceToNotion,
  toggleIgnoredBook,
} from "@/server/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Frown, Trash, ImageIcon } from "lucide-react";
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
import ConfirmationDialog from "@/components/ConfirmationDialog"; // Import the ConfirmationDialog we created

const crimsonPro = Crimson_Pro({ subsets: ["latin"] });
type Source = z.infer<typeof selectSourceWithRelationsSchema>;

export default function Books() {
  const queryClient = useQueryClient();
  const [bookToDelete, setBookToDelete] = useState<Source | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const handleDeleteClick = (book: Source) => {
    setBookToDelete(book);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (bookToDelete) {
      await deleteBookMutation.mutate({ source: bookToDelete });
    }
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

  const renderBookCard = (book: Source) => (
    <motion.div
      variants={itemVariants}
      key={book.id}
      className="flex justify-center"
    >
      <motion.div
        whileHover={{
          scale: 1.03,
          zIndex: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
        className="pt-14 md:pt-4 relative mb-2 flex w-full p-2 md:p-4 rounded-lg border-2 bg-card"
      >
        <div className="absolute md:right-0 top-0 flex pt-2 pr-2 space-x-2">
          {!isLoadingProfile &&
            profile?.notionAuthData &&
            profile?.notionDatabaseId && (
              <div className="">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="p-0"
                        variant="brutal"
                        size={"icon"}
                        onClick={() => forceNotionSync(book)}
                      >
                        <Image
                          src="/notion-logo-no-background.png"
                          alt="Notion Logo"
                          width={70}
                          height={70}
                          className="w-8 h-8 bg-white rounded-sm"
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                      <p>Click to update Notion database</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          <div className="">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ConfirmationDialog
                    isOpen={isDeleteDialogOpen && bookToDelete?.id === book.id}
                    onOpenChange={(open) => {
                      setIsDeleteDialogOpen(open);
                      if (!open) setBookToDelete(null);
                    }}
                    onConfirm={handleConfirmDelete}
                    title="Delete Book"
                    description={`Are you sure you want to delete "${book.title}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        className="p-1"
                        variant="destructivebrutal"
                        size="icon"
                        onClick={() => handleDeleteClick(book)}
                        disabled={deleteBookMutation.isPending}
                      >
                        <Trash className="w-6 h-6" />
                      </Button>
                    </AlertDialogTrigger>
                  </ConfirmationDialog>
                </TooltipTrigger>
                <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                  <p>Remove this completely</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="p-1"
                    variant="brutal"
                    size={"icon"}
                    onClick={() =>
                      toggleIgnoreMutation.mutate({
                        bookId: book.id,
                        ignored: !book.ignored,
                      })
                    }
                    disabled={toggleIgnoreMutation.isPending}
                  >
                    <Frown className="w-6 h-6 " />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                  <p>Click to ignore this book</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex items-center">
          {book.media && book.media.url ? (
            <Link
              href={`/dashboard/book/${book.id}`}
              className="w-[90px] md:w-[100px]"
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
              href={`/dashboard/book/${book.id}`}
              className="w-[90px] md:w-[100px] h-full flex items-center"
            >
              <div className="w-[90px] md:w-[100px] h-full max-h-[160px] rounded-lg border-2 border-black dark:border-white shadow-xl flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-muted" />
              </div>
            </Link>
          )}
        </div>
        <div className="pl-2 md:pl-4 w-full flex flex-col justify-between h-full">
          <div className="w-full text-foreground font-semibold text-sm mb-4">
            <h4
              className={`${crimsonPro.className} font-extrabold text-xl md:text-3xl`}
            >
              <Link
                className="hover:text-primary md:pr-36"
                href={`/dashboard/book/${book.id}`}
              >
                {book.title}
              </Link>
            </h4>
            <div className="text-muted text-xs">{book.subtitle}</div>
            <div className="text-secondary text-xs">by {book.author}</div>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 flex pb-0 md:pb-2 pr-2 space-x-2">
          <div className="mt-2 text-xl">
            <Link
              href={`/dashboard/book/${book.id}`}
              className="text-xs font-bold"
            >
              <span className="font-bold">{book.quotes.length} </span>
              <span className="ml-1">
                {" "}
                {book.quotes.length == 1 ? "Quote" : "Quotes"}
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

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
                {books.map(renderBookCard)}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
