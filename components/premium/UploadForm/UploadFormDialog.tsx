"use client";
import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ImportIcon } from "lucide-react";
import { UploadForm } from "./UploadForm";

interface UploadFormProps {
  onUpload: () => void;
}

export function UploadFormDialog({ onUpload }: UploadFormProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="max-w-64">
            <ImportIcon />
            <div className="ml-2">Import Multiple</div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload a File</DialogTitle>
            <DialogDescription>
              This will allow you to upload multiple sources, quotes, and notes
              at once
            </DialogDescription>
          </DialogHeader>
          <UploadForm onUpload={onUpload} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="icon">
          <ImportIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Upload a File</DrawerTitle>
          <DrawerDescription>
            This will allow you to upload multiple sources, quotes, and notes at
            once
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <UploadForm onUpload={onUpload} />
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
