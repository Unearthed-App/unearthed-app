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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createTagsFromIdeas } from "@/server/actions-premium";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ScrollArea } from "@/components/ui/scroll-area";

const schema = z.object({
  tag: z.string().min(1, "Tag is required"),
  description: z.string(),
});

function TagForm({
  form,
  onSubmit,
  isAddingTag,
  onCancel,
}: {
  form: any;
  onSubmit: (data: z.infer<typeof schema>) => Promise<void>;
  isAddingTag: boolean;
  onCancel: () => void;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pr-2">
        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter tag name"
                  {...field}
                  disabled={isAddingTag}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter tag description"
                  className="resize-none"
                  {...field}
                  disabled={isAddingTag}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pb-4">
          <Button
            type="button"
            variant="brutal"
            onClick={onCancel}
            disabled={isAddingTag}
          >
            Cancel
          </Button>
          <Button type="submit" variant="brutalprimary" disabled={isAddingTag}>
            {isAddingTag ? "Adding..." : "Add Tag"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function ManualTagDialog({
  sourceId,
  open,
  onOpenChange,
  quoteIds,
}: {
  sourceId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  quoteIds?: string[];
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isOpen, setIsOpen] = useState(open || false);

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      tag: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsAddingTag(true);
    try {
      const result = await createTagsFromIdeas(sourceId, [
        {
          tag: data.tag,
          description: data.description,
          quoteIds: quoteIds || [],
        },
      ]);

      await queryClient.invalidateQueries({ queryKey: ["book"] });
      await queryClient.invalidateQueries({ queryKey: ["all-tags"] });

      toast({
        title: "Tag added successfully",
        description: "The new tag has been added",
      });

      form.reset();
      handleOpenChange(false);
    } catch (error) {
      toast({
        title: "Error adding tag",
        description: "Failed to add the tag",
        variant: "destructive",
      });
    } finally {
      setIsAddingTag(false);
    }
  };

  const triggerButton = (
    <Button variant="brutal" size="sm" disabled={isAddingTag}>
      <Plus className="h-4 w-4 mr-2" />
      {isAddingTag ? "Creating Tag..." : "Create Tag"}
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className="max-h-96">
          <DialogHeader>
            <DialogTitle>Add New Tag</DialogTitle>
          </DialogHeader>
          <TagForm
            form={form}
            onSubmit={onSubmit}
            isAddingTag={isAddingTag}
            onCancel={() => handleOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add New Tag</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="px-4 w-full">
          <TagForm
            form={form}
            onSubmit={onSubmit}
            isAddingTag={isAddingTag}
            onCancel={() => handleOpenChange(false)}
          />
        </ScrollArea>
        <DrawerFooter className="pt-2" />
      </DrawerContent>
    </Drawer>
  );
}
