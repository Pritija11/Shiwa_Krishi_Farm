import {
  Package,
  MessageSquare,
  Milk,
  Mail,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import RecentEnquiries from "@/components/admin/RecentEnquiries";

export default async function AdminDashboard() {
  const [
    totalProducts,
    newEnquiries,
    activeSubscriptions,
    newContactMessages,
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

    prisma.contactMessage.count({
      where: {
        status: "NEW",
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
    {
      title: "New Messages",
      value: newContactMessages,
      description: "Unread contact messages",
      icon: Mail,
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
          Manage your farm products, enquiries, subscriptions, and
          messages.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
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

      <RecentEnquiries enquiries={recentEnquiries} />
    </div>
  );
}