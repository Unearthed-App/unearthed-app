"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

// Array of image URLs
const items = [
  {
    image: "/search.png",
    name: "Search For Anything",
    imageWidth: 400,
    imageHeight: 400,
    extraClasses: "w-full",
  },
  {
    image: "/notion-sync.png",
    name: "Notion Sync",
    imageWidth: 600,
    imageHeight: 400,
    extraClasses: "w-full",
  },
  {
    image: "/notion-sync-book.png",
    name: "Notion Books",
    imageWidth: 400,
    imageHeight: 400,
    extraClasses: "w-6/12",
  },
  {
    image: "/obsidian-book.png",
    name: "Obsidian Books",
    imageWidth: 400,
    imageHeight: 400,
    extraClasses: "w-6/12",
  },
  {
    image: "/daily-reflection.png",
    name: "Unearthed Daily",
    imageWidth: 400,
    imageHeight: 400,
    extraClasses: "",
  },
  {
    image: "/obsidian-daily.png",
    name: "Obsidian Daily",
    imageWidth: 500,
    imageHeight: 400,
    extraClasses: "w-full",
  },
  {
    image: "/capacities-daily-mobile-small.webp",
    name: "Capacities Daily",
    imageWidth: 400,
    imageHeight: 400,
    extraClasses: "",
  },
];

export function HomeCarousel() {
  const [index, setIndex] = useState(0);

  return (
    <div className="relative w-full py-8 max-w-[1100px]">
      <Carousel index={index} onIndexChange={setIndex}>
        <CarouselContent className="relative">
          {items.map((item, idx) => {
            return (
              <CarouselItem key={idx} className="p-4">
                <div className="flex items-center justify-center ">
                  <Image
                    src={item.image}
                    alt={`Slide ${idx + 1}`}
                    className={`-z-10 h-full border-2 rounded-lg ${item.extraClasses}`}
                    width={item.imageWidth}
                    height={item.imageHeight}
                  />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      <div className="flex flex-wrap w-full justify-center px-4">
        {items.map((item, idx) => {
          return (
            <Button
              variant={index === idx ? "brutalprimary" : "brutal"}
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setIndex(idx)}
              className="w-full md:w-auto -ml-2"
            >
              {item.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
