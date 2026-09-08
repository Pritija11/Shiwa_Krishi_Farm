import { z } from "zod";

export const gallerySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),

  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or less")
    .optional()
    .or(z.literal("")),

  mediaUrl: z
    .string()
    .trim()
    .min(1, "Media file is required"),

  mediaType: z.enum(["IMAGE", "VIDEO"]),

  category: z.enum([
    "FARM",
    "ANIMALS",
    "POULTRY",
    "GOATS",
    "DAIRY",
    "VEGETABLES",
    "FAMILY",
    "OTHER",
  ]),

  isActive: z.boolean().default(true),
});

export type GalleryInput = z.infer<typeof gallerySchema>;