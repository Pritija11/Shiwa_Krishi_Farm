import { auth } from "@/auth";
import { Bell } from "lucide-react";
import AdminProfileMenu from "./AdminProfileMenu";

export default async function AdminHeader() {
  const session = await auth();

  const name = session?.user?.name || "Admin";
  const phone = session?.user?.phone || "";
  const role = session?.user?.role || "ADMIN";

  return (
    <header className="sticky top-0 z-30 border-b border-green-900/10 bg-[#F8F5ED]/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-6 lg:px-8">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-green-900/50">
            Welcome
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-dm-serif)] text-2xl text-green-950 sm:text-3xl">
            {name}
          </h1>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl text-green-950/70 transition hover:bg-green-950/5 hover:text-green-950"
          >
            <Bell size={20} strokeWidth={1.8} />

            {/* Notification indicator */}
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Profile */}
          <AdminProfileMenu
            name={name}
            phone={phone}
            role={role}
          />
        </div>
      </div>
    </header>
  );
}