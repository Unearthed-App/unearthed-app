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

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const raisedButton =
  "border-2 border-[color:var(--button-ink)] shadow-[4px_4px_0_var(--button-ink)] transition-[transform,box-shadow] duration-150 ease-[ease] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--button-ink)] active:translate-x-1 active:translate-y-1 active:shadow-none";
const paperButton = "bg-[#fbf6ec] text-[#25372e] dark:bg-[#26352c] dark:text-[#ece8dd]";
const primaryButton = "bg-[#8cd5bb] text-[#172c23]";
const destructiveButton = "bg-[#f3a49b] text-[#541c17]";

const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 rounded-[4px] bg-none text-center text-xs font-bold leading-normal no-underline whitespace-normal [--button-ink:#25372e] dark:[--button-ink:#0c1510] transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-[5px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        marketing: cn(raisedButton, primaryButton),
        marketingSecondary: cn(raisedButton, "bg-[#fbf6ec] text-[color:var(--button-ink)] dark:bg-[#e8e4d7] dark:text-[#25372e]"),
        default: cn(raisedButton, primaryButton),
        destructive: cn(raisedButton, destructiveButton),
        outline: cn(raisedButton, paperButton),
        secondary: cn(raisedButton, paperButton),
        ghost: "border-0 shadow-none hover:bg-accent hover:text-accent-foreground",
        link: "border-0 shadow-none text-primary underline-offset-4 hover:underline",
        brutal: cn(raisedButton, paperButton),
        brutalprimary: cn(raisedButton, primaryButton),
        destructivebrutal: cn(raisedButton, destructiveButton),
        brutalshimmer: cn(raisedButton, primaryButton),
      },
      tone: { online: "", local: "", mobile: "" },
      size: {
        default: "min-h-12 px-5 py-3",
        sm: "min-h-9 px-3 py-2",
        lg: "min-h-12 px-8 py-3",
        icon: "h-10 w-10 p-2",
        tiny: "h-6 w-6 p-1",
        compact: "min-h-9 px-3 py-1.5",
        natural: "p-2",
      },
    },
    compoundVariants: [
      {
        variant: ["marketing", "marketingSecondary"],
        className: "h-auto gap-2.5 leading-5 focus-visible:outline-offset-[6px] [&_svg]:h-[17px] [&_svg]:w-[17px] [&_svg]:shrink-0",
      },
      {
        variant: ["marketing", "marketingSecondary"],
        size: "default",
        className: "px-[19px]",
      },
      {
        variant: ["marketing", "marketingSecondary"],
        tone: "local",
        className: "[--button-ink:#5e301d]",
      },
      {
        variant: ["marketing", "marketingSecondary"],
        tone: "mobile",
        className: "[--button-ink:#41315d]",
      },
      { variant: "marketing", tone: "local", className: "bg-[#f4a36c] text-[#382010]" },
      { variant: "marketing", tone: "mobile", className: "bg-[#c5b2e9] text-[#2e2044]" },
    ],
    defaultVariants: { variant: "brutal", size: "default" },
  }
);

function buttonVariants(props: Parameters<typeof buttonStyles>[0] = {}) {
  return cn(buttonStyles(props));
}

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, tone, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, tone, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
