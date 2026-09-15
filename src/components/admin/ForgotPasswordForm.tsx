"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/admin/gate-1d2a951ba82a/forgot-password/action";
import { ADMIN_LOGIN_PATH } from "@/lib/admin-routes";

const initialState = {
  submitted: false,
  error: "",
};

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialState
  );

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

  if (state.submitted) {
    return (
      <div className="mt-8 space-y-6">
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          If an account with that phone number exists and has an email on
          file, a password reset link has been sent to it. The link expires
          in 1 hour.
        </div>

        <Link
          href={ADMIN_LOGIN_PATH}
          className="block text-center text-sm font-medium text-green-800 hover:underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="phone"
          className="text-sm font-medium text-green-950"
        >
          Phone Number
        </label>

        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          placeholder="98XXXXXXXX"
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
        {pending ? "Sending..." : "Send Reset Link"}
      </button>

      <Link
        href={ADMIN_LOGIN_PATH}
        className="block text-center text-sm font-medium text-green-800 hover:underline"
      >
        Back to login
      </Link>
    </form>
  );
}
