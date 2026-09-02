import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Truck,
} from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

export default async function ContactPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: {
      id: "site-settings",
    },
  });

  if (!settings) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F5ED] px-6">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-dm-serif)] text-4xl text-green-950">
            Contact information unavailable
          </h1>

          <p className="mt-3 text-sm text-stone-600">
            Please check back later.
          </p>
        </div>
      </main>
    );
  }

  const whatsappNumber = settings.whatsapp.replace(/\D/g, "");

  return (
    <main className="bg-[#F8F5ED]">
      {/* Hero */}
      <section className="px-6 pb-20 pt-36 md:pb-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-green-800">
            Get in Touch
          </p>

          <h1 className="mt-4 font-[family-name:var(--font-dm-serif)] text-5xl leading-tight text-green-950 sm:text-6xl md:text-7xl">
            We&apos;d love to
            <span className="block text-green-800">hear from you.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
            Have a question about our products, delivery, or milk
            subscription? Get in touch with Shiwa Krishi Farm.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-white px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Information */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
              Contact Information
            </p>

            <h2 className="mt-3 font-[family-name:var(--font-dm-serif)] text-4xl text-green-950 sm:text-5xl">
              Let&apos;s connect
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-stone-600">
              Reach us directly for product availability, orders, delivery
              information, or any questions about the farm.
            </p>

            <div className="mt-10 space-y-7">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F6EF] text-green-800">
                  <Phone size={18} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                    Phone
                  </p>

                  <a
                    href={`tel:${settings.phone}`}
                    className="mt-1 block text-base font-medium text-green-900 hover:underline"
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F6EF] text-green-800">
                  <MessageCircle size={18} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                    WhatsApp
                  </p>

                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-base font-medium text-green-900 hover:underline"
                  >
                    Chat with us on WhatsApp
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F6EF] text-green-800">
                  <Mail size={18} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                    Email
                  </p>

                  <a
                    href={`mailto:${settings.email}`}
                    className="mt-1 block text-base font-medium text-green-900 hover:underline"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F6EF] text-green-800">
                  <MapPin size={18} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                    Farm Location
                  </p>

                  <p className="mt-1 text-base font-medium text-green-900">
                    {settings.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="min-h-105 overflow-hidden rounded-4xl bg-[#E7E3D8]">
            {settings.locationUrl ? (
              <iframe
                src={settings.locationUrl}
                title="Shiwa Krishi Farm location"
                className="h-full min-h-105 w-full border-0"
                loading="lazy"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full min-h-105 items-center justify-center px-8 text-center">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-900 text-white">
                    <MapPin size={24} strokeWidth={1.8} />
                  </div>

                  <h3 className="mt-5 font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
                    Find our farm
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-600">
                    Our farm location will be added here once the location is
                    available.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Google Maps Button */}
        {settings.googleMapsUrl && (
          <div className="mx-auto mt-6 max-w-7xl text-right">
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-green-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-800"
            >
              Open in Google Maps
            </a>
          </div>
        )}
      </section>

      {/* Working Hours & Delivery */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          {/* Working Hours */}
          <div className="rounded-4xl border border-stone-200 bg-white p-8 sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F6EF] text-green-800">
                <Clock size={18} strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
                  Visit / Contact
                </p>

                <h2 className="mt-2 font-[family-name:var(--font-dm-serif)] text-3xl text-green-950">
                  Working Hours
                </h2>
              </div>
            </div>

            <div className="mt-7 rounded-2xl bg-[#F3F6EF] p-5">
              <p className="whitespace-pre-line text-sm leading-7 text-stone-600">
                {settings.workingHours || "Contact us for working hours."}
              </p>
            </div>
          </div>

          {/* Delivery */}
          <div className="rounded-4xl border border-stone-200 bg-white p-8 sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F6EF] text-green-800">
                <Truck size={18} strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
                  Local Delivery
                </p>

                <h2 className="mt-2 font-[family-name:var(--font-dm-serif)] text-3xl text-green-950">
                  Delivery Information
                </h2>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-stone-600">
              We provide local delivery for selected areas. Delivery areas and
              days will be confirmed when your order or subscription is placed.
            </p>

            <div className="mt-7 space-y-4">
              <div className="rounded-2xl bg-[#F3F6EF] p-5">
                <p className="text-sm font-medium text-green-900">
                  Delivery areas
                </p>

                <p className="mt-1 whitespace-pre-line text-sm leading-6 text-stone-600">
                  {settings.deliveryAreas ||
                    "Local delivery areas will be added here."}
                </p>
              </div>

              {settings.deliveryDays && (
                <div className="rounded-2xl bg-[#F3F6EF] p-5">
                  <p className="text-sm font-medium text-green-900">
                    Delivery days
                  </p>

                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-stone-600">
                    {settings.deliveryDays}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
              Send a Message
            </p>

            <h2 className="mt-3 font-[family-name:var(--font-dm-serif)] text-4xl text-green-950 sm:text-5xl">
              Have a question?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-600">
              Send us a message and we&apos;ll get back to you as soon as
              possible.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* Social Links */}
      <section className="bg-green-950 px-6 py-20 text-center md:py-24">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#DDE8D8]">
            Follow the farm
          </p>

          <h2 className="mt-4 font-[family-name:var(--font-dm-serif)] text-4xl text-white sm:text-5xl">
            Stay connected
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/70">
            Follow us for farm updates, seasonal produce, and a look at
            everyday life at Shiwa Krishi Farm.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {settings.facebookUrl && (
              <Link
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-green-950"
              >
                Facebook
              </Link>
            )}

            {settings.instagramUrl && (
              <Link
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-green-950"
              >
                Instagram
              </Link>
            )}

            {settings.tiktokUrl && (
              <Link
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-green-950"
              >
                TikTok
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}