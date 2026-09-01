import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  MapPin,
  MessageSquare,
  Milk,
  Phone,
  User,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

type SubscriptionDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SubscriptionDetailsPage({
  params,
}: SubscriptionDetailsPageProps) {
  const { id } = await params;

  const subscription = await prisma.milkSubscription.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      customerName: true,
      phone: true,
      email: true,
      deliveryAddress: true,
      quantity: true,
      unit: true,
      frequency: true,
      startDate: true,
      message: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!subscription) {
    notFound();
  }

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      {/* Back */}
      <Link
        href="/admin/subscriptions"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-green-900"
      >
        <ArrowLeft size={16} />
        Back to subscriptions
      </Link>

      {/* Header */}
      <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
            Subscription Details
          </p>

          <h1 className="mt-2 font-[family-name:var(--font-dm-serif)] text-4xl text-green-950 sm:text-5xl">
            {subscription.customerName}
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            Milk subscription request
          </p>
        </div>

        <StatusBadge status={subscription.status} />
      </div>

      {/* Main Grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Customer */}
        <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <SectionHeader
            icon={<User size={18} />}
            title="Customer"
          />

          <div className="space-y-5 p-6">
            <DetailItem
              label="Name"
              value={subscription.customerName}
            />

            <div>
              <p className="text-xs uppercase tracking-wide text-stone-400">
                Phone
              </p>

              <a
                href={`tel:${subscription.phone}`}
                className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-green-800 transition hover:text-green-950"
              >
                <Phone size={15} />
                {subscription.phone}
              </a>
            </div>

            {subscription.email && (
              <div>
                <p className="text-xs uppercase tracking-wide text-stone-400">
                  Email
                </p>

                <a
                  href={`mailto:${subscription.email}`}
                  className="mt-1 inline-flex items-center gap-2 break-all text-sm text-green-800 transition hover:text-green-950"
                >
                  <Mail size={15} />
                  {subscription.email}
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Subscription */}
        <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <SectionHeader
            icon={<Milk size={18} />}
            title="Subscription"
          />

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <DetailItem
              label="Quantity"
              value={`${subscription.quantity.toString()} ${formatUnit(
                subscription.unit
              )}`}
            />

            <DetailItem
              label="Frequency"
              value={formatFrequency(subscription.frequency)}
            />

            <DetailItem
              label="Start Date"
              value={formatDate(subscription.startDate)}
            />

            <DetailItem
              label="Status"
              value={formatStatus(subscription.status)}
            />
          </div>
        </section>

        {/* Delivery */}
        <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <SectionHeader
            icon={<MapPin size={18} />}
            title="Delivery"
          />

          <div className="p-6">
            <p className="text-xs uppercase tracking-wide text-stone-400">
              Delivery Address
            </p>

            <p className="mt-2 text-sm leading-6 text-stone-700">
              {subscription.deliveryAddress}
            </p>
          </div>
        </section>

        {/* Customer Message */}
        <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <SectionHeader
            icon={<MessageSquare size={18} />}
            title="Customer Message"
          />

          <div className="p-6">
            {subscription.message ? (
              <p className="text-sm leading-6 text-stone-700">
                {subscription.message}
              </p>
            ) : (
              <p className="text-sm text-stone-400">
                No message provided.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Metadata */}
      <section className="mt-6 rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <CalendarDays
              size={17}
              className="mt-0.5 text-stone-400"
            />

            <div>
              <p className="text-xs uppercase tracking-wide text-stone-400">
                Submitted
              </p>

              <p className="mt-1 text-sm text-stone-600">
                {formatDateTime(subscription.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays
              size={17}
              className="mt-0.5 text-stone-400"
            />

            <div>
              <p className="text-xs uppercase tracking-wide text-stone-400">
                Last Updated
              </p>

              <p className="mt-1 text-sm text-stone-600">
                {formatDateTime(subscription.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-stone-100 px-6 py-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#DDE8D8] text-green-800">
        {icon}
      </div>

      <h2 className="font-[family-name:var(--font-dm-serif)] text-xl text-green-950">
        {title}
      </h2>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-stone-400">
        {label}
      </p>

      <p className="mt-1 text-sm text-stone-700">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status:
    | "PENDING"
    | "ACTIVE"
    | "PAUSED"
    | "CANCELLED";
}) {
  const styles = {
    PENDING: "bg-amber-50 text-amber-700",
    ACTIVE: "bg-green-50 text-green-700",
    PAUSED: "bg-blue-50 text-blue-700",
    CANCELLED: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-medium ${styles[status]}`}
    >
      {formatStatus(status)}
    </span>
  );
}

function formatStatus(
  status:
    | "PENDING"
    | "ACTIVE"
    | "PAUSED"
    | "CANCELLED"
) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function formatFrequency(
  frequency: "DAILY" | "WEEKLY"
) {
  return frequency === "DAILY" ? "Daily" : "Weekly";
}

function formatUnit(unit: string) {
  switch (unit) {
    case "LITRE":
      return "L";

    case "KG":
      return "kg";

    case "DOZEN":
      return "dozen";

    case "PIECE":
      return "piece";

    default:
      return unit;
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-NP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(date: Date) {
  return new Date(date).toLocaleString("en-NP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}