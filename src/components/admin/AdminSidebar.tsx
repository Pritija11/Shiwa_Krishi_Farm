"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Milk,
  Images,
  Mail,
  Settings,
  ExternalLink,
  FolderOpen,
  LogOut,
} from "lucide-react";

import { logoutAdmin } from "@/app/admin/logout/action";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Enquiries",
    href: "/admin/enquiries",
    icon: MessageSquare,
  },
  {
    name: "Milk Subscriptions",
    href: "/admin/subscriptions",
    icon: Milk,
  },
  {
    name: "Contact Messages",
    href: "/admin/messages",
    icon: Mail,
  },
  {
    name: "Gallery",
    href: "/admin/gallery",
    icon: Images,
  },
  {
    name: "Site Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-green-900/10 bg-green-950 lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-b border-white/10 px-7 py-7">
          <Link href="/admin">
            <p className="font-[family-name:var(--font-dm-serif)] text-2xl text-white">
              Shiwa Krishi
            </p>

            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#DDE8D8]">
              Admin Panel
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="px-3 pb-3 text-[10px] font-medium uppercase tracking-[0.25em] text-white/40">
            Management
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-green-950"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-white/10 p-4">
          {/* View Website */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <ExternalLink size={17} strokeWidth={1.8} />
            <span>View Website</span>
          </Link>

          {/* Logout */}
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/60 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={17} strokeWidth={1.8} />
              <span>Logout</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-7 py-5">
          <p className="text-xs leading-5 text-white/40">
            Shiwa Krishi Farm
            <br />
            Management System
          </p>
        </div>
      </div>
    </aside>
  );
}