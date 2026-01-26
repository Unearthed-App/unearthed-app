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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { EmailPreviewModalProps } from "@/types/temp-email-notification";

export function EmailPreviewModal({ isOpen, onClose }: EmailPreviewModalProps) {
  // Email content with proper apostrophes

  const emailContent = `Hey!

I'm happy to announce that a lot of people are using Unearthed, thank you ☺️

That's great, but the problem is the vast majority are doing so for free. Which means I need to change something so that my costs don't continue to grow for the rest of my life 😅

The solution I've come up with is to offer something that runs locally on your computer, which means there's no hosting costs involved for me, and that means there will be no monthly costs for you.`;

  const goodNewsContent = `You get a free app (Unearthed Local) forever, no subscription required. The one condition is that you download it before the 1st of October. If you try to get it after that it will ask you for a one time payment, which will also let you keep it forever after that.

Unearthed Local does not require a Browser extension or Obsidian Plugin. It is also completely private and does not see your Amazon credentials either.

Go here to get the app: https://unearthed.app/dashboard/free-no-more
You can read about it more by clicking the 'Read about it' button on that page too. I'll update the docs and videos soon.`;

  const badNewsContent = `I've decided to simplify Unearthed.app (Unearthed Online) and just offer the one tier which will not be free anymore, sorry! This means any free accounts will lose access after 1st of October. So please download your data before then.`;

  const pinkSection = `If you're a Premium user you can download the Unearthed Local app for free forever. Everything else will remain the same for you.`;

  const goodbyeContent = `I didn't want to just kick people out without giving them an alternative.
I hope that you agree on the solution that I've come up with 🙂

Thanks for listening.`;

  const noteContent =
    "This is an important update about Unearthed's pricing model. Please take action before October 1st.";
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Email Preview</DialogTitle>
          <DialogDescription>
            This is how the email will appear to recipients. Use the scroll area
            below to view the complete email content.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div
            className="border rounded-lg p-4 bg-gray-50 max-h-[60vh] overflow-y-auto"
            role="region"
            aria-label="Email content preview"
            tabIndex={0}
          >
            {/* Email Header */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm font-medium text-blue-800">
                Email Details:
              </p>
              <p className="text-sm text-blue-700">
                <strong>Subject:</strong> Important Changes to Unearthed - Free
                Local App Available
              </p>
              <p className="text-sm text-blue-700">
                <strong>From:</strong> Unearthed &lt;contact@unearthed.app&gt;
              </p>
            </div>

            {/* Email Content Preview */}
            <div className="bg-white border-2 border-black rounded-lg p-4 font-sans">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-black mb-2">
                  Changes to Unearthed
                </h1>
              </div>

              <div className="bg-orange-100 border-2 border-orange-500 rounded-lg p-6 mb-4">
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="text-orange-900 text-sm leading-relaxed whitespace-pre-line">
                    {emailContent}
                  </div>
                </div>
              </div>

              <div className="bg-green-100 border-2 border-green-600 rounded-lg p-6 mb-4">
                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="text-lg font-bold text-green-800 mb-3">
                    Good News 🎉
                  </h3>
                  <div className="text-green-800 text-sm leading-relaxed whitespace-pre-line">
                    {goodNewsContent}
                  </div>
                </div>
              </div>

              <div className="bg-red-100 border-2 border-red-600 rounded-lg p-6 mb-4">
                <div className="border-l-4 border-red-600 pl-4">
                  <h3 className="text-lg font-bold text-red-800 mb-3">
                    Bad News 😔
                  </h3>
                  <div className="text-red-800 text-sm leading-relaxed whitespace-pre-line">
                    {badNewsContent}
                  </div>
                </div>
              </div>

              <div className="bg-pink-100 border-2 border-pink-500 rounded-lg p-6 mb-4">
                <div className="border-l-4 border-pink-500 pl-4">
                  <div className="text-pink-900 text-sm leading-relaxed whitespace-pre-line">
                    {pinkSection}
                  </div>
                </div>
              </div>

              <div className="bg-orange-100 border-2 border-orange-500 rounded-lg p-6 mb-4">
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="text-orange-900 text-sm leading-relaxed whitespace-pre-line">
                    {goodbyeContent}
                  </div>
                </div>
              </div>

              <hr className="border-gray-300 my-6" />

              <p className="text-gray-600 text-xs leading-6 mb-6">
                {noteContent}
              </p>

              <div className="text-center">
                <a
                  href="https://unearthed.app/dashboard/free-no-more"
                  className="inline-block bg-orange-500 text-white px-6 py-3 rounded font-bold border-2 border-black no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get The App
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
