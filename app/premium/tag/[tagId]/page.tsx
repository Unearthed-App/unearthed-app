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

import { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Book,
  Quote,
  ArrowLeft,
  Trash,
  Unlink,
  Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getTagDetails,
  deleteTag,
  unlinkQuoteFromTag,
  unlinkSourceFromTag,
  updateTag,
} from "@/server/actions-premium";
import { QuoteCardBrutal } from "@/components/premium/QuoteCardBrutal";
import { toast } from "@/hooks/use-toast";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ApplyTagGloballyDialog } from "@/components/premium/ApplyTagGloballyDialog";

export default function TagDetail({
  params: paramsPromise,
}: {
  params: Promise<{ tagId: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [unlinkDialogStates, setUnlinkDialogStates] = useState<
    Record<string, boolean>
  >({});
  const [unlinkSourceDialogStates, setUnlinkSourceDialogStates] = useState<
    Record<string, boolean>
  >({});
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleUnlinkDialogChange = (quoteId: string, isOpen: boolean) => {
    setUnlinkDialogStates((prev) => ({
      ...prev,
      [quoteId]: isOpen,
    }));
  };

  const handleUnlinkSourceDialogChange = (
    sourceId: string,
    isOpen: boolean
  ) => {
    setUnlinkSourceDialogStates((prev) => ({
      ...prev,
      [sourceId]: isOpen,
    }));
  };

  const { data: tagDetails, isLoading } = useQuery({
    queryKey: ["tag-details", params.tagId],
    queryFn: () => getTagDetails(params.tagId),
  });

  const deleteTagMutation = useMutation({
    mutationFn: () => deleteTag(params.tagId),
    onSuccess: () => {
      toast({
        title: "Tag deleted",
        description: "The tag has been successfully deleted",
      });
      router.push("/premium/tags");
    },
    onError: () => {
      toast({
        title: "Error deleting tag",
        description: "Failed to delete the tag",
        variant: "destructive",
      });
    },
  });

  const unlinkQuoteMutation = useMutation({
    mutationFn: (quoteId: string) => unlinkQuoteFromTag(quoteId, params.tagId),
    onSuccess: () => {
      toast({
        title: "Quote unlinked",
        description: "The quote has been unlinked from this tag",
      });
      queryClient.invalidateQueries({
        queryKey: ["tag-details", params.tagId],
      });
    },
    onError: () => {
      toast({
        title: "Error unlinking quote",
        description: "Failed to unlink the quote from this tag",
        variant: "destructive",
      });
    },
  });

  const unlinkSourceMutation = useMutation({
    mutationFn: (sourceId: string) =>
      unlinkSourceFromTag(sourceId, params.tagId),
    onSuccess: () => {
      toast({
        title: "Source unlinked",
        description:
          "The source and its quotes have been unlinked from this tag",
      });
      queryClient.invalidateQueries({
        queryKey: ["tag-details", params.tagId],
      });
    },
    onError: () => {
      toast({
        title: "Error unlinking source",
        description: "Failed to unlink the source from this tag",
        variant: "destructive",
      });
    },
  });

  const updateTagMutation = useMutation({
    mutationFn: () => updateTag(params.tagId, editTitle, editDescription),
    onSuccess: () => {
      toast({
        title: "Tag updated",
        description: "The tag has been successfully updated",
      });
      queryClient.invalidateQueries({
        queryKey: ["tag-details", params.tagId],
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Error updating tag",
        description: "Failed to update the tag",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="pt-32 p-4 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!tagDetails) {
    return (
      <div className="pt-32 p-4">
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <p className="text-center py-12">
            <b>Tag not found.</b>
          </p>
        </div>
      </div>
    );
  }

  const renderTitleAndDescription = () => {
    if (isEditing) {
      return (
        <div className="space-y-4 mb-4">
          <div>
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-xl font-bold"
              placeholder="Tag title"
            />
          </div>
          <div>
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="font-semibold"
              placeholder="Tag description"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="brutal"
              onClick={() => setIsEditing(false)}
              disabled={updateTagMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="brutalprimary"
              onClick={() => updateTagMutation.mutate()}
              disabled={updateTagMutation.isPending}
            >
              {updateTagMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              {tagDetails.title}
            </h1>
          </div>
          <div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setEditTitle(tagDetails.title);
                setEditDescription(tagDetails.description || "");
                setIsEditing(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="font-semibold text-alternate mb-4">
          {tagDetails.description || "No description provided"}
        </p>
      </>
    );
  };

  return (
    <div className="pt-32 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <Link href="/premium/tags">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tags
              </Button>
            </Link>

            <ConfirmationDialog
              isOpen={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              onConfirm={() => deleteTagMutation.mutate()}
              title="Delete Tag"
              description="Are you sure you want to delete this tag? This will remove it from all books and quotes. This action cannot be undone."
              confirmText="Delete"
              cancelText="Cancel"
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructivebrutal"
                  disabled={deleteTagMutation.isPending}
                >
                  {deleteTagMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4 mr-2" />
                  )}
                  Delete Tag
                </Button>
              </AlertDialogTrigger>
            </ConfirmationDialog>
          </div>
          {renderTitleAndDescription()}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span>
                Linked to {tagDetails.sources.length}{" "}
                {tagDetails.sources.length === 1 ? "book" : "books"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Quote className="h-4 w-4" />
              <span>
                Linked to {tagDetails.quotes.length}{" "}
                {tagDetails.quotes.length === 1 ? "quote" : "quotes"}
              </span>
            </div>
          </div>
          <div className="mt-4 max-w-96">
            <ApplyTagGloballyDialog
              tagId={params.tagId}
              tagTitle={tagDetails.title}
            />
          </div>
        </div>
        {tagDetails.quotes.length > 0 && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Books and Quotes linked to this tag
            </h2>
            {Object.entries(
              tagDetails.quotes.reduce(
                (acc, quote) => {
                  const sourceId = quote.source.id;
                  if (!acc[sourceId]) {
                    acc[sourceId] = {
                      source: quote.source,
                      quotes: [],
                    };
                  }
                  acc[sourceId].quotes.push(quote);
                  return acc;
                },
                {} as Record<
                  string,
                  {
                    source: (typeof tagDetails.quotes)[0]["source"];
                    quotes: typeof tagDetails.quotes;
                  }
                >
              )
            ).map(([sourceId, { source, quotes }]) => (
              <div key={sourceId} className="mb-8">
                <div className="border-2 border-black rounded-lg bg-card p-6 mb-6">
                  <div className="flex items-start gap-6">
                    {source.media && source.media.url && (
                      <Link
                        href={`/premium/book/${source.id}`}
                        className="hidden md:block"
                      >
                        <Image
                          src={source.media.url}
                          width={100}
                          height={150}
                          alt={`Cover of ${source.title}`}
                          className="rounded-lg border-2 border-black shadow-brutal"
                        />
                      </Link>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/premium/book/${source.id}`}>
                            <h3 className="text-xl font-semibold hover:underline">
                              {source.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground mb-2">
                            {source.author}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Quote className="h-4 w-4" />
                            <span>
                              {quotes.length}{" "}
                              {quotes.length === 1 ? "quote" : "quotes"}
                            </span>
                          </div>
                        </div>
                        <ConfirmationDialog
                          isOpen={!!unlinkSourceDialogStates[sourceId]}
                          onOpenChange={(open) =>
                            handleUnlinkSourceDialogChange(sourceId, open)
                          }
                          title="Unlink Source"
                          description="Are you sure you want to unlink this source? This will remove all quotes from this source from the tag."
                          confirmText="Unlink"
                          cancelText="Cancel"
                          onConfirm={() =>
                            unlinkSourceMutation.mutate(sourceId)
                          }
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  disabled={unlinkSourceMutation.isPending}
                                  onClick={() =>
                                    handleUnlinkSourceDialogChange(
                                      sourceId,
                                      true
                                    )
                                  }
                                >
                                  {unlinkSourceMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Unlink className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                                <p>Unlink source and its quotes from tag</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </ConfirmationDialog>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pl-4 border-l-2 border-muted">
                  {quotes.map((quote) => (
                    <div key={quote.id} className="flex gap-2 items-start">
                      <div className="w-full">
                        <QuoteCardBrutal
                          tags={[tagDetails]}
                          origin={source.origin as string}
                          bookTitle={source.title}
                          bookAuthor={source.author as string}
                          quote={quote.content}
                          note={quote.note ?? ""}
                          location={quote.location ?? ""}
                          color={quote.color || ""}
                          id={quote.id}
                          onQuoteDeleted={() => {}}
                          hideTags
                        />
                      </div>
                      <ConfirmationDialog
                        isOpen={!!unlinkDialogStates[quote.id]}
                        onOpenChange={(open) =>
                          handleUnlinkDialogChange(quote.id, open)
                        }
                        title="Unlink Quote"
                        description="Are you sure you want to unlink this quote from the tag?"
                        confirmText="Unlink"
                        cancelText="Cancel"
                        onConfirm={() => unlinkQuoteMutation.mutate(quote.id)}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                disabled={unlinkQuoteMutation.isPending}
                                onClick={() =>
                                  handleUnlinkDialogChange(quote.id, true)
                                }
                              >
                                {unlinkQuoteMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Unlink className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                              <p>Unlink quote from tag</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </ConfirmationDialog>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {tagDetails.sources.length > 0 &&
          tagDetails.sources.filter(
            (source) =>
              !tagDetails.quotes.some((quote) => quote.source.id === source.id)
          ).length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Books directly linked to this tag
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tagDetails.sources
                  .filter(
                    (source) =>
                      !tagDetails.quotes.some(
                        (quote) => quote.source.id === source.id
                      )
                  )
                  .map((source) => (
                    <div
                      key={source.id}
                      className="border-2 border-black rounded-lg bg-card p-4"
                    >
                      <div className="flex items-start gap-4">
                        {source.media && source.media.url && (
                          <Link
                            href={`/premium/book/${source.id}`}
                            className="hidden md:block"
                          >
                            <Image
                              src={source.media.url}
                              width={80}
                              height={120}
                              alt={`Cover of ${source.title}`}
                              className="rounded-lg border-2 border-black shadow-brutal"
                            />
                          </Link>
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <Link href={`/premium/book/${source.id}`}>
                                <h3 className="text-lg font-semibold hover:underline">
                                  {source.title}
                                </h3>
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                {source.author}
                              </p>
                            </div>
                            <ConfirmationDialog
                              isOpen={!!unlinkSourceDialogStates[source.id]}
                              onOpenChange={(open) =>
                                handleUnlinkSourceDialogChange(source.id, open)
                              }
                              title="Unlink Source"
                              description="Are you sure you want to unlink this source from the tag?"
                              confirmText="Unlink"
                              cancelText="Cancel"
                              onConfirm={() =>
                                unlinkSourceMutation.mutate(source.id)
                              }
                            >
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      disabled={unlinkSourceMutation.isPending}
                                      onClick={() =>
                                        handleUnlinkSourceDialogChange(
                                          source.id,
                                          true
                                        )
                                      }
                                    >
                                      {unlinkSourceMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Unlink className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                                    <p>Unlink source from tag</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </ConfirmationDialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
