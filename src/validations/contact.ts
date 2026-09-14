import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(20, "Phone number is too long"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal(""))
    .transform((value) => value || undefined),

  subject: z
    .string()
    .trim()
    .max(150, "Subject is too long")
    .optional()
    .or(z.literal(""))
    .transform((value) => value || undefined),

  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters")
    .max(2000, "Message is too long"),

  acceptTerms: z
    .boolean()
    .refine((value) => value === true, {
      message:
        "Please agree to the Privacy Policy and Terms & Conditions to continue.",
    }),
});

export type ContactInput = z.infer<typeof contactSchema>;
