"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/validations/auth";
import { hashResetToken } from "@/lib/password-reset";

type ResetPasswordState = {
  success: boolean;
  error: string;
};

export async function findUserByResetToken(rawToken: string) {
  if (!rawToken) {
    return null;
  }

  const tokenHash = hashResetToken(rawToken);

  const user = await prisma.user.findUnique({
    where: { passwordResetTokenHash: tokenHash },
  });

  if (
    !user ||
    !user.passwordResetExpiresAt ||
    user.passwordResetExpiresAt < new Date()
  ) {
    return null;
  }

  return user;
}

export async function resetPassword(
  _previousState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const rawToken = String(formData.get("token") ?? "");

  const result = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message ?? "Please check your input.",
    };
  }

  const user = await findUserByResetToken(rawToken);

  if (!user) {
    return {
      success: false,
      error:
        "This reset link is invalid or has expired. Please request a new one.",
    };
  }

  const hashedPassword = await hash(result.data.password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
    },
  });

  return {
    success: true,
    error: "",
  };
}
