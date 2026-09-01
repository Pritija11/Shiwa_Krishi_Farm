
import Link from "next/link";
import { MessageSquare, Search } from "lucide-react";

import { prisma } from "@/lib/prisma";
import EnquiryTable from "@/components/admin/EnquiryTable";
import Pagination from "@/components/admin/Pagination";

type EnquiriesPageProps = {
  searchParams: Promise<{
    page?: string;
    status?: string;
    search?: string;
  }>;
};

const PAGE_SIZE = 10;

const validStatuses = [
  "NEW",
  "CONTACTED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
] as const;

type EnquiryStatus = (typeof validStatuses)[number];

export default async function EnquiriesPage({
  searchParams,
}: EnquiriesPageProps) {
  const params = await searchParams;

  const currentPage = Math.max(
    1,
    Number.parseInt(params.page || "1", 10) || 1
  );

  const search = params.search?.trim() || "";

  const statusParam = params.status;

  const status: EnquiryStatus | "ALL" =
    statusParam &&
    validStatuses.includes(statusParam as EnquiryStatus)
      ? (statusParam as EnquiryStatus)
      : "ALL";

  const where = {
    ...(status !== "ALL" && {
      status,
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
      ],
    }),
  };

  const [totalEnquiries, enquiries] = await Promise.all([
    prisma.enquiry.count({
      where,
    }),

    prisma.enquiry.findMany({
      where,
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        product: true,
      },
    }),
  ]);

  const totalPages = Math.ceil(totalEnquiries / PAGE_SIZE);

  // Handle invalid page number
  if (totalPages > 0 && currentPage > totalPages) {
    return (
      <div className="px-6 py-8 lg:px-10 lg:py-10">
        <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
          <p className="text-sm text-stone-600">
            This page does not exist.
          </p>

          <Link
            href="/admin/enquiries"
            className="mt-4 inline-flex rounded-lg bg-green-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-900"
          >
            Back to enquiries
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
          Customer Activity
        </p>

        <h1 className="mt-2 font-[family-name:var(--font-dm-serif)] text-4xl text-green-950 sm:text-5xl">
          Enquiries
        </h1>

        <p className="mt-3 text-sm text-stone-600">
          View and manage customer enquiries received through the farm
          website.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <form
          action="/admin/enquiries"
          method="GET"
          className="flex flex-col gap-3 md:flex-row"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              strokeWidth={1.8}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by customer name or phone..."
              className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-4 text-sm text-green-950 outline-none transition placeholder:text-stone-400 focus:border-green-800 focus:bg-white"
            />
          </div>

          {/* Status */}
          <select
            name="status"
            defaultValue={status}
            className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-green-950 outline-none transition focus:border-green-800 focus:bg-white"
          >
            <option value="ALL">All statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Search Button */}
          <button
            type="submit"
            className="rounded-xl bg-green-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-900"
          >
            Search
          </button>

          {/* Clear */}
          {(search || status !== "ALL") && (
            <Link
              href="/admin/enquiries"
              className="flex items-center justify-center rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
            >
              Clear
            </Link>
          )}
        </form>
      </div>

      {/* Results */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-800">
              Enquiries
            </p>

            <h2 className="mt-1 font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
              Customer requests
            </h2>
          </div>

          <p className="hidden text-sm text-stone-500 sm:block">
            {totalEnquiries}{" "}
            {totalEnquiries === 1 ? "enquiry" : "enquiries"}
          </p>
        </div>

        {/* Empty State */}
        {enquiries.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <MessageSquare
              className="mx-auto text-green-800"
              size={30}
              strokeWidth={1.7}
            />

            <p className="mt-4 text-sm font-medium text-green-950">
              No enquiries found
            </p>

            <p className="mt-1 text-xs text-stone-500">
              {search || status !== "ALL"
                ? "Try changing your search or status filter."
                : "New customer enquiries will appear here."}
            </p>

            {(search || status !== "ALL") && (
              <Link
                href="/admin/enquiries"
                className="mt-5 inline-flex rounded-lg bg-green-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-900"
              >
                Clear filters
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Table */}
            <EnquiryTable enquiries={enquiries} />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </>
        )}
      </section>
    </div>
  );
}

