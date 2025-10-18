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

import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type Props = {
  distinctId: string;
  className?: string;
};

export default function CopyDistinctId({ distinctId, className }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(distinctId);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Your unique ID has been copied.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Unable to copy",
        description: "Please copy manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={(className ? className + " " : "") + "flex space-x-2"}>
      <Input
        type="text"
        readOnly
        value={distinctId}
        className="min-w-auto md:min-w-[350px]"
      />
      <Button type="button" onClick={handleCopy} aria-label="Copy Purchase ID">
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}
