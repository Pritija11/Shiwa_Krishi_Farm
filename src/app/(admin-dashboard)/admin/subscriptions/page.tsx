import Link from "next/link";
import { Milk } from "lucide-react";

import { prisma } from "@/lib/prisma";
import SubscriptionTable from "@/components/admin/SubscriptionTable";
import Pagination from "@/components/admin/Pagination";

type SubscriptionsPageProps = {
  searchParams: Promise<{
    page?: string;
    status?: string;
    frequency?: string;
    search?: string;
  }>;
};

const PAGE_SIZE = 10;

const validStatuses = [
  "PENDING",
  "ACTIVE",
  "PAUSED",
  "CANCELLED",
] as const;

const validFrequencies = ["DAILY", "WEEKLY"] as const;

export default async function SubscriptionsPage({
  searchParams,
}: SubscriptionsPageProps) {
  const params = await searchParams;

  const currentPage = Math.max(
    1,
    Number.parseInt(params.page || "1", 10) || 1
  );

  const search = params.search?.trim() || "";

  const status =
    params.status &&
    validStatuses.includes(
      params.status as (typeof validStatuses)[number]
    )
      ? params.status
      : "ALL";

  const frequency =
    params.frequency &&
    validFrequencies.includes(
      params.frequency as (typeof validFrequencies)[number]
    )
      ? params.frequency
      : "ALL";

  const where = {
    ...(status !== "ALL" && {
      status: status as
        | "PENDING"
        | "ACTIVE"
        | "PAUSED"
        | "CANCELLED",
    }),

    ...(frequency !== "ALL" && {
      frequency: frequency as "DAILY" | "WEEKLY",
    }),

    ...(search && {
      OR: [
        {
          customerName: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          phone: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),
  };

  /*
   * Summary counts
   *
   * These are intentionally calculated independently
   * from the paginated table query.
   */
  const [
    totalSubscriptions,
    pendingSubscriptions,
    activeSubscriptions,
    pausedSubscriptions,
    cancelledSubscriptions,
    subscriptions,
  ] = await Promise.all([
    prisma.milkSubscription.count(),

    prisma.milkSubscription.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.milkSubscription.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.milkSubscription.count({
      where: {
        status: "PAUSED",
      },
    }),

    prisma.milkSubscription.count({
      where: {
        status: "CANCELLED",
      },
    }),

    prisma.milkSubscription.findMany({
      where,
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const filteredTotal = await prisma.milkSubscription.count({
    where,
  });

  const totalPages = Math.ceil(filteredTotal / PAGE_SIZE);

  const tableSubscriptions = subscriptions.map((subscription) => ({
    ...subscription,
    quantity: subscription.quantity.toString(),
  }));

  /*
   * Prevent invalid pages such as:
   * /admin/subscriptions?page=999
   */
  if (totalPages > 0 && currentPage > totalPages) {
    return (
      <div className="px-6 py-8 lg:px-10 lg:py-10">
        <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-stone-600">
            This page does not exist.
          </p>

          <Link
            href="/admin/subscriptions"
            className="mt-4 inline-flex rounded-lg bg-green-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-900"
          >
            Back to subscriptions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
          Customer Services
        </p>

        <h1 className="mt-2 font-(family-name:--font-dm-serif) text-4xl text-green-950 sm:text-5xl">
          Milk Subscriptions
        </h1>

        <p className="mt-3 text-sm text-stone-600">
          Manage recurring milk delivery subscriptions from your customers.
        </p>
      </div>

      {/* Summary */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryCard
          title="Total"
          value={totalSubscriptions}
        />

        <SummaryCard
          title="Pending"
          value={pendingSubscriptions}
        />

        <SummaryCard
          title="Active"
          value={activeSubscriptions}
        />

        <SummaryCard
          title="Paused"
          value={pausedSubscriptions}
        />

        <SummaryCard
          title="Cancelled"
          value={cancelledSubscriptions}
        />
      </div>

      {/* Subscription Table */}
      <section className="mt-8">
        {subscriptions.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center shadow-sm">
            <Milk
              className="mx-auto text-green-800"
              size={32}
              strokeWidth={1.6}
            />

            <h2 className="mt-4 font-(family-name:--font-dm-serif) text-2xl text-green-950">
              No subscriptions found
            </h2>

            <p className="mt-2 text-sm text-stone-500">
              {search || status !== "ALL" || frequency !== "ALL"
                ? "Try changing your search or filters."
                : "Milk subscription requests will appear here."}
            </p>

            {(search || status !== "ALL" || frequency !== "ALL") && (
              <Link
                href="/admin/subscriptions"
                className="mt-5 inline-flex rounded-lg bg-green-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-900"
              >
                Clear filters
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <SubscriptionTable subscriptions={tableSubscriptions} />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        )}
      </section>
    </div>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-xs text-stone-500">{title}</p>

      <p className="mt-2 text-2xl font-semibold text-green-950">
        {value}
      </p>
    </div>
  );
}