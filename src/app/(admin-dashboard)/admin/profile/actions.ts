"use server";

import { compare, hash } from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema } from "@/validations/auth";

type ChangePasswordState = {
  success: boolean;
  error: string;
};

export async function changePassword(
  _previousState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      error: "You must be signed in to do this.",
    };
  }

  const result = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message ?? "Please check your input.",
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return {
      success: false,
      error: "Account not found.",
    };
  }

  const isCurrentPasswordValid = await compare(
    result.data.currentPassword,
    user.password
  );

  if (!isCurrentPasswordValid) {
    return {
      success: false,
      error: "Current password is incorrect.",
    };
  }

  const hashedPassword = await hash(result.data.newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return {
    success: true,
    error: "",
  };
}
