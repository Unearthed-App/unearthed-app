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

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addExistingTagToSource,
  getUnusedTagsForSource,
} from "@/server/actions-premium";
import { useToast } from "@/hooks/use-toast";

interface ExistingTagDialogProps {
  sourceId: string;
}

export function ExistingTagDialog({ sourceId }: ExistingTagDialogProps) {
  const [open, setOpen] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: existingTags = [] } = useQuery({
    queryKey: ["userTags", sourceId],
    queryFn: () => getUnusedTagsForSource(sourceId),
  });

  const onExistingTagSelect = async (tagId: string) => {
    setIsAddingTag(true);
    try {
      await addExistingTagToSource(sourceId, tagId);
      await queryClient.invalidateQueries({ queryKey: ["book"] });

      toast({
        title: "Tag added successfully",
        description: "The existing tag has been added to your book",
      });

      setOpen(false);
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="brutal" size="sm" disabled={isAddingTag}>
          <Plus className="h-4 w-4 mr-2" />
          Existing Tag
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command>
          <CommandInput placeholder="Search tags..." />
          <CommandList>
            <CommandEmpty>None found from other sources</CommandEmpty>
            <CommandGroup>
              {existingTags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  value={tag.title}
                  onSelect={() => onExistingTagSelect(tag.id)}
                >
                  <div className="flex flex-col">
                    <span>{tag.title}</span>
                    {tag.description && (
                      <span className="text-xs text-muted-foreground">
                        {tag.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
