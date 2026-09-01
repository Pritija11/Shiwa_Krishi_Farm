import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const name = session.user.name || "Admin";
  const phone = session.user.phone || "Not provided";
  const role = session.user.role || "ADMIN";

  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Page Header */}
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-900/50">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-green-950">
            Profile
          </h1>

          <p className="mt-2 text-sm text-green-950/50">
            View your administrator account information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-green-900/10 bg-white">
          {/* Profile Header */}
          <div className="border-b border-green-900/10 bg-green-950 px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-lg font-semibold text-green-950">
                {initials || "A"}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">
                  {name}
                </h2>

                <p className="mt-1 text-sm text-white/60">
                  Administrator
                </p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="divide-y divide-green-900/10">
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-green-950/40">
                  Name
                </p>

                <p className="mt-1 text-sm font-medium text-green-950">
                  {name}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-green-950/40">
                  Phone
                </p>

                <p className="mt-1 text-sm font-medium text-green-950">
                  {phone}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-green-950/40">
                  Role
                </p>

                <p className="mt-1 text-sm font-medium text-green-950">
                  {role === "ADMIN" ? "Administrator" : role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}