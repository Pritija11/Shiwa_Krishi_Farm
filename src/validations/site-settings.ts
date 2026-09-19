import { z } from "zod";

export const siteSettingsSchema = z.object({
  phone: z.string().trim().min(1, "Phone number is required"),
  whatsapp: z.string().trim().min(1, "WhatsApp number is required"),
  email: z.string().trim().min(1, "Email is required"),
  address: z.string().trim().min(1, "Address is required"),

  locationUrl: z.string().trim().optional(),
  googleMapsUrl: z.string().trim().optional(),
  googleBusinessProfileUrl: z.string().trim().optional(),
  workingHours: z.string().trim().optional(),
  deliveryAreas: z.string().trim().optional(),
  deliveryDays: z.string().trim().optional(),
  facebookUrl: z.string().trim().optional(),
  instagramUrl: z.string().trim().optional(),
  tiktokUrl: z.string().trim().optional(),

  heroImages: z
    .array(z.string().trim().min(1))
    .min(1, "At least one hero image is required")
    .max(5, "You can upload up to 5 hero images"),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
