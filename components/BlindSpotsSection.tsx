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
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Eye, Loader2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { generateBlindSpotsAnalysis } from "@/server/actions-premium";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BlindSpot {
  category: string;
  description: string;
  recommendations: {
    title: string;
    author: string;
    reason: string;
  }[];
}

interface BlindSpotsResponse {
  blindSpots: BlindSpot[];
  patterns: string[];
  suggestedTopics: string[];
}

export function BlindSpotsSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);

  const {
    data: blindSpots,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<BlindSpotsResponse>({
    queryKey: ["blindSpots"],
    queryFn: async () => {
      // Check sessionStorage first if not forcing refresh
      if (!forceRefresh) {
        const stored = sessionStorage.getItem("blindSpots");
        if (stored) {
          return JSON.parse(stored);
        }
      }

      // If forcing refresh or no stored data, fetch new data
      const result = await generateBlindSpotsAnalysis();
      sessionStorage.setItem("blindSpots", JSON.stringify(result));
      setForceRefresh(false);
      return result;
    },
    enabled: isOpen, // Only fetch when section is open
    retry: false, // Don't retry on failure
  });

  const handleRefresh = () => {
    // Clear session storage
    sessionStorage.removeItem("blindSpots");

    // Force a refresh and clear UI
    setForceRefresh(true);

    // Clear the current data from React Query cache and refetch
    refetch();
  };

  return (
    <div className="w-full flex justify-center">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full space-y-2 sm:max-w-[800px]"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Blind Spots Analysis
                  </div>
                  <span className="hidden md:inline-block text-xs opacity-50">
                    {isOpen ? "Click to close" : "Click to expand"}
                  </span>
                </Button>
              </CollapsibleTrigger>
            </TooltipTrigger>
            <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
              <p>
                Analyze your reading patterns to discover
                <br />
                potential knowledge gaps and get
                <br />
                personalised book recommendations
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <CollapsibleContent className="space-y-4">
          <div className="flex justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="brutal"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading || isFetching}
                  >
                    {isLoading || isFetching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                  <p>Refresh analysis with latest reading data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {isLoading || isFetching ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm text-muted-foreground">
                Analyzing your reading patterns...
              </p>
            </div>
          ) : error ? (
            <div className="text-red-500">
              {error instanceof Error
                ? error.message
                : "Failed to analyze blind spots"}
            </div>
          ) : blindSpots ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 px-8">
                <div className="space-y-2 border-2 rounded-md bg-popover p-3">
                  <h4 className="font-semibold text-xl">Reading Patterns</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {blindSpots.patterns.map((pattern, i) => (
                      <li key={i}>{pattern}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 border-2 rounded-md bg-popover p-3">
                  <h4 className="font-semibold text-xl">
                    Suggested Topics to Explore
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {blindSpots.suggestedTopics.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2 px-8">
                <h4 className="font-semibold text-xl text-center text-alternate">
                  Potential Blind Spots ({blindSpots.blindSpots.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {blindSpots.blindSpots.map((spot, i) => (
                    <div
                      key={i}
                      className="border-2 p-3 rounded-md space-y-2 bg-card"
                    >
                      <h5 className="font-medium">{spot.category}</h5>
                      <p className="text-sm opacity-80">{spot.description}</p>
                      <div className="space-y-2">
                        <h6 className="text-sm font-medium">
                          Recommended Reading:
                        </h6>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {spot.recommendations.map((rec, j) => (
                            <li key={j}>
                              <span className="font-medium">{rec.title}</span>{" "}
                              by {rec.author}
                              <p className="text-xs opacity-70">{rec.reason}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
