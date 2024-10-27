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
import { SourceForm } from "./SourceForm";

interface AddSourceFormProps {
  onSourceAdded: () => void;
  buttonText?: string;
}

export function SourceFormDialog({
  onSourceAdded,
  buttonText,
}: AddSourceFormProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {buttonText ? (
            <Button className="max-w-64">
              <PlusCircle />
              <div className="ml-2">{buttonText}</div>
            </Button>
          ) : (
            <Button size="icon">
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
                <span>Add a Source</span>
              )}
            </DialogTitle>
          </DialogHeader>
          <SourceForm onSourceAdded={onSourceAdded} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="icon">
          <PlusCircle />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {buttonText ? <span>{buttonText}</span> : <span>Add a Source</span>}
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          <SourceForm onSourceAdded={onSourceAdded} />
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
