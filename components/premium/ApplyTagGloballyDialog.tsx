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

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyTagGlobally } from "@/server/actions-premium";
import { toast } from "@/hooks/use-toast";
import { Loader2, Wand2, CheckCircle2 } from "lucide-react";

interface ApplyTagGloballyDialogProps {
  tagId: string;
  tagTitle: string;
  onDismiss?: () => void;
}

export function ApplyTagGloballyDialog({
  tagId,
  tagTitle,
  onDismiss,
}: ApplyTagGloballyDialogProps) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [taggedCount, setTaggedCount] = useState<number | null>(null);

  // Add escape key handler
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleDismiss();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, []); // Empty dependency array since handleDismiss doesn't change

  const applyTagMutation = useMutation({
    mutationFn: async () => {
      const result = await applyTagGlobally(tagId);
      return result;
    },
    onSuccess: (data) => {
      setTaggedCount(data.matchCount);
      toast({
        title: "Tag Applied Globally",
        description:
          data.matchCount === 0
            ? `No quotes were found containing "${tagTitle}"`
            : `Found and tagged ${data.matchCount} ${
                data.matchCount === 1 ? "quote" : "quotes"
              } containing "${tagTitle}"`,
      });
      setIsDialogOpen(false);

      // Invalidate all relevant queries
      queryClient.invalidateQueries({
        queryKey: ["tag-details", tagId],
      });
      queryClient.invalidateQueries({
        queryKey: ["book"],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-tags"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allTags"],
      });
    },
    onError: (error) => {
      console.error("Error applying tag:", error);
      toast({
        title: "Error",
        description: "Failed to apply tag globally",
        variant: "destructive",
      });
    },
  });

  if (isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (taggedCount !== null) {
    return (
      <div className="p-4 border-2 border-dashed rounded-lg">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Auto-Tag Complete</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              Dismiss
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            {taggedCount === 0
              ? `No quotes were found containing "${tagTitle}"`
              : `Successfully tagged ${taggedCount} ${
                  taggedCount === 1 ? "quote" : "quotes"
                } containing "${tagTitle}"`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-2 border-dashed rounded-lg">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wand2 className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Auto-Tag Quotes</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            Dismiss
          </Button>
        </div>

        <p className="text-sm">
          Would you like to apply this tag to all quotes and notes that contain
          &quot;{tagTitle}&quot;?
        </p>

        <Button
          variant="brutal"
          disabled={applyTagMutation.isPending}
          className="w-full"
          onClick={() => applyTagMutation.mutate()}
        >
          {applyTagMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Applying Tag...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Auto-Tag Quotes Globally
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
