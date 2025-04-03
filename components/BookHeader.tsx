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

import { Frown } from "lucide-react";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";

import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

interface BookHeaderProps {
  title: string;
  subtitle: string;
  author: string;
  imageUrl?: string;
  ignored?: boolean;
}

export function BookHeader({
  title,
  subtitle,
  author,
  imageUrl,
  ignored,
}: BookHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col justify-between"
    >
      <div className="flex flex-wrap">
        <div className="md:w-full ">
          {imageUrl ? (
            <Image
              src={imageUrl}
              width={150}
              height={150}
              alt="Picture of the Book"
              className="rounded-lg border-2 shadow-xl"
            />
          ) : (
            <p></p>
          )}
        </div>
        <div className="w-full mt-4 flex items-center">
          <div className="">
            <h1
              className={`${crimsonPro.className} font-extrabold text-xl md:text-3xl`}
            >
              {title}
            </h1>

            <h2 className="text-muted md:pr-4">{subtitle}</h2>
            <h3 className="text-sm text-secondary">by {author}</h3>
            {ignored && (
              <Badge variant="brutaldestructive" className="mt-4">
                <Frown className={"h-4 w-4 mr-1"} />
                <span>Ignored</span>
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
