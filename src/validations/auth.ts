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

export const forgotPasswordSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const PASSWORD_REQUIREMENTS = [
  "At least 8 characters long",
  "At least one uppercase letter (A-Z)",
  "At least one lowercase letter (a-z)",
  "At least one number (0-9)",
  "At least one special character (e.g. ! @ # $ %)",
];

const newPasswordShape = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(128, "Password must be at most 128 characters long")
  .regex(/[a-z]/, "Password must include at least one lowercase letter")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter")
  .regex(/[0-9]/, "Password must include at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must include at least one special character"
  );

export const resetPasswordSchema = z
  .object({
    password: newPasswordShape,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: newPasswordShape,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from your current password",
    path: ["newPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;