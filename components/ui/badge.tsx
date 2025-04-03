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

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        brutal: `h-8 border-2 p-2.5 rounded-md transition-shadow duration-200
          bg-black border-white text-white
          dark:bg-white dark:border-black dark:text-black
          `,
        brutalinvert: `h-8 border-2 p-2.5 rounded-md transition-shadow duration-200
          bg-white border-black text-black
          dark:bg-black dark:border-white dark:text-white
          `,
        brutaldestructive: `h-8 border-2 p-2.5 rounded-md transition-shadow duration-200
          bg-red-800 border-white text-white
          dark:bg-red-500 dark:border-black dark:text-black
          `,
        brutalinvertsmall: `h-6 text-xs border-2 p-2 rounded-md transition-shadow duration-200
          bg-white border-black text-black
          dark:bg-black dark:border-white dark:text-white
          `,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
