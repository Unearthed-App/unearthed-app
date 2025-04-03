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
import { Info } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
export function AiChatSuggestions({
  onPromptSelect,
  isMenuItem = false,
}: {
  onPromptSelect: (prompt: string) => void;
  isMenuItem?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const promptIdeas = [
    "You are a quiz master trained to reinforce retention using the reader's own materials. Use the quotes/notes, create multiple-choice questions only from my provided content. Ask one question at a time, wait for my answer, then confirm correctness. If I'm wrong, cite the relevant quote/note to explain. After 3 questions, ask if I want to continue or switch topics. Never invent answers—stick strictly to my shared material",
    "You are a pragmatic mentor who bridges book insights to real-life scenarios. Use the quotes and notes, identify actionable lessons or principles. For each lesson, propose a real-world situation where it could apply (e.g., workplace conflict, personal growth). Ask me how I'd implement the advice and critique my plan using the book's ideas. Example: 'How might [QUOTE] change your approach to [SCENARIO]?' Only use examples from my notes, and ask follow-up questions to refine my thinking",
    "You are a debate coach who uses characters, authors, or ideas from the book to spark critical thinking. Use the quotes and notes, create a debate scenario (e.g., 'The author vs. a critic' or 'Character A vs. Character B'). Use direct quotes to frame each side's argument. Present one debate question at a time, ask me to pick a side, and challenge me to defend my position using my notes. If I struggle, suggest relevant quotes. Keep debates concise and focused on the material I provide",
    "You are a reflective journaling assistant. When I share quotes and notes, ask me one deep, open-ended question at a time to connect the material to my life (e.g., 'How does [QUOTE] mirror a challenge you've faced?'). Wait for my response, then ask a follow-up question to dig deeper (e.g., 'What would the author say about your approach?'). Stay silent until I reply, and never assume—base questions solely on my provided content",
  ];

  const renderPromptList = () => (
    <div className="my-2">
      {promptIdeas.map((text, index) => (
        <div key={index} className="mt-2 p-4 rounded-md border-2 bg-card">
          <div className="w-full mb-2">
            <Button
              variant="brutalprimary"
              onClick={() => {
                onPromptSelect(text);
                setOpen(false);
              }}
            >
              Use Prompt
            </Button>
          </div>
          <span className="flex-1 text-sm pt-0.5">{text}</span>
        </div>
      ))}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {!isMenuItem ? (
            <Button className="">
              <Info />
              <div className="ml-2">Ideas</div>
            </Button>
          ) : (
            <div
              role="menuitem"
              className="hover:bg-primary relative flex cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <Info className="mr-2 h-4 w-4" />
              <span>Ideas</span>
            </div>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] pr-2">
          <DialogHeader className="mb-2">
            <DialogTitle>
              <span>Prompt Ideas</span>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="pr-4">{renderPromptList()}</ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      preventScrollRestoration={false}
      disablePreventScroll
      noBodyStyles
    >
      <DrawerTrigger asChild>
        {!isMenuItem ? (
          <Button className="w-full">
            <Info />
            <div className="ml-2">Ideas</div>
          </Button>
        ) : (
          <div
            role="menuitem"
            className="hover:bg-primary relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          >
            <Info className="mr-2 h-4 w-4" />
            <span>Ideas</span>
          </div>
        )}
      </DrawerTrigger>
      <DrawerContent className="px-2 ">
        <DrawerHeader className="text-left">
          <DrawerTitle>
            <span>Prompt Ideas</span>
          </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="w-full">
          {renderPromptList()}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button className="w-24">Ok</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
