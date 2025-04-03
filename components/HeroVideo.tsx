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

import React, { useState, useEffect } from "react";

interface Props {
  videoId?: string;
  durationInSeconds?: number;
}

export const HeroVideo: React.FC<Props> = ({
  videoId = "ADD_IN_HERE",
  durationInSeconds = 14,
}) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&playlist=${videoId}&mute=1`;
  const [loading, setLoading] = useState(true);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    // Simulate video loading completion
    const loadTimer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // Set timer for video duration
    const durationTimer = setTimeout(() => {
      setShowImage(true);
    }, durationInSeconds * 1000);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(durationTimer);
    };
  }, [durationInSeconds]);

  return (
    <div className=" overflow-hidden motion-blur-in-2xl motion-duration-[6000ms] motion-delay-500 w-full flex justify-center mt-8 rounded-2xl">
      <div className="relative w-full max-w-[1200px] aspect-video rounded-3xl border-4 shadow-xl overflow-hidden">
        {!showImage ? (
          <iframe
            className="w-full h-full"
            src={embedUrl}
            title="Dashboard demonstration video"
            allow="autoplay; fullscreen"
            style={{ border: "none" }}
          />
        ) : (
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="Video end screen"
            className="w-full h-full object-cover cursor-pointer bg-card"
          />
        )}
        {/* Overlay to hide initial YouTube elements */}
        <div
          className={`absolute inset-0 z-20 bg-card transition-opacity duration-500 ${
            loading ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden="true"
        />
        {/* Permanent invisible overlay to prevent interaction */}
        <div className="absolute inset-0 z-10" aria-hidden="true" />
      </div>
    </div>
  );
};
