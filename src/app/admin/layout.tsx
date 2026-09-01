
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F5ED]">
      <AdminSidebar />

      <main className="lg:pl-64">
        {children}
      </main>
    </div>
  );
}

