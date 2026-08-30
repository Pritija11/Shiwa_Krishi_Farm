import { z } from "zod";

export const enquirySchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  phone: z
    .string()
    .trim()
    .regex(/^(97|98)\d{8}$/, "Enter a valid Nepali phone number"),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),

  quantity: z
    .number()
    .positive("Quantity must be greater than 0"),

  deliveryAddress: z
    .string()
    .trim()
    .min(5, "Delivery address is required")
    .max(255, "Delivery address is too long"),

  preferredDate: z
    .string()
    .min(1, "Preferred date is required")
    .refine(
      (date) => {
        const today = new Date();
        const todayString = today.toISOString().split("T")[0];

        return date >= todayString;
      },
      {
        message: "Preferred date cannot be in the past",
      }
    ),

  message: z
    .string()
    .trim()
    .max(500, "Message is too long")
    .optional()
    .or(z.literal("")),

  productId: z
    .string()
    .min(1, "Product is required"),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;