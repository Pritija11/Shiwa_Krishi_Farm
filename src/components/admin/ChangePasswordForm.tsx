"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { changePassword } from "@/app/(admin-dashboard)/admin/profile/actions";
import { PASSWORD_REQUIREMENTS } from "@/validations/auth";

const initialState = {
  success: false,
  error: "",
};

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(
    changePassword,
    initialState
  );
  const [showPasswords, setShowPasswords] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Tracks which result has already been auto-dismissed. A fresh submission
  // always produces a new `state` object, so it naturally becomes visible
  // again without needing to explicitly "undismiss" anything.
  const [dismissedState, setDismissedState] = useState<typeof state | null>(
    null
  );
  const isResultVisible =
    (state.success || Boolean(state.error)) && state !== dismissedState;

  useEffect(() => {
    if (!state.success && !state.error) {
      return;
    }

    if (state.success) {
      formRef.current?.reset();
    }

    const timer = setTimeout(() => {
      setDismissedState(state);
    }, 2000);

    return () => clearTimeout(timer);
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="currentPassword"
          className="text-sm font-medium text-green-950"
        >
          Current Password
        </label>

        <input
          id="currentPassword"
          name="currentPassword"
          type={showPasswords ? "text" : "password"}
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/10"
        />
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="text-sm font-medium text-green-950"
        >
          New Password
        </label>

        <div className="relative mt-2">
          <input
            id="newPassword"
            name="newPassword"
            type={showPasswords ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="At least 8 characters"
            className="w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 pr-11 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/10"
          />

          <button
            type="button"
            aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
            onClick={() => setShowPasswords((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-stone-500 transition hover:text-stone-700"
          >
            {showPasswords ? (
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
          type={showPasswords ? "text" : "password"}
          autoComplete="new-password"
          required
          className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/10"
        />
      </div>

      {isResultVisible && state.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      {isResultVisible && state.success && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          Your password has been updated.
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-green-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
