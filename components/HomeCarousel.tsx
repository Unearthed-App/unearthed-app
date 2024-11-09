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
    image: "/book-sync.webp",
    name: "Book Sync",
    imageWidth: 800,
    imageHeight: 800,
    extraClasses: "w-full",
  },
  {
    image: "/daily-reflection-1.webp",
    name: "Daily Reflection",
    imageWidth: 800,
    imageHeight: 800,
    extraClasses: "w-full",
  },
  {
    image: "/notion-sync.png",
    name: "Notion Database",
    imageWidth: 600,
    imageHeight: 400,
    extraClasses: "w-full",
  },
];

export function HomeCarousel() {
  const [index, setIndex] = useState(0);

  return (
    <div className="relative w-full py-8 max-w-[1100px]">
      <div className="flex flex-wrap w-full justify-center px-4">
        {items.map((item, idx) => {
          return (
            <Button
              variant={index === idx ? "brutalprimary" : "brutal"}
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setIndex(idx)}
              className="w-full md:w-auto ml-2 mt-2"
            >
              {item.name}
            </Button>
          );
        })}
      </div>
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
    </div>
  );
}
