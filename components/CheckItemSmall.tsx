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

import { CheckCircle, CircleDashed } from "lucide-react";

export const CheckItemSmall = ({
  content,
  variant,
}: {
  content: string;
  variant?: string;
}) => {
  return (
    <div className="flex w-full space-x-4 items-center my-1 md:my-2 text-sm lg:text-xl">
      <div
        className={`w-4 h-4 rounded-full ${
          variant === "destructive" ? "bg-destructive" : "bg-primary"
        }`}
      >
        {variant === "destructive" ? (
          <CircleDashed className="w-4 h-4" />
        ) : (
          <CheckCircle className="w-4 h-4" />
        )}
      </div>
      <div
        className={`text-sm font-semibold ${
          variant === "destructive" ? "text-muted" : ""
        }`}
      >
        {content}
      </div>
    </div>
  );
};
