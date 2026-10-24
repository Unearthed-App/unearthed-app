/**
 * Copyright (C) 2026 Unearthed App
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

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

type DemoVideoProps = {
  src: string;
  poster: string;
  title: string;
  className?: string;
};

export function DemoVideo({ src, poster, title, className }: DemoVideoProps) {
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!started) return;

    const video = videoRef.current;
    if (!video) return;

    video.focus({ preventScroll: true });

    // Pause when scrolled away; resuming always stays under the viewer's control.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) video.pause();
      },
      { threshold: 0.1 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [started]);

  return (
    <div
      className={cn(
        "relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-card",
        className
      )}
    >
      {started ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          aria-label={`${title} demo`}
          tabIndex={0}
          controls
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          onError={() => {
            setStarted(false);
            setFailed(true);
          }}
          className="h-full w-full object-cover"
        />
      ) : (
        <button
          type="button"
          aria-label={`${failed ? "Retry" : "Play"} ${title} demo`}
          onClick={() => {
            setFailed(false);
            setStarted(true);
          }}
          className="group relative block h-full w-full cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-primary"
        >
          <Image
            src={poster}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-primary text-primary-foreground shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-transform group-hover:scale-105">
              <Play aria-hidden="true" className="ml-1 h-7 w-7 fill-current" />
            </span>
          </span>
          {failed && (
            <span
              role="alert"
              className="absolute inset-x-3 bottom-3 rounded-lg bg-background/95 p-2 text-sm text-foreground"
            >
              The video couldn&apos;t load. Please try again.
            </span>
          )}
        </button>
      )}
    </div>
  );
}
