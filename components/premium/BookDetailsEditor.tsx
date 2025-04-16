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

import { useState } from "react";
import { Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { updateBookDetails } from "@/server/actions-premium";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BookDetailsEditorProps {
  bookId: string;
  title: string;
  subtitle?: string | null;
  author?: string | null;
  asin?: string | null;
}

export function BookDetailsEditor({
  bookId,
  title,
  subtitle,
  author,
  asin,
}: BookDetailsEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editSubtitle, setEditSubtitle] = useState(subtitle || "");
  const [editAuthor, setEditAuthor] = useState(author || "");
  const [editAsin, setEditAsin] = useState(asin || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = async () => {
    if (!editTitle.trim()) {
      toast({
        title: "Title is required",
        description: "Please enter a title for the book",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      await updateBookDetails(
        bookId,
        editTitle,
        editSubtitle || null,
        editAuthor || null,
        editAsin || null
      );

      await queryClient.invalidateQueries({ queryKey: ["book", bookId] });

      toast({
        title: "Book details updated",
        description: "The book details have been successfully updated",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error updating book details",
        description: "Failed to update the book details",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md flex-row items-start h-auto">
        <DialogHeader className="">
          <DialogTitle className="text-xl">Edit Book Details</DialogTitle>
          <DialogDescription>
            Update the information for this book.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-6">
          <div className="space-y-3">
            <label htmlFor="title" className="text-sm font-medium block">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Book title"
              className="w-full"
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="subtitle" className="text-sm font-medium block">
              Subtitle
            </label>
            <Input
              id="subtitle"
              value={editSubtitle}
              onChange={(e) => setEditSubtitle(e.target.value)}
              placeholder="Book subtitle"
              className="w-full"
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="author" className="text-sm font-medium block">
              Author
            </label>
            <Input
              id="author"
              value={editAuthor}
              onChange={(e) => setEditAuthor(e.target.value)}
              placeholder="Book author"
              className="w-full"
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="asin" className="text-sm font-medium block">
              ASIN
            </label>
            <Input
              id="asin"
              value={editAsin}
              onChange={(e) => setEditAsin(e.target.value)}
              placeholder="Amazon ASIN"
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter className="gap-3 flex-row items-end">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            variant="brutalprimary"
            onClick={handleSave}
            disabled={isUpdating}
            className="min-w-[140px]"
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
