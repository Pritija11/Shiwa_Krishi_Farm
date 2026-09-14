import { z } from "zod";

export const dayOfWeekValues = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export const subscriptionFrequencyValues = [
  "DAILY",
  "WEEKLY",
  "CUSTOM",
] as const;

export const subscriptionDurationValues = [
  "ONGOING",
  "ONE_MONTH",
  "THREE_MONTHS",
  "SIX_MONTHS",
] as const;

// The farm operates in Nepal (Asia/Kathmandu, UTC+5:45). "Today" must be
// resolved in that timezone rather than the server's own (often UTC) clock,
// otherwise a customer near midnight NPT could have a genuinely past date
// accepted, or a genuinely valid "today" rejected.
function getTodayInFarmTimezone(): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date());
}

export const subscriptionSchema = z
  .object({
    customerName: z
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

    deliveryAddress: z
      .string()
      .trim()
      .min(3, "Delivery address is required")
      .max(300, "Delivery address is too long"),

    productId: z
      .string()
      .trim()
      .min(1, "Please select a product"),

    quantity: z
      .number({ message: "Quantity must be a valid number" })
      .positive("Quantity must be greater than 0"),

    frequency: z.enum(subscriptionFrequencyValues, {
      message: "Please select a valid delivery frequency",
    }),

    deliveryDays: z
      .array(
        z.enum(dayOfWeekValues, {
          message: "Invalid delivery day",
        })
      )
      .default([])
      .transform((days) => Array.from(new Set(days))),

    startDate: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Please provide a valid start date")
      .refine(
        (value) => value >= getTodayInFarmTimezone(),
        "Start date cannot be in the past"
      ),

    duration: z.enum(subscriptionDurationValues, {
      message: "Please select a valid subscription duration",
    }),

    message: z
      .string()
      .trim()
      .max(500, "Message is too long")
      .optional()
      .or(z.literal(""))
      .transform((value) => value || undefined),

    acceptTerms: z
      .boolean()
      .refine((value) => value === true, {
        message:
          "Please agree to the Privacy Policy and Terms & Conditions to continue.",
      }),
  })
  .superRefine((data, ctx) => {
    if (
      (data.frequency === "WEEKLY" || data.frequency === "CUSTOM") &&
      data.deliveryDays.length === 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["deliveryDays"],
        message: "Select at least one delivery day",
      });
    }
  });

export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
