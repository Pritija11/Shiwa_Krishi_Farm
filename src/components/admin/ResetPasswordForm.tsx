"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { resetPassword } from "@/app/admin/gate-1d2a951ba82a/reset-password/action";
import { PASSWORD_REQUIREMENTS } from "@/validations/auth";
import { ADMIN_LOGIN_PATH } from "@/lib/admin-routes";

const initialState = {
  success: false,
  error: "",
};

type ResetPasswordFormProps = {
  token: string;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction, pending] = useActionState(
    resetPassword,
    initialState
  );
  const [showPassword, setShowPassword] = useState(false);

  // Tracks which error has already been auto-dismissed. A fresh submission
  // always produces a new `state` object, so a new error becomes visible
  // again without needing to explicitly "undismiss" anything.
  const [dismissedState, setDismissedState] = useState<typeof state | null>(
    null
  );
  const isErrorVisible = Boolean(state.error) && state !== dismissedState;

  useEffect(() => {
    if (!state.error) {
      return;
    }

    const timer = setTimeout(() => {
      setDismissedState(state);
    }, 2000);

    return () => clearTimeout(timer);
  }, [state]);

  if (state.success) {
    return (
      <div className="mt-8 space-y-6">
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          Your password has been reset successfully. You can now sign in
          with your new password.
        </div>

        <Link
          href={ADMIN_LOGIN_PATH}
          className="block w-full rounded-full bg-green-900 px-6 py-3.5 text-center text-sm font-medium text-white transition hover:bg-green-800"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="token" value={token} />

      <div>
        <label
          htmlFor="password"
          className="text-sm font-medium text-green-950"
        >
          New Password
        </label>

        <div className="relative mt-2">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="At least 8 characters"
            className="w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 pr-11 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/10"
          />

          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-stone-500 transition hover:text-stone-700"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        <ul className="mt-2 space-y-0.5 text-xs text-stone-500">
          {PASSWORD_REQUIREMENTS.map((requirement) => (
            <li key={requirement}>&bull; {requirement}</li>
          ))}
        </ul>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-green-950"
        >
          Confirm New Password
        </label>

        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          placeholder="Re-enter your new password"
          className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/10"
        />
      </div>

      {isErrorVisible && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-green-900 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}
