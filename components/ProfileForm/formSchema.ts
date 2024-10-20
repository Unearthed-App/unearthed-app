import { z } from "zod";

export const schema = z.object({
  capacitiesSpaceId: z.string(),
  capacitiesApiKey: z.string().optional(),
});
