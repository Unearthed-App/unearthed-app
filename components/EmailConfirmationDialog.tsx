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

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import type { EmailConfirmationDialogProps } from "@/types/temp-email-notification";

export const EmailConfirmationDialog: React.FC<
  EmailConfirmationDialogProps
> = ({ isOpen, selectedCount, onConfirm, onCancel, isLoading = false }) => {
  // Requirements 4.2 - Show email subject and details
  const emailSubject =
    "Important Changes to Unearthed - Free Local App Available";
  const emailTemplate = "free-no-more.tsx";

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="max-w-md sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle
              className="h-5 w-5 text-orange-500"
              aria-hidden="true"
            />
            Confirm Email Sending
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              {/* Requirements 4.2 - Show number of recipients and email subject */}
              <div className="text-sm">
                <p className="font-medium text-foreground mb-2">
                  You are about to send emails to:
                </p>
                <div className="bg-muted p-3 rounded-md space-y-1">
                  <p>
                    <span className="font-medium">Recipients:</span>{" "}
                    {selectedCount} user{selectedCount !== 1 ? "s" : ""}
                  </p>
                  <p className="break-words">
                    <span className="font-medium">Subject:</span> {emailSubject}
                  </p>
                  <p>
                    <span className="font-medium">Template:</span>{" "}
                    {emailTemplate}
                  </p>
                </div>
              </div>

              {/* Requirements 4.3 - Warning messages about irreversible action */}
              <div
                className="bg-orange-50 border border-orange-200 p-3 rounded-md"
                role="alert"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle
                    className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div className="text-sm text-orange-800">
                    <p className="font-medium mb-1">
                      Warning: This action cannot be undone
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>
                        Emails will be sent immediately to all selected users
                      </li>
                      <li>
                        You cannot recall or stop emails once sending begins
                      </li>
                      <li>
                        Each user will receive the notification in their inbox
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Please confirm that you want to proceed with sending these
                emails.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Requirements 4.3, 4.4 - Confirm/cancel actions */}
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto"
            aria-describedby="send-button-description"
          >
            {isLoading
              ? "Sending..."
              : `Send to ${selectedCount} User${selectedCount !== 1 ? "s" : ""}`}
          </AlertDialogAction>
          <span id="send-button-description" className="sr-only">
            This will immediately send emails to {selectedCount} selected user
            {selectedCount !== 1 ? "s" : ""}
          </span>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
