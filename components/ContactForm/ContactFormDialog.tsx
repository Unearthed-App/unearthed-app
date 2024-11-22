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
import { Mail } from "lucide-react";
import { ContactForm } from "./ContactForm";

export function ContactFormDialog({ isMenuItem = false }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {!isMenuItem ? (
            <Button className="hidden md:flex max-w-64">
              <Mail />
              <div className="ml-2">Send us a message</div>
            </Button>
          ) : (
            <div
              role="menuitem"
              className="hover:bg-primary relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <Mail className="mr-2 h-4 w-4" />
              <span>Send us a message</span>
            </div>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              <span>Send us a message</span>
            </DialogTitle>
          </DialogHeader>
          <ContactForm
            onContactSent={() => {
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {!isMenuItem ? (
          <Button size="icon">
            <Mail />
          </Button>
        ) : (
          <div
            role="menuitem"
            className="hover:bg-primary relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          >
            <Mail className="mr-2 h-4 w-4" />
            <span>Send us a message</span>
          </div>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            <span>Send us a message</span>
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          <ContactForm
            onContactSent={() => {
              setOpen(false);
            }}
          />
        </div>

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
