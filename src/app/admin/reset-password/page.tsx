import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import ResetPasswordForm from "@/components/admin/ResetPasswordForm";
import { findUserByResetToken } from "./action";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const session = await auth();

  if (session?.user?.role === "ADMIN") {
    redirect("/admin");
  }

  const { token } = await searchParams;
  const user = token ? await findUserByResetToken(token) : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F5ED] px-6">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
              Shiwa Krishi Farm
            </p>

            <h1 className="mt-3 font-[family-name:var(--font-dm-serif)] text-4xl text-green-950">
              Reset Password
            </h1>

            {user ? (
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Choose a new password for your admin account.
              </p>
            ) : (
              <p className="mt-3 text-sm leading-6 text-stone-600">
                This reset link is invalid or has expired.
              </p>
            )}
          </div>

          {user ? (
            <ResetPasswordForm token={token as string} />
          ) : (
            <div className="mt-8">
              <Link
                href="/admin/forgot-password"
                className="block w-full rounded-full bg-green-900 px-6 py-3.5 text-center text-sm font-medium text-white transition hover:bg-green-800"
              >
                Request a new link
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
