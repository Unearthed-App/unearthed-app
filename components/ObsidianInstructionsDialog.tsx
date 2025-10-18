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
import { Info } from "lucide-react";
import { HeadingBlur } from "./HeadingBlur";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function ObsidianInstructionsDialog({ isMenuItem = false }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {!isMenuItem ? (
            <Button className="max-w-64">
              <Info />
              <div className="ml-2">Obsidian Instructions</div>
            </Button>
          ) : (
            <div
              role="menuitem"
              className="hover:bg-primary relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <Info className="mr-2 h-4 w-4" />
              <span>Obsidian Instructions</span>
            </div>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <ScrollArea>
            <DialogHeader className="mb-2">
              <DialogTitle>
                <span>Obsidian Instructions</span>
              </DialogTitle>
            </DialogHeader>
            <ol className="list-none space-y-4 pl-2 my-4">
              {[
                "Unearthed Settings - Generate an API key, and save it somewhere temporarily",
                "Unearthed Settings - Copy your User ID, and save it somewhere temporarily",
                "Open Obsidian and go to the settings",
                "Install and enable the Unearthed Community Plugin",
                "Click on 'Options' and fill out the details, including the above saved data",
                "Test if it's working by pressing the 'Sync' buttons for the 'Manual sync', and 'Manual daily reflection sync'",
              ].map((text, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center font-bold text-xs text-center p-4 rounded-lg backdrop-blur-sm bg-white/30 text-alternate shadow-xl shadow-red-300/10 dark:shadow-lg dark:shadow-primary/10">
                    {index + 1}
                  </span>
                  <span className="text-sm pt-0.5">{text}</span>
                </li>
              ))}
            </ol>
            <HeadingBlur content="Now everything in Kindle will be synced to Obsidian, even on mobile" />
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
        {!isMenuItem ? (
          <Button className="max-w-64">
            <Info />
            <div className="ml-2">Obsidian Instructions</div>
          </Button>
        ) : (
          <div
            role="menuitem"
            className="hover:bg-primary relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          >
            <Info className="mr-2 h-4 w-4" />
            <span>Obsidian Instructions</span>
          </div>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            <span>Obsidian Instructions</span>
          </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="w-full">
          <ol className="list-none space-y-4 pl-2">
            {[
              "Unearthed Settings - Generate an API key, and save it somewhere temporarily",
              "Unearthed Settings - Copy your User ID, and save it somewhere temporarily",
              "Open Obsidian and go to the settings",
              "Install and enable the Unearthed Community Plugin",
              "Click on 'Options' and fill out the details, including the above saved data",
              "Test if it's working by pressing the 'Sync' buttons for the 'Manual sync', and 'Manual daily reflection sync'",
            ].map((text, index) => (
              <li key={index} className="flex items-start gap-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center font-bold text-xs text-center p-4 rounded-lg backdrop-blur-sm bg-white/30 text-alternate shadow-xl shadow-red-300/10 dark:shadow-lg dark:shadow-primary/10">
                  {index + 1}
                </span>
                <span className="text-sm pt-0.5">{text}</span>
              </li>
            ))}
          </ol>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <DrawerFooter>
          <DrawerClose asChild>
            <div className="flex justify-between items-center">
              <div>
                <Button className="w-24">Ok</Button>
              </div>
            </div>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
