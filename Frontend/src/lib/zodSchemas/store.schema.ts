import { z } from "zod";

export const createStoreSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  gstin: z.string().optional(),
});
export type CreateStoreSchema = z.infer<typeof createStoreSchema>;
