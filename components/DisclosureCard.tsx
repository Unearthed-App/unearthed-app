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

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from "@/components/ui/disclosure";
import { motion } from "motion/react";
import Image, { ImageProps } from "next/image";

interface DisclosureCardProps {
  title: string;
  content: string;
  image: Omit<ImageProps, "alt"> & { alt: string };
  videoUrl?: string;
  videoTitle?: string;
  videoDescription?: string;
}

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
import { Button } from "./ui/button";
import { PlayCircle } from "lucide-react";

export function DisclosureCard({
  title,
  content,
  image,
  videoUrl,
  videoTitle,
  videoDescription,
}: DisclosureCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const imageVariants = {
    collapsed: { scale: 1, filter: "blur(0px)" },
    expanded: { scale: 0.9, filter: "blur(3px)" },
  };

  const contentVariants = {
    collapsed: { opacity: 0, y: 0 },
    expanded: { opacity: 1, y: 0 },
  };

  const transition = {
    type: "spring",
    stiffness: 26.7,
    damping: 4.1,
    mass: 0.2,
  };

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
    <div
      className="mt-4 max-h-56 md:max-h-64 cursor-pointer relative h-[350px] w-[300px] overflow-hidden rounded-lg hover:opacity-80 transition-opacity duration-700"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="flex justify-center"
        animate={isOpen ? "expanded" : "collapsed"}
        variants={imageVariants}
        transition={transition}
      >
        <Image
          {...image}
          alt={image.alt}
          className={`max-h-40 max-w-40 pointer-events-none h-auto w-full select-none ${
            image.className || ""
          }`}
        />
      </motion.div>
      <Disclosure
        onOpenChange={setIsOpen}
        open={isOpen}
        className="absolute bottom-0 left-0 right-0 rounded-lg bg-card px-4 pt-2 border-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all"
      >
        <DisclosureTrigger>
          <button
            className="w-full pb-2 text-left text-[14px] font-medium flex justify-center"
            type="button"
          >
            {title}
            {videoUrl && (
              <div className="ml-1 text-xs font-semibold text-muted flex space-x-1 items-center">
                <span className="block md:hidden lg:block">- Video</span>
                <PlayCircle className="h-5 w-5" />
              </div>
            )}
          </button>
        </DisclosureTrigger>
        <DisclosureContent>
          <motion.div
            className="flex flex-col pb-4 text-[13px]"
            variants={contentVariants}
            transition={transition}
          >
            <p className="mb-2">{content}</p>
            {videoUrl && (
              <>
                {isDesktop ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="mx-2">
                        <PlayCircle className="mr-2" />
                        Watch Video
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
                            title="YouTube video"
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
                      <Button className="mx-2">
                        <PlayCircle className="mr-2" />
                        Watch Video
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[500px]">
                      <DrawerHeader className="text-left">
                        {videoTitle && <DrawerTitle>{videoTitle}</DrawerTitle>}
                        {videoDescription && (
                          <DrawerDescription>
                            {videoDescription}
                          </DrawerDescription>
                        )}
                      </DrawerHeader>
                      <div className="p-2 aspect-w-16 aspect-h-9 h-full max-h-[300px] py-8">
                        <iframe
                          width="100%"
                          height="100%"
                          src={videoUrl}
                          title="YouTube video"
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
            )}
          </motion.div>
        </DisclosureContent>
      </Disclosure>
    </div>
  );
}
