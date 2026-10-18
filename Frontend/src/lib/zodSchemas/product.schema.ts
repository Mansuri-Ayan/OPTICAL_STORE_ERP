import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category_id: z.number().int().positive("Category is required"),
  brand_id: z.number().int().positive("Brand is required"),
  sku: z.string().optional(),
  base_price: z.number().nonnegative().optional(),
  selling_price: z.number().nonnegative().optional(),
});
export type CreateProductSchema = z.infer<typeof createProductSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});
export type CategorySchema = z.infer<typeof categorySchema>;

export const brandSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});
export type BrandSchema = z.infer<typeof brandSchema>;
