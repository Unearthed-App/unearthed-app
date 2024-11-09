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


export const NoiseBackground = () => {
  return (
    <>
      <div className="-z-50 fixed top-0 left-0 right-0 h-screen w-full bg-gradient-to-b from-background via-card to-background dark:from-background dark:via-red-900/30 dark:to-background" />
      <div className="-z-40 fixed top-0 left-0 right-0 h-screen w-full opacity-50 dark:opacity-20">
        <svg className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.6"
              stitchTiles="stitch"
              numOctaves="2"
            />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter="url(#noiseFilter)"
            fill="rgba(255, 0, 0, 1)"
          />
        </svg>
      </div>
    </>
  );
};
