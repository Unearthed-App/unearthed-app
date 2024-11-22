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
import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";

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
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PlusCircle } from "lucide-react";
import { SourceForm } from "./SourceForm";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface AddSourceFormProps {
  onSourceAdded: () => void;
  buttonText?: string;
}

export function SourceFormDialog({
  onSourceAdded,
  buttonText,
}: AddSourceFormProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {buttonText ? (
            <Button className="max-w-64">
              <PlusCircle />
              <div className="ml-2">{buttonText}</div>
            </Button>
          ) : (
            <Button size="icon">
              <PlusCircle />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <ScrollArea>
            <DialogHeader className="mb-2">
              <DialogTitle>
                {buttonText ? (
                  <span>{buttonText}</span>
                ) : (
                  <span>Add a Source</span>
                )}
              </DialogTitle>
            </DialogHeader>
            <SourceForm onSourceAdded={onSourceAdded} />{" "}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      preventScrollRestoration={false}
      disablePreventScroll
      noBodyStyles
    >
      <DrawerTrigger asChild>
        <Button size="icon">
          <PlusCircle />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {buttonText ? <span>{buttonText}</span> : <span>Add a Source</span>}
          </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="px-4 w-full">
          <SourceForm onSourceAdded={onSourceAdded} />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <DrawerFooter>
          <DrawerClose asChild>
            <div className="flex justify-between items-center">
              <div>
                <Button className="w-24">Cancel</Button>
              </div>
            </div>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
