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

interface ConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  title?: string;
  description?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  children: React.ReactNode;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  onCancel,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone.",
  confirmText = "Continue",
  cancelText = "Cancel",
  children,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Confirmation error:", error);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
