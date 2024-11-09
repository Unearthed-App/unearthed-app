"use client";
import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PlusCircle } from "lucide-react";
import { QuoteForm } from "./QuoteForm";
import { selectSourceSchema } from "@/db/schema";
import { z } from "zod";
type Source = z.infer<typeof selectSourceSchema>;

interface AddQuoteFormProps {
  onQuoteAdded: () => void;
  source?: Source;
  buttonText?: string;
}

export function QuoteFormDialog({
  onQuoteAdded,
  buttonText,
  source,
}: AddQuoteFormProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {buttonText ? (
            <Button variant="brutalprimary" className="max-w-64">
              <PlusCircle />
              <div className="ml-2">{buttonText}</div>
            </Button>
          ) : (
            <Button variant="brutalprimary" size="icon">
              <PlusCircle />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {buttonText ? (
                <span>{buttonText}</span>
              ) : (
                <span>Add a Quote</span>
              )}
            </DialogTitle>
          </DialogHeader>
          <QuoteForm onQuoteAdded={onQuoteAdded} source={source} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="brutalprimary" size="icon">
          <PlusCircle />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {buttonText ? <span>{buttonText}</span> : <span>Add a Quote</span>}
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          <QuoteForm onQuoteAdded={onQuoteAdded} source={source} />
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <div className="flex justify-between items-center">
              <div>
                <Button className="w-24">Cancel</Button>
              </div>
            </div>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
