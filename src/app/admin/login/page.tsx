"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginAdmin } from "./action";

const initialState = {
  success: false,
  error: "",
};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(
    loginAdmin,
    initialState
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F5ED] px-6">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
              Shiwa Krishi Farm
            </p>

            <h1 className="mt-3 font-[family-name:var(--font-dm-serif)] text-4xl text-green-950">
              Admin Login
            </h1>

            <p className="mt-3 text-sm leading-6 text-stone-600">
              Sign in to manage your farm website.
            </p>
          </div>

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

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-green-950"
              >
                Password
              </label>

              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
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
            </div>

            {state.error && (
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
              {pending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}