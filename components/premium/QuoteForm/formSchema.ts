import { z } from "zod";

export const schema = z.object({
  content: z.string().min(1, "Quote is required"),
  note: z.string().optional(),
  color: z.string().min(1, "Color is required"),
  location: z.string().min(1, "Location is required"),
});
