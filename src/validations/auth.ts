import { z } from "zod";

export const adminLoginSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;