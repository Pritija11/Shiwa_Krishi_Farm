"use server";

import { signOut, ADMIN_LOGIN_PATH } from "@/auth";

export async function logoutAdmin() {
  await signOut({
    redirectTo: ADMIN_LOGIN_PATH,
  });
}