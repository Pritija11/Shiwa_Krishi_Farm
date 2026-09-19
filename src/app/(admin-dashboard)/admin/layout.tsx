import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#F8F5ED]">
      <AdminSidebar />

      <main className="lg:pl-64">
        <AdminHeader />

        <div>{children}</div>
      </main>
    </div>
  );
}