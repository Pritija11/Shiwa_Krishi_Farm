import Link from "next/link";
import {
  Package,
  MessageSquare,
  Milk,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [
    totalProducts,
    newEnquiries,
    activeSubscriptions,
    recentEnquiries,
  ] = await Promise.all([
    prisma.product.count({
      where: {
        isActive: true,
      },
    }),

    prisma.enquiry.count({
      where: {
        status: "NEW",
      },
    }),

    prisma.milkSubscription.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.enquiry.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        product: true,
      },
    }),
  ]);

  const stats = [
    {
      title: "Active Products",
      value: totalProducts,
      description: "Currently available products",
      icon: Package,
    },
    {
      title: "New Enquiries",
      value: newEnquiries,
      description: "Waiting for response",
      icon: MessageSquare,
    },
    {
      title: "Milk Subscriptions",
      value: activeSubscriptions,
      description: "Active subscriptions",
      icon: Milk,
    },
  ];

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
          Overview
        </p>

        <h1 className="mt-2 font-[family-name:var(--font-dm-serif)] text-4xl text-green-950 sm:text-5xl">
          Dashboard
        </h1>

        <p className="mt-3 text-sm text-stone-600">
          Manage your farm products, enquiries, and milk subscriptions.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-stone-500">
                    {stat.title}
                  </p>

                  <p className="mt-3 text-3xl font-semibold text-green-950">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DDE8D8] text-green-800">
                  <Icon size={20} strokeWidth={1.8} />
                </div>
              </div>

              <p className="mt-4 text-xs text-stone-500">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Enquiries */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-800">
              Customer Activity
            </p>

            <h2 className="mt-1 font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
              Recent enquiries
            </h2>
          </div>

          <Link
            href="/admin/enquiries"
            className="hidden items-center gap-2 text-sm font-medium text-green-800 transition hover:text-green-950 sm:flex"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <MessageSquare
              className="mx-auto text-green-800"
              size={26}
              strokeWidth={1.7}
            />

            <p className="mt-3 text-sm font-medium text-green-950">
              No enquiries yet
            </p>

            <p className="mt-1 text-xs text-stone-500">
              New customer enquiries will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentEnquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-green-950">
                    {enquiry.customerName}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    {enquiry.product.name}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    {enquiry.status}
                  </span>

                  <span className="text-xs text-stone-400">
                    {enquiry.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-stone-100 px-6 py-4 sm:hidden">
          <Link
            href="/admin/enquiries"
            className="flex items-center justify-center gap-2 text-sm font-medium text-green-800"
          >
            View all enquiries
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}