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

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Download, Info, Crown } from "lucide-react";
import Link from "next/link";

export function DataAccessWarning() {
  return (
    <div className="mb-8 w-full flex justify-center">
      <Card className="w-full max-w-4xl bg-red-50 dark:bg-red-900/30 border-4 border-red-600 dark:border-red-400 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400 mb-2 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-3">
                IMPORTANT: Data Access Ending October 1st
              </h2>
              <p className="text-lg text-red-700 dark:text-red-200 mb-4 font-semibold">
                You will lose access to your data after October 1st, 2025. Take
                action now to preserve your highlights and books!
              </p>
              <div className="mb-2">
                <Link href="/dashboard/free-no-more" target="_blank">
                  <Button
                    variant="outline"
                    className="border-2 border-red-600 dark:border-red-400 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 w-full"
                  >
                    <Info className="mr-2 h-4 w-4" />
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="space-y-6">
                <p className="text-red-600 dark:text-red-300 text-lg font-bold mt-4">
                  Choose your path forward:
                </p>

                {/* Option 1 - Unearthed Local */}
                <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg border-2 border-green-500">
                  <h3 className="font-bold text-green-800 dark:text-green-300 mb-2 text-lg">
                    Option 1: Get Unearthed Local (Free until Oct 1st) 🎉
                  </h3>
                  <p className="text-green-700 dark:text-green-200 mb-3">
                    Download the desktop app - no subscription, runs locally on
                    your computer, yours forever. Perfect for privacy-focused
                    users who want full control of their data.
                  </p>
                  <Link href="/dashboard/free-no-more" target="_blank">
                    <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold border-2 border-black dark:border-white w-full sm:w-auto">
                      <Download className="mr-2 h-4 w-4" />
                      Download Unearthed Local (Free)
                    </Button>
                  </Link>
                </div>

                {/* Option 2 - Download Data */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-2 border-blue-500">
                  <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2 text-lg">
                    Option 2: Download Your Data to Obsidian
                  </h3>
                  <p className="text-blue-700 dark:text-blue-200 mb-3">
                    Export all your highlights and notes in Obsidian-compatible
                    format. Keep your data in your preferred note-taking system.
                  </p>
                  <p className="text-blue-700 dark:text-blue-200 mb-3 font-semibold">
                    Do this via the Obsidian Plugin as usual and then disconnect
                    Unearthed by removing the API Key
                  </p>
                </div>

                {/* Option 3 - Premium */}
                <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg border-2 border-purple-500">
                  <h3 className="font-bold text-purple-800 dark:text-purple-300 mb-2 text-lg">
                    Option 3: Get Unearthed Online
                  </h3>
                  <p className="text-purple-700 dark:text-purple-200 mb-3">
                    Continue using Unearthed online with premium features, cloud
                    sync, and ongoing support. Keep everything as it is today +
                    extra features
                  </p>
                  <Link href="/dashboard/get-premium">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold border-2 border-black dark:border-white w-full sm:w-auto">
                      <Crown className="mr-2 h-4 w-4" />
                      Get Unearthed Online
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
