import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Phone, User } from "lucide-react";

import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import ContactMessageStatusControl from "@/components/admin/ContactMessageStatusControl";

type ContactMessageDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ContactMessageDetailsPage({
  params,
}: ContactMessageDetailsPageProps) {
  const { id } = await params;

  const message = await prisma.contactMessage.findUnique({
    where: {
      id,
    },
  });

  if (!message) {
    notFound();
  }

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      {/* Header */}
      <div>
        <Link
          href="/admin/contact-messages"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-green-900"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Back to contact messages
        </Link>

        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
            Customer Message
          </p>

          <h1 className="mt-2 font-[family-name:var(--font-dm-serif)] text-4xl text-green-950 sm:text-5xl">
            {message.subject || "Contact Message"}
          </h1>

          <p className="mt-3 text-sm text-stone-600">
            Received on {formatDateTime(message.createdAt)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Message */}
        <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 px-6 py-5">
            <div className="flex items-center gap-2">
              <MessageSquare
                size={18}
                strokeWidth={1.7}
                className="text-green-800"
              />

              <h2 className="font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
                Message
              </h2>
            </div>
          </div>

          <div className="px-6 py-6">
            <p className="whitespace-pre-wrap text-sm leading-7 text-stone-700">
              {message.message}
            </p>
          </div>
        </section>

        {/* Customer + Status */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="border-b border-stone-100 px-6 py-5">
              <h2 className="font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
                Customer
              </h2>
            </div>

            <div className="space-y-5 px-6 py-6">
              <DetailItem
                icon={<User size={17} strokeWidth={1.7} />}
                label="Name"
                value={message.name}
              />

              <DetailItem
                icon={<Phone size={17} strokeWidth={1.7} />}
                label="Phone"
                value={message.phone}
              />

              <DetailItem
                icon={<Mail size={17} strokeWidth={1.7} />}
                label="Email"
                value={message.email || "Not provided"}
              />

              <DetailItem
                label="Subject"
                value={message.subject || "No subject"}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
              Status
            </h2>

            <div className="mt-5">
              <ContactMessageStatusControl
                id={message.id}
                currentStatus={message.status}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                Date received
              </p>

              <p className="mt-1 text-sm text-stone-700">
                {formatDateTime(message.createdAt)}
              </p>
            </div>

            <div className="mt-5 border-t border-stone-100 pt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                Last updated
              </p>

              <p className="mt-1 text-sm text-stone-700">
                {formatDateTime(message.updatedAt)}
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      {icon && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-800">
          {icon}
        </div>
      )}

      <div className={icon ? "" : "ml-11"}>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm text-stone-700">
          {value}
        </p>
      </div>
    </div>
  );
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}