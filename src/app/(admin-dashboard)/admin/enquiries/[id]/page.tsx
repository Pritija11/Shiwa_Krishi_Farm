import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  User,
} from "lucide-react";

import EnquiryStatusSelect from "@/components/admin/EnquiryStatusSelect";
import { prisma } from "@/lib/prisma";

type EnquiryDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EnquiryDetailsPage({
  params,
}: EnquiryDetailsPageProps) {
  const { id } = await params;

  const enquiry = await prisma.enquiry.findUnique({
    where: {
      id,
    },
    include: {
      product: true,
    },
  });

  if (!enquiry) {
    notFound();
  }

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      {/* Back */}
      <Link
        href="/admin/enquiries"
        className="inline-flex items-center gap-2 text-sm font-medium text-green-800 transition hover:text-green-950"
      >
        <ArrowLeft size={17} />
        Back to enquiries
      </Link>

      {/* Header */}
      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
          Customer Enquiry
        </p>

        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-dm-serif)] text-4xl text-green-950 sm:text-5xl">
              {enquiry.customerName}
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Submitted on{" "}
              {enquiry.createdAt.toLocaleDateString()}
            </p>
          </div>

          {/* Status */}
          <EnquiryStatusSelect
            enquiryId={enquiry.id}
            currentStatus={enquiry.status}
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Customer Information */}
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDE8D8] text-green-800">
              <User size={19} strokeWidth={1.8} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-800">
                Customer
              </p>

              <h2 className="mt-1 font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
                Customer information
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {/* Name */}
            <div>
              <p className="text-xs text-stone-400">Full name</p>

              <p className="mt-1 text-sm font-medium text-green-950">
                {enquiry.customerName}
              </p>
            </div>

            {/* Phone */}
            <div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-stone-400" />

                <p className="text-xs text-stone-400">
                  Phone
                </p>
              </div>

              <p className="mt-1 text-sm font-medium text-green-950">
                {enquiry.phone}
              </p>
            </div>

            {/* Email */}
            <div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-stone-400" />

                <p className="text-xs text-stone-400">
                  Email
                </p>
              </div>

              <p className="mt-1 text-sm font-medium text-green-950">
                {enquiry.email || "Not provided"}
              </p>
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-stone-400" />

                <p className="text-xs text-stone-400">
                  Delivery address
                </p>
              </div>

              <p className="mt-1 text-sm font-medium text-green-950">
                {enquiry.deliveryAddress || "Not provided"}
              </p>
            </div>
          </div>
        </section>

        {/* Request Summary */}
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDE8D8] text-green-800">
            <Package size={19} strokeWidth={1.8} />
          </div>

          <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-green-800">
            Request
          </p>

          <h2 className="mt-1 font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
            Order details
          </h2>

          <div className="mt-6 space-y-5">
            {/* Product */}
            <div>
              <p className="text-xs text-stone-400">
                Product
              </p>

              <p className="mt-1 text-sm font-medium text-green-950">
                {enquiry.product.name}
              </p>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-xs text-stone-400">
                Quantity
              </p>

              <p className="mt-1 text-sm font-medium text-green-950">
                {enquiry.quantity.toString()}
              </p>
            </div>

            {/* Preferred Date */}
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays
                  size={14}
                  className="text-stone-400"
                />

                <p className="text-xs text-stone-400">
                  Preferred date
                </p>
              </div>

              <p className="mt-1 text-sm font-medium text-green-950">
                {enquiry.preferredDate
                  ? enquiry.preferredDate.toLocaleDateString()
                  : "Not specified"}
              </p>
            </div>

            {/* Created */}
            <div>
              <p className="text-xs text-stone-400">
                Submitted
              </p>

              <p className="mt-1 text-sm font-medium text-green-950">
                {enquiry.createdAt.toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        {/* Customer Message */}
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDE8D8] text-green-800">
              <MessageSquare size={19} strokeWidth={1.8} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-800">
                Message
              </p>

              <h2 className="mt-1 font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
                Customer message
              </h2>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-stone-50 p-5">
            {enquiry.message ? (
              <p className="whitespace-pre-wrap text-sm leading-7 text-stone-700">
                {enquiry.message}
              </p>
            ) : (
              <p className="text-sm italic text-stone-400">
                No message was provided.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}