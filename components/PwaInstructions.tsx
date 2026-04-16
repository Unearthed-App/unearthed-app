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

"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, Smartphone } from "lucide-react";

const IOS_STEPS = [
  {
    step: "1",
    title: "Open in Safari",
    detail:
      "Visit mobile.unearthed.app in Safari on your iPhone or iPad. Safari is required — other iOS browsers cannot install PWAs.",
  },
  {
    step: "2",
    title: "Tap the Share button",
    detail:
      "Tap the Share icon (the box with an arrow pointing up) at the bottom of the screen.",
  },
  {
    step: "3",
    title: '"Add to Home Screen"',
    detail: 'Scroll down the share sheet and tap "Add to Home Screen".',
  },
  {
    step: "4",
    title: "Confirm",
    detail:
      'Optionally rename the app, then tap "Add" in the top-right corner.',
  },
  {
    step: "5",
    title: "Open from your home screen",
    detail:
      "Find the Unearthed icon on your home screen. It opens fullscreen, just like a native app.",
  },
];

const ANDROID_STEPS = [
  {
    step: "1",
    title: "Open in Chrome",
    detail:
      "Visit mobile.unearthed.app in Chrome on your Android device. Chrome gives the best install experience.",
  },
  {
    step: "2",
    title: "Tap the menu",
    detail: "Tap the three-dot menu (⋮) in the top-right corner of Chrome.",
  },
  {
    step: "3",
    title: '"Add to Home screen"',
    detail: 'Tap "Add to Home screen" from the menu.',
  },
  {
    step: "4",
    title: "Confirm",
    detail:
      'Tap "Add" to confirm. Some devices will show an install prompt automatically.',
  },
  {
    step: "5",
    title: "Open from your home screen",
    detail:
      "Find the Unearthed icon on your home screen or app drawer. It opens fullscreen, just like a native app.",
  },
];

function StepList({ steps }: { steps: typeof IOS_STEPS }) {
  return (
    <ol className="space-y-3">
      {steps.map((item) => (
        <li key={item.step} className="flex gap-3 items-start">
          <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground dark:text-neutral-900 rounded-full flex items-center justify-center font-black text-xs border-2 border-black dark:border-primary/40">
            {item.step}
          </span>
          <div>
            <p className="font-semibold text-sm">{item.title}</p>
            <p className="text-muted-foreground text-sm">{item.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function PwaInstructions({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Accordion type="single" collapsible>
        <AccordionItem
          value="instructions"
          className="border-2 border-black dark:border-border rounded-md shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.1)] bg-card overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30 transition-colors [&[data-state=open]>svg]:rotate-180 font-black text-sm tracking-wide">
            <span className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary" />
              Installation Instructions
            </span>
          </AccordionTrigger>
          <AccordionContent className="border-t-2 border-black dark:border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black dark:divide-border">
              {/* iOS */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center border border-black">
                    <BookOpen className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-sm">iPhone / iPad</p>
                    <p className="text-xs text-muted-foreground">Use Safari</p>
                  </div>
                </div>
                <StepList steps={IOS_STEPS} />
              </div>

              {/* Android */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-600 to-emerald-800 flex items-center justify-center border border-black">
                    <Smartphone className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-sm">Android</p>
                    <p className="text-xs text-muted-foreground">Use Chrome</p>
                  </div>
                </div>
                <StepList steps={ANDROID_STEPS} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
