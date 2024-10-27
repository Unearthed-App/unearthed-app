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
