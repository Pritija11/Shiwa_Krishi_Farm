
import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Our Products", href: "/products" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

const productLinks = [
  { name: "Poultry & Eggs", href: "/products/poultry" },
  { name: "Goats", href: "/products/goats" },
  { name: "Fresh Milk", href: "/products/milk" },
  { name: "Organic Vegetables", href: "/products/vegetables" },
];

export default async function Footer() {
  const settings = await prisma.siteSettings.findUnique({
    where: {
      id: "site-settings",
    },
  });

  return (
    <footer className="bg-[#173A2A] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.svg"
                alt="Shiwa Krishi Farm"
                width={180}
                height={60}
                className="h-auto w-[160px] object-contain"
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-green-50/65">
              Fresh, local farm products grown and raised with care, bringing
              the goodness of our farm closer to your table.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-green-200">
              Explore
            </h3>

            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-green-50/65 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-green-200">
              Products
            </h3>

            <ul className="mt-5 space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-green-50/65 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-green-200">
              Get In Touch
            </h3>

            <div className="mt-5 space-y-4 text-sm text-green-50/65">
              <p>
                <span className="block text-xs uppercase tracking-wider text-green-200/70">
                  Phone
                </span>
                {settings?.phone || "Not available"}
              </p>

              <p>
                <span className="block text-xs uppercase tracking-wider text-green-200/70">
                  WhatsApp
                </span>
                {settings?.whatsapp || "Not available"}
              </p>

              <p>
                <span className="block text-xs uppercase tracking-wider text-green-200/70">
                  Email
                </span>
                {settings?.email || "Not available"}
              </p>

              <p>
                <span className="block text-xs uppercase tracking-wider text-green-200/70">
                  Location
                </span>
                {settings?.address || "Not available"}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-white/10" />

        {/* Bottom Footer */}
        <div className="flex flex-col gap-4 text-xs text-green-50/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Shiwa Krishi Farm. All rights
            reserved.
          </p>

          <div className="flex gap-5">
            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-white"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
