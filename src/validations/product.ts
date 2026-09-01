import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name is too long"),

  description: z
    .string()
    .trim()
    .min(5, "Product description must be at least 5 characters")
    .max(1000, "Product description is too long"),

  price: z
    .number({
      message: "Price must be a valid number",
    })
    .positive("Price must be greater than 0")
    .refine(
      (value) => Number.isInteger(value * 100),
      "Price can have at most 2 decimal places"
    )
    .refine(
      (value) => value < 100000000,
      "Price is too large"
    ),

  unit: z.enum(["KG", "LITRE", "PIECE", "DOZEN"], {
    message: "Please select a valid unit",
  }),

  availability: z
    .enum(["IN_STOCK", "SEASONAL", "OUT_OF_STOCK"], {
      message: "Please select a valid availability status",
    })
    .default("IN_STOCK"),

  imageUrl: z
    .string()
    .trim()
    .url("Image URL must be a valid URL")
    .optional()
    .or(z.literal("")),

  categoryId: z
    .string()
    .trim()
    .min(1, "Category is required"),
});

export type ProductInput = z.infer<typeof productSchema>;