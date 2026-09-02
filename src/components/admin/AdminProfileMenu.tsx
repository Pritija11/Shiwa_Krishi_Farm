"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { logoutAdmin } from "@/app/admin/logout/action";
import Link from "next/link";

type AdminProfileMenuProps = {
  name: string;
  phone: string;
  role: string;
};

export default function AdminProfileMenu({
  name,
  phone,
  role,
}: AdminProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      {/* Profile Button */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-11 items-center gap-2 rounded-xl px-2 transition hover:bg-green-950/5"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-950 text-xs font-semibold text-white">
          {initials || "A"}
        </div>

        <ChevronDown
          size={16}
          strokeWidth={1.8}
          className={`text-green-950/50 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-green-900/10 bg-white shadow-xl"
        >
          {/* Profile Information */}
          <div className="border-b border-green-900/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-950 text-sm font-semibold text-white">
                {initials || "A"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-green-950">
                  {name}
                </p>

                <p className="text-xs text-green-950/50">
                  {role === "ADMIN" ? "Administrator" : role}
                </p>
              </div>
            </div>

            {phone && <p className="mt-3 text-xs text-green-950/50">{phone}</p>}
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <Link
              href="/admin/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-green-950/70 transition hover:bg-green-950/5 hover:text-green-950"
            >
              <User size={17} strokeWidth={1.8} />
              <span>Profile</span>
            </Link>
            <form action={logoutAdmin}>
              <button
                type="submit"
                role="menuitem"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={17} strokeWidth={1.8} />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
