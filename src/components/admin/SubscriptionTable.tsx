"use client";

import Link from "next/link";
import { Eye, Milk, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import SubscriptionStatusControl from "./SubscriptionStatusControl";

type Subscription = {
  id: string;
  customerName: string;
  phone: string;
  quantity: string;
  unit: string;
  frequency: "DAILY" | "WEEKLY";
  startDate: Date;
  status: "PENDING" | "ACTIVE" | "PAUSED" | "CANCELLED";
};

type SubscriptionTableProps = {
  subscriptions: Subscription[];
};

export default function SubscriptionTable({
  subscriptions,
}: SubscriptionTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const status = searchParams.get("status") || "ALL";
  const frequency = searchParams.get("frequency") || "ALL";

  function updateFilters(
    newSearch: string,
    newStatus: string,
    newFrequency: string
  ) {
    const params = new URLSearchParams();

    if (newSearch.trim()) {
      params.set("search", newSearch.trim());
    }

    if (newStatus !== "ALL") {
      params.set("status", newStatus);
    }

    if (newFrequency !== "ALL") {
      params.set("frequency", newFrequency);
    }

    params.set("page", "1");

    router.push(
      `/admin/subscriptions?${params.toString()}`
    );
  }

  function handleSearchSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    updateFilters(search, status, frequency);
  }

  function handleStatusChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    updateFilters(
      search,
      event.target.value,
      frequency
    );
  }

  function handleFrequencyChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    updateFilters(
      search,
      status,
      event.target.value
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="border-b border-stone-100 p-5">
        <form
          onSubmit={handleSearchSubmit}
          className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]"
        >
          {/* Search */}
          <div className="relative">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search customer, phone or email..."
              className="w-full rounded-xl border border-stone-200 bg-[#F8F5ED] py-3 pl-11 pr-4 text-sm text-green-950 outline-none transition placeholder:text-stone-400 focus:border-green-700"
            />
          </div>

          {/* Status Filter */}
          <select
            value={status}
            onChange={handleStatusChange}
            className="rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm text-green-950 outline-none focus:border-green-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Frequency Filter */}
          <select
            value={frequency}
            onChange={handleFrequencyChange}
            className="rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm text-green-950 outline-none focus:border-green-700"
          >
            <option value="ALL">All Frequencies</option>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
          </select>

          {/* Search Button */}
          <button
            type="submit"
            className="rounded-xl bg-green-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-900"
          >
            Search
          </button>
        </form>
      </div>

      {/* Result Count */}
      <div className="border-b border-stone-100 px-5 py-4">
        <p className="text-xs text-stone-500">
          Showing{" "}
          <span className="font-medium text-green-900">
            {subscriptions.length}
          </span>{" "}
          subscriptions on this page
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 text-left">
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-stone-400">
                Customer
              </th>

              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-stone-400">
                Quantity
              </th>

              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-stone-400">
                Frequency
              </th>

              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-stone-400">
                Start Date
              </th>

              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-stone-400">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-wider text-stone-400">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {subscriptions.map((subscription) => (
              <tr
                key={subscription.id}
                className="border-b border-stone-100 last:border-0 transition hover:bg-stone-50/70"
              >
                {/* Customer */}
                <td className="px-5 py-5">
                  <div>
                    <p className="text-sm font-medium text-green-950">
                      {subscription.customerName}
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      {subscription.phone}
                    </p>
                  </div>
                </td>

                {/* Quantity */}
                <td className="px-5 py-5 text-sm text-stone-600">
                  {subscription.quantity}{" "}
                  {formatUnit(subscription.unit)}
                </td>

                {/* Frequency */}
                <td className="px-5 py-5">
                  <span className="text-sm text-stone-600">
                    {formatFrequency(subscription.frequency)}
                  </span>
                </td>

                {/* Start Date */}
                <td className="px-5 py-5 text-sm text-stone-600">
                  {formatDate(subscription.startDate)}
                </td>

                {/* Status */}
                <td className="px-5 py-5">
                  <SubscriptionStatusControl
                    subscriptionId={subscription.id}
                    currentStatus={subscription.status}
                  />
                </td>

                {/* Action */}
                <td className="px-5 py-5 text-right">
                  <Link
                    href={`/admin/subscriptions/${subscription.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-green-800 transition hover:bg-green-50 hover:text-green-950"
                  >
                    <Eye
                      size={16}
                      strokeWidth={1.8}
                    />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="divide-y divide-stone-100 md:hidden">
        {subscriptions.map((subscription) => (
          <div
            key={subscription.id}
            className="p-5"
          >
            <div className="flex items-start gap-4">
              <div className="flex min-w-0 flex-1 gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DDE8D8] text-green-800">
                  <Milk
                    size={19}
                    strokeWidth={1.7}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-green-950">
                    {subscription.customerName}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    {subscription.phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-stone-400">
                  Quantity
                </p>

                <p className="mt-1 text-sm text-stone-600">
                  {subscription.quantity}{" "}
                  {formatUnit(subscription.unit)}
                </p>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wide text-stone-400">
                  Frequency
                </p>

                <p className="mt-1 text-sm text-stone-600">
                  {formatFrequency(subscription.frequency)}
                </p>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wide text-stone-400">
                  Start Date
                </p>

                <p className="mt-1 text-sm text-stone-600">
                  {formatDate(subscription.startDate)}
                </p>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wide text-stone-400">
                  Status
                </p>

                <div className="mt-1">
                  <SubscriptionStatusControl
                    subscriptionId={subscription.id}
                    currentStatus={subscription.status}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Link
                href={`/admin/subscriptions/${subscription.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-green-800 transition hover:bg-green-50"
              >
                <Eye size={16} />
                View details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {subscriptions.length === 0 && (
        <div className="px-6 py-14 text-center">
          <Search
            className="mx-auto text-stone-400"
            size={28}
            strokeWidth={1.5}
          />

          <p className="mt-3 text-sm font-medium text-green-950">
            No subscriptions found
          </p>

          <p className="mt-1 text-xs text-stone-500">
            Try changing your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}

function formatFrequency(
  frequency: "DAILY" | "WEEKLY"
) {
  return frequency === "DAILY"
    ? "Daily"
    : "Weekly";
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