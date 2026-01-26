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

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Loader2, Book, Quote, Tag, Trash, Unlink } from "lucide-react";

export const dynamic = 'force-dynamic';
import {
  getAllTags,
  deleteAllTags,
  deleteTag,
  deleteOrphanedTags,
} from "@/server/actions-premium";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ManualTagDialog } from "@/components/premium/ManualTagDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function Tags() {
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [deletingTagId, setDeletingTagId] = useState<string | null>(null);
  const [deleteDialogOpenMap, setDeleteDialogOpenMap] = useState<
    Record<string, boolean>
  >({});
  const [isDeleteOrphansDialogOpen, setIsDeleteOrphansDialogOpen] =
    useState(false);
  const queryClient = useQueryClient();

  const { data: tags, isLoading } = useQuery({
    queryKey: ["all-tags"],
    queryFn: getAllTags,
  });

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllTags,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-tags"] });
      toast({
        title: "Tags deleted",
        description: "All tags have been removed successfully",
      });
      setIsDeleteAllDialogOpen(false);
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: async (tagId: string) => {
      setDeletingTagId(tagId);
      await deleteTag(tagId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-tags"] });
      toast({
        title: "Tag deleted",
        description: "The tag has been removed successfully",
      });
      setDeletingTagId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the tag",
        variant: "destructive",
      });
      setDeletingTagId(null);
    },
  });

  const deleteOrphansMutation = useMutation({
    mutationFn: deleteOrphanedTags,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["all-tags"] });
      toast({
        title: "Orphaned tags deleted",
        description: `Successfully deleted ${data.deletedCount} orphaned tags`,
      });
      setIsDeleteOrphansDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete orphaned tags",
        variant: "destructive",
      });
    },
  });

  const handleConfirmDeleteAll = async () => {
    await deleteAllMutation.mutate();
  };

  const handleConfirmDeleteOrphans = async () => {
    await deleteOrphansMutation.mutate();
  };

  const handleOpenDeleteDialog = (tagId: string, open: boolean) => {
    setDeleteDialogOpenMap((prev) => ({
      ...prev,
      [tagId]: open,
    }));
  };

  if (isLoading) {
    return (
      <div className="pt-32 p-4 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!tags || tags.length === 0) {
    return (
      <div className="pt-32 p-4">
        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <p className="text-center">
            <b>No tags found.</b> Start adding tags to your books to see them
            here.
          </p>
          <ManualTagDialog />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <h1
            className={`${crimsonPro.className} text-xl md:text-4xl font-bold flex items-center`}
          >
            <Tag className="h-8 w-8 mr-2" />
            Tags ({tags.length})
          </h1>
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
            <ConfirmationDialog
              isOpen={isDeleteOrphansDialogOpen}
              onOpenChange={(open) => setIsDeleteOrphansDialogOpen(open)}
              onConfirm={handleConfirmDeleteOrphans}
              title="Delete Orphaned Tags"
              description="Are you sure you want to delete all tags that are not linked to any books or quotes? This action cannot be undone."
              confirmText="Delete"
              cancelText="Cancel"
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructivebrutal"
                  size={"sm"}
                  onClick={() => setIsDeleteOrphansDialogOpen(true)}
                  disabled={deleteOrphansMutation.isPending}
                >
                  {deleteOrphansMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Unlink className="h-4 w-4 mr-2" />
                  )}
                  Delete Orphaned
                </Button>
              </AlertDialogTrigger>
            </ConfirmationDialog>
            <ConfirmationDialog
              isOpen={isDeleteAllDialogOpen}
              onOpenChange={(open) => setIsDeleteAllDialogOpen(open)}
              onConfirm={handleConfirmDeleteAll}
              title="Delete All Tags"
              description="Are you sure you want to delete all tags? This will remove them from all books and quotes. This action cannot be undone."
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
            <ManualTagDialog />
          </div>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {tags.map((tag) => (
            <motion.div key={tag.id} variants={itemVariants}>
              <Card className="h-full hover:bg-accent transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Link href={`/premium/tag/${tag.id}`}>
                      <CardTitle>{tag.title}</CardTitle>
                    </Link>
                    <ConfirmationDialog
                      isOpen={deleteDialogOpenMap[tag.id] || false}
                      onOpenChange={(open) =>
                        handleOpenDeleteDialog(tag.id, open)
                      }
                      title="Delete Tag"
                      description="Are you sure you want to delete this tag? This will remove it from all books and quotes. This action cannot be undone."
                      confirmText="Delete"
                      cancelText="Cancel"
                      onConfirm={() => deleteTagMutation.mutate(tag.id)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructivebrutal"
                          size="icon"
                          disabled={
                            deleteTagMutation.isPending &&
                            deletingTagId === tag.id
                          }
                        >
                          {deleteTagMutation.isPending &&
                          deletingTagId === tag.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                    </ConfirmationDialog>
                  </div>
                  <CardDescription className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Book className="h-4 w-4" />
                      <span>
                        Linked to {tag.sourceCount}{" "}
                        {tag.sourceCount === 1 ? "book" : "books"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Quote className="h-4 w-4" />
                      <span>
                        Linked to {tag.quoteCount}{" "}
                        {tag.quoteCount === 1 ? "quote" : "quotes"}
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <Link href={`/premium/tag/${tag.id}`}>
                  <CardContent>
                    <p className="text-sm font-semibold text-alternate">
                      {tag.description || "No description provided"}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
