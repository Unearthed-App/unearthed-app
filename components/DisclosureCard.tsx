"use client";

import { useState } from "react";
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from "@/components/ui/disclosure";
import { motion } from "framer-motion";
import Image, { ImageProps } from "next/image";

interface DisclosureCardProps {
  title: string;
  content: string;
  image: Omit<ImageProps, "alt"> & { alt: string };
}

export function DisclosureCard({ title, content, image }: DisclosureCardProps) {
  const [isOpen, setIsOpen] = useState(false);

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

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div
      className="max-h-56 md:max-h-64 cursor-pointer relative h-[350px] w-[290px] overflow-hidden rounded-lg hover:opacity-80 transition-opacity duration-700"
      onClick={() => setIsOpen(!isOpen)}
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
            className="w-full pb-2 text-left text-[14px] font-medium"
            type="button"
          >
            {title}
          </button>
        </DisclosureTrigger>
        <DisclosureContent>
          <motion.div
            className="flex flex-col pb-4 text-[13px]"
            variants={contentVariants}
            transition={transition}
          >
            <p>{content}</p>
          </motion.div>
        </DisclosureContent>
      </Disclosure>
    </div>
  );
}
