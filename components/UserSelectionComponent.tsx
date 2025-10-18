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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { UserSelectionComponentProps } from "@/types/temp-email-notification";

export function UserSelectionComponent({
  users,
  selectedUsers,
  onUserSelect,
  onSelectAll,
  onSelectNone,
  isLoading,
}: UserSelectionComponentProps) {
  const [bulkEmails, setBulkEmails] = useState("");
  const selectedCount = selectedUsers.size;
  const totalCount = users.length;
  const allSelected = totalCount > 0 && selectedCount === totalCount;
  const noneSelected = selectedCount === 0;

  const handleBulkDeselect = () => {
    if (!bulkEmails.trim()) return;

    // Parse emails from textarea (split by newlines and clean up)
    const emailsToDeselect = bulkEmails
      .split("\n")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    // Find users that match the emails and deselect them
    emailsToDeselect.forEach((email) => {
      const user = users.find((u) => u.email === email);
      if (user && selectedUsers.has(user.userId)) {
        onUserSelect(user.userId);
      }
    });

    // Clear the textarea after deselecting
    setBulkEmails("");
  };

  // Loading state - Requirements 2.4
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state - Requirements 2.4
  if (!isLoading && users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No users found with email addresses.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Users</CardTitle>

        {/* Bulk Deselect Section */}
        <div className="space-y-3">
          <div>
            <label
              htmlFor="bulk-emails"
              className="text-sm font-medium mb-2 block"
            >
              Bulk Deselect Emails
            </label>
            <Textarea
              id="bulk-emails"
              placeholder="Paste emails here, one per line..."
              value={bulkEmails}
              onChange={(e) => setBulkEmails(e.target.value)}
              className="min-h-[100px] resize-none"
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDeselect}
              disabled={!bulkEmails.trim() || isLoading}
            >
              Deselect
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t">
          <div className="flex gap-2">
            {/* Select All/None functionality - Requirements 2.3 */}
            <Button
              variant="outline"
              size="sm"
              onClick={allSelected ? onSelectNone : onSelectAll}
              disabled={totalCount === 0}
              aria-label={
                allSelected ? "Deselect all users" : "Select all users"
              }
            >
              {allSelected ? "Select None" : "Select All"}
            </Button>
          </div>
          {/* Display count of selected users - Requirements 2.4 */}
          <div className="text-sm text-muted-foreground" aria-live="polite">
            {selectedCount} of {totalCount} users selected
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="space-y-2 max-h-96 overflow-y-auto"
          role="group"
          aria-label="User selection list"
        >
          {users.map((user) => (
            <div
              key={user.userId}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 focus-within:bg-muted/50 transition-colors"
            >
              {/* Checkbox for each user - Requirements 2.1, 2.2 */}
              <Checkbox
                id={`user-${user.userId}`}
                checked={selectedUsers.has(user.userId)}
                onCheckedChange={() => onUserSelect(user.userId)}
                aria-describedby={`user-${user.userId}-email`}
              />
              <label
                htmlFor={`user-${user.userId}`}
                className="flex-1 cursor-pointer"
              >
                <div className="flex flex-col">
                  <span
                    id={`user-${user.userId}-email`}
                    className="text-sm font-medium break-all"
                  >
                    {user.email}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ID: {user.userId}
                  </span>
                </div>
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
