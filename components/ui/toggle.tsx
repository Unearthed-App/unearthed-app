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

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "data-[state=on]:bg-accent bg-transparent",
        outline:
          "data-[state=on]:bg-accent border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        destructive:
          "data-[state=on]:bg-destructive bg-transparent border border-input hover:bg-destructive-foreground",
        brutal: `hover:bg-accent text-black h-12 border-2 p-2.5 rounded-md transition-shadow duration-200
          bg-card text-black border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_rgba(0,0,0,1)]
          dark:hover:bg-accent dark:bg-[rgba(176,100,100,1)] dark:text-black
          `,
        destructivebrutal: `bg-destructive h-12 border-2 p-2.5 rounded-md transition-shadow duration-200
          border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_rgba(0,0,0,1)]
          dark:text-black
          `,
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
