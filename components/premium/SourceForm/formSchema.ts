import { z } from "zod";

export const schema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  author: z.string().min(1, "Author is required"),
  type: z.string().default("BOOK"),
  origin: z.string().default("UNEARTHED"),
});
