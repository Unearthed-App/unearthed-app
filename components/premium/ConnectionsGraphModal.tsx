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

import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, X, RefreshCw } from "lucide-react";

interface ConnectionsGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  isGenerating: boolean;
  searchQuery: string;
  onSearch: (value: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  mindMapSigmaData: any;
  dynamicQuoteColor: string | null;
}

export function ConnectionsGraphModal({
  isOpen,
  onClose,
  onRefresh,
  isGenerating,
  searchQuery,
  onSearch,
  searchInputRef,
  containerRef,
  mindMapSigmaData,
  dynamicQuoteColor,
}: ConnectionsGraphModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-[100vw] h-[100vh] md:w-[calc(98vw-2rem)] md:h-[calc(98vh-2rem)] xl:w-[calc(90vw-2rem)] xl:h-[calc(90vh-2rem)] bg-card shadow-2xl rounded-lg border-2 overflow-hidden">
        {/* Controls */}
        <div className="absolute top-4 left-4 z-10 flex gap-2 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="flex items-center"
            aria-label="Close Graph View"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isGenerating}
            aria-label="Refresh Connections Graph"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          <div className="w-48 sm:w-64">
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full text-sm"
              aria-label="Search graph nodes"
            />
          </div>
        </div>
        {(!mindMapSigmaData || !dynamicQuoteColor) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
          </div>
        )}
        {mindMapSigmaData && dynamicQuoteColor && (
          <div ref={containerRef} className="w-full h-full" />
        )}
      </div>
    </div>,
    document.body
  );
}
