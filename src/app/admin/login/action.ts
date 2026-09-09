"use server";

import { headers } from "next/headers";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { adminLoginSchema } from "@/validations/auth";
import {
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  clearLoginAttempts,
} from "@/lib/login-rate-limit";

type LoginState = {
  success: boolean;
  error: string;
};

async function getClientIp() {
  const headersList = await headers();

  const forwardedFor = headersList.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return headersList.get("x-real-ip") ?? "unknown";
}

export async function loginAdmin(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const rawPhone = String(formData.get("phone") ?? "");
  const ip = await getClientIp();
  const rateLimitKey = `${ip}:${rawPhone}`;

  const rateLimit = checkLoginRateLimit(rateLimitKey);

  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Too many failed attempts. Please try again in ${rateLimit.retryAfterMinutes} minute(s).`,
    };
  }

  const result = adminLoginSchema.safeParse({
    phone: rawPhone,
    password: formData.get("password"),
  });

  if (!result.success) {
    recordFailedLoginAttempt(rateLimitKey);

    return {
      success: false,
      error: "Please enter a valid phone number and password.",
    };
  }

  try {
    await signIn("credentials", {
      phone: result.data.phone,
      password: result.data.password,
      redirectTo: "/admin",
    });

    return {
      success: true,
      error: "",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      recordFailedLoginAttempt(rateLimitKey);

      return {
        success: false,
        error: "Invalid phone number or password.",
      };
    }

    // Any other thrown value here is Next.js's internal redirect
    // signal from a successful signIn() call.
    clearLoginAttempts(rateLimitKey);

    throw error;
  }
}
