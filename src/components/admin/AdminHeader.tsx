import { auth } from "@/auth";
import AdminProfileMenu from "./AdminProfileMenu";
import NotificationBell from "./NotificationBell";

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
          <NotificationBell />

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