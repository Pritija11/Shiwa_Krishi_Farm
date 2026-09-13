"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Milk Subscription", href: "/milk-subscription" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

function isLinkActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed left-0 top-5 z-50 w-full px-4">
      <nav className="mx-auto max-w-6xl rounded-full bg-white/95 shadow-lg backdrop-blur-sm">
        {/* Main Navbar */}
        <div className="flex h-16 items-center justify-between px-5 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5"
          >
            <Image
              src="/images/logo.svg"
              alt="Shiwa Krishi Farm logo"
              width={190}
              height={90}
              priority
              className="h-9 w-auto object-contain"
            />

            <span className="font-[family-name:var(--font-dm-serif)] text-lg font-semibold text-green-800">
              Shiwa Krishi Farm
            </span>
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => {
              const active = isLinkActive(pathname, link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-sm transition-colors ${
                    active
                      ? "font-semibold text-green-800"
                      : "text-gray-700 hover:text-green-700"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Order Button */}
          <Link
            href="/order"
            className="hidden rounded-full bg-green-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800 md:block"
          >
            Order Now
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded-full p-2 text-green-800 transition-colors hover:bg-green-50 md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="border-t border-gray-100 px-5 pb-5 pt-3 md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = isLinkActive(pathname, link.href);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-xl px-4 py-3 text-sm transition-colors ${
                      active
                        ? "bg-green-50 font-medium text-green-700"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <Link
                href="/order"
                onClick={() => setIsOpen(false)}
                className="mt-2 rounded-full bg-green-700 px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-green-800"
              >
                Order Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
