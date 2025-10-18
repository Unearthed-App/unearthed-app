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

import packageJson from "@/package.json";

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
import { Settings } from "lucide-react";
import { ProfileForm } from "./ProfileForm";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function ProfileDialog() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="icon">
            <Settings />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <ScrollArea>
            <DialogHeader className="mb-2">
              <DialogTitle>Settings</DialogTitle>
              {/* <DialogDescription>
              Don&apos;t forget to press <span className="text-secondary">Save</span>
            </DialogDescription> */}
            </DialogHeader>
            <ProfileForm />
            <h4 className="mt-2 text-muted">Version: {packageJson.version}</h4>
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
          <Settings />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Settings</DrawerTitle>
          {/* <DrawerDescription>Don&apos;t forget to press Save</DrawerDescription> */}
        </DrawerHeader>
        <ScrollArea className="px-4 w-full">
          <ProfileForm />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <DrawerFooter>
          <DrawerClose asChild>
            <div className="flex justify-between items-center">
              <h4 className="text-muted">Version: {packageJson.version}</h4>
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
