import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        brutal: `h-12 border-2 p-2.5 rounded-md transition-all duration-200
          bg-card border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] 
          hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]
          active:shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px]
          dark:hover:bg-accent dark:bg-[rgb(238,157,138)] dark:text-black
        `,
        brutalprimary: `bg-primary h-12 border-2 p-2.5 rounded-md transition-all duration-200
          hover:bg-muted border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] 
          hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]
          active:shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px]
          dark:hover:bg-muted dark:text-black
        `,
        destructivebrutal: `bg-destructive h-12 border-2 p-2.5 rounded-md transition-all duration-200
          hover:bg-muted border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] 
          hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]
          active:shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px]
          dark:hover:bg-muted dark:text-black
        `,
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        tiny: "w-6 h-6 p-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_rgba(0,0,0,1)]",
      },
    },
    defaultVariants: {
      variant: "brutal",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
