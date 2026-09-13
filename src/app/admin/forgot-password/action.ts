"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { forgotPasswordSchema } from "@/validations/auth";
import { generateResetToken, RESET_TOKEN_TTL_MS } from "@/lib/password-reset";
import {
  checkPasswordResetRateLimit,
  recordPasswordResetAttempt,
} from "@/lib/password-reset-rate-limit";

type ForgotPasswordState = {
  submitted: boolean;
  error: string;
};

// Always shown after a valid-looking submission, regardless of whether the
// phone number matched an account or that account has an email on file —
// this keeps the endpoint from revealing which phone numbers exist.
const GENERIC_SUCCESS_STATE: ForgotPasswordState = {
  submitted: true,
  error: "",
};

async function getClientIp() {
  const headersList = await headers();

  const forwardedFor = headersList.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return headersList.get("x-real-ip") ?? "unknown";
}

async function getBaseUrl() {
  const headersList = await headers();

  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}`;
}

export async function requestPasswordReset(
  _previousState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const rawPhone = String(formData.get("phone") ?? "");
  const ip = await getClientIp();
  const rateLimitKey = `${ip}:${rawPhone}`;

  const rateLimit = checkPasswordResetRateLimit(rateLimitKey);

  if (!rateLimit.allowed) {
    return {
      submitted: false,
      error: `Too many requests. Please try again in ${rateLimit.retryAfterMinutes} minute(s).`,
    };
  }

  const result = forgotPasswordSchema.safeParse({ phone: rawPhone });

  if (!result.success) {
    return {
      submitted: false,
      error: "Please enter a valid phone number.",
    };
  }

  recordPasswordResetAttempt(rateLimitKey);

  const user = await prisma.user.findUnique({
    where: { phone: result.data.phone },
  });

  if (!user || !user.isActive || user.role !== "ADMIN" || !user.email) {
    // Don't reveal whether the account exists or has an email on file.
    return GENERIC_SUCCESS_STATE;
  }

  const { rawToken, tokenHash } = generateResetToken();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  const baseUrl = await getBaseUrl();
  const resetUrl = `${baseUrl}/admin/reset-password?token=${rawToken}`;

  try {
    await sendEmail(
      user.email,
      "Reset your Shiwa Krishi admin password",
      [
        `Hello ${user.name},`,
        "",
        "We received a request to reset your Shiwa Krishi admin password.",
        "",
        `Reset your password: ${resetUrl}`,
        "",
        "This link expires in 1 hour. If you didn't request this, you can safely ignore this email.",
      ].join("\n")
    );
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    // Still return the generic success state — don't leak SES failures to
    // the client, and don't reveal account existence either way.
  }

  return GENERIC_SUCCESS_STATE;
}
