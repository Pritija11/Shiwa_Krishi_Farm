import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage() {
  const session = await auth();

  if (session?.user?.role === "ADMIN") {
    redirect("/admin");
  }

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

          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
