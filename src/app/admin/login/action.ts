"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { adminLoginSchema } from "@/validations/auth";

type LoginState = {
  success: boolean;
  error: string;
};

export async function loginAdmin(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const result = adminLoginSchema.safeParse({
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!result.success) {
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
      return {
        success: false,
        error: "Invalid phone number or password.",
      };
    }

    throw error;
  }
}