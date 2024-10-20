"use client";
import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";

import packageJson from "@/package.json";

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
import { Settings } from "lucide-react";
import { ProfileForm } from "./ProfileForm/ProfileForm";

export function ProfileDialog() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="icon">
            <Settings />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            {/* <DialogDescription>
              Don&apos;t forget to press <span className="text-secondary">Save</span>
            </DialogDescription> */}
          </DialogHeader>
          <ProfileForm />
          <h4 className="text-muted">Version: {packageJson.version}</h4>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="icon">
          <Settings />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Settings</DrawerTitle>
          {/* <DrawerDescription>Don&apos;t forget to press Save</DrawerDescription> */}
        </DrawerHeader>
        <div className="px-4">
          <ProfileForm />
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <div className="flex justify-between items-center">
              <h4 className="text-muted">Version: {packageJson.version}</h4>
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
