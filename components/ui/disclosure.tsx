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
import {
  AnimatePresence,
  motion,
  MotionConfig,
  Transition,
  Variant,
  Variants,
} from "framer-motion";
import { createContext, useContext, useState, useId, useEffect } from "react";
import { cn } from "@/lib/utils";

type DisclosureContextType = {
  open: boolean;
  toggle: () => void;
  variants?: { expanded: Variant; collapsed: Variant };
};

const DisclosureContext = createContext<DisclosureContextType | undefined>(
  undefined
);

type DisclosureProviderProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  variants?: { expanded: Variant; collapsed: Variant };
};

function DisclosureProvider({
  children,
  open: openProp,
  onOpenChange,
  variants,
}: DisclosureProviderProps) {
  const [internalOpenValue, setInternalOpenValue] = useState<boolean>(openProp);

  useEffect(() => {
    setInternalOpenValue(openProp);
  }, [openProp]);

  const toggle = () => {
    const newOpen = !internalOpenValue;
    setInternalOpenValue(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <DisclosureContext.Provider
      value={{
        open: internalOpenValue,
        toggle,
        variants,
      }}
    >
      {children}
    </DisclosureContext.Provider>
  );
}

function useDisclosure() {
  const context = useContext(DisclosureContext);
  if (!context) {
    throw new Error("useDisclosure must be used within a DisclosureProvider");
  }
  return context;
}

type DisclosureProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  variants?: { expanded: Variant; collapsed: Variant };
  transition?: Transition;
};

export function Disclosure({
  open: openProp = false,
  onOpenChange,
  children,
  className,
  transition,
  variants,
}: DisclosureProps) {
  return (
    <MotionConfig transition={transition}>
      <div className={className}>
        <DisclosureProvider
          open={openProp}
          onOpenChange={onOpenChange}
          variants={variants}
        >
          {React.Children.toArray(children)[0]}
          {React.Children.toArray(children)[1]}
        </DisclosureProvider>
      </div>
    </MotionConfig>
  );
}

export function DisclosureTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { toggle, open } = useDisclosure();

  return (
    <>
      {React.Children.map(children, (child) => {
        return React.isValidElement(child)
          ? React.cloneElement(child, {
              onClick: toggle,
              role: "button",
              "aria-expanded": open,
              tabIndex: 0,
              onKeyDown: (e: { key: string; preventDefault: () => void }) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle();
                }
              },
              className: cn(
                className,
                (child as React.ReactElement).props.className
              ),
              ...(child as React.ReactElement).props,
            })
          : child;
      })}
    </>
  );
}

export function DisclosureContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open, variants } = useDisclosure();
  const uniqueId = useId();

  const BASE_VARIANTS: Variants = {
    expanded: {
      height: "auto",
      opacity: 1,
    },
    collapsed: {
      height: 0,
      opacity: 0,
    },
  };

  const combinedVariants = {
    expanded: { ...BASE_VARIANTS.expanded, ...variants?.expanded },
    collapsed: { ...BASE_VARIANTS.collapsed, ...variants?.collapsed },
  };

  return (
    <div className={cn("overflow-hidden", className)}>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={uniqueId}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={combinedVariants}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default {
  Disclosure,
  DisclosureProvider,
  DisclosureTrigger,
  DisclosureContent,
};
