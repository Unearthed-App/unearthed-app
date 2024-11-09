/**
 * Copyright (C) 2024 Unearthed App
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


import { z } from "zod";

// Create a safe schema that checks if we're in browser environment
export const schema = z.object({
  file:
    typeof window === "undefined"
      ? z.any() // During SSR/static generation, be permissive
      : z
          .instanceof(File, { message: "Please upload a file" })
          .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: "File size must be less than 5MB",
          })
          .refine(
            (file) => {
              const validTypes = [
                "text/plain",
                "text/csv",
                "application/csv",
                "text/x-csv",
                "application/x-csv",
              ];
              return validTypes.includes(file.type) || file.type === "";
            },
            {
              message: "File must be a text or CSV file",
            }
          ),
  type: z.enum(["kindle", "csv"], {
    required_error: "Please select an upload type.",
  }),
});
