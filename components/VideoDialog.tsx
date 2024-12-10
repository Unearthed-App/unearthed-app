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
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { PlayCircle } from "lucide-react";

interface VideoDialogProps {
  videoUrl: string;
  videoTitle: string;
  videoDescription: string;
  videoButtonText: string;
}

export function VideoDialog({
  videoUrl,
  videoTitle,
  videoDescription,
  videoButtonText,
}: VideoDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      {isDesktop ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="">
              <PlayCircle className="mr-2" />
              {videoButtonText}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[400px]">
            <div>
              {videoTitle && <DialogTitle>{videoTitle}</DialogTitle>}
              {videoDescription && (
                <DialogDescription className="pt-1">
                  {videoDescription}
                </DialogDescription>
              )}
              <div className="aspect-w-16 aspect-h-9 h-full max-h-[400px] py-8">
                <iframe
                  width="100%"
                  height="100%"
                  src={videoUrl}
                  title={videoTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="">
              <PlayCircle className="mr-2" />
              {videoButtonText}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[500px]">
            <DrawerHeader className="text-left">
              {videoTitle && <DrawerTitle>{videoTitle}</DrawerTitle>}
              {videoDescription && (
                <DrawerDescription>{videoDescription}</DrawerDescription>
              )}
            </DrawerHeader>
            <div className="p-2 aspect-w-16 aspect-h-9 h-full max-h-[300px] py-8">
              <iframe
                width="100%"
                height="100%"
                src={videoUrl}
                title={videoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <div className="flex justify-between items-center">
                  <div>
                    <Button className="w-24">Close</Button>
                  </div>
                </div>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
