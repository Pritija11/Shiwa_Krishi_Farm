
import Link from "next/link";
import { ArrowRight, Eye, MessageSquare } from "lucide-react";
import type { Enquiry } from "@/generated/prisma/client";

type RecentEnquiriesProps = {
  enquiries: (Enquiry & {
    product: {
      name: string;
    };
  })[];
};

function isToday(date: Date) {
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function getStatusStyle(status: Enquiry["status"]) {
  switch (status) {
    case "NEW":
      return "bg-amber-50 text-amber-700";

    case "CONTACTED":
      return "bg-blue-50 text-blue-700";

    case "CONFIRMED":
      return "bg-purple-50 text-purple-700";

    case "COMPLETED":
      return "bg-green-50 text-green-700";

    case "CANCELLED":
      return "bg-red-50 text-red-700";

    default:
      return "bg-stone-50 text-stone-600";
  }
}

export default function RecentEnquiries({
  enquiries,
}: RecentEnquiriesProps) {
  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      {/* Header */}
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

      {/* Empty State */}
      {enquiries.length === 0 ? (
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
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100 text-left">
                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-stone-400">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-stone-400">
                    Product
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-stone-400">
                    Quantity
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-stone-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-stone-400">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-stone-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {enquiries.map((enquiry) => {
                  const today = isToday(enquiry.createdAt);

                  return (
                    <tr
                      key={enquiry.id}
                      className="transition hover:bg-stone-50/70"
                    >
                      {/* Customer */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-sm font-medium text-green-950">
                            {enquiry.customerName}
                          </p>

                          {today && (
                            <span className="mt-1 inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700">
                              New
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Product */}
                      <td className="px-6 py-5">
                        <p className="text-sm text-stone-700">
                          {enquiry.product.name}
                        </p>
                      </td>

                      {/* Quantity */}
                      <td className="px-6 py-5">
                        <p className="text-sm text-stone-600">
                          {enquiry.quantity.toString()}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                            enquiry.status
                          )}`}
                        >
                          {enquiry.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5">
                        <p className="text-sm text-stone-600">
                          {enquiry.createdAt.toLocaleDateString()}
                        </p>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/admin/enquiries/${enquiry.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-green-800 transition hover:bg-green-50 hover:text-green-950"
                        >
                          <Eye size={16} strokeWidth={1.8} />
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile List */}
          <div className="divide-y divide-stone-100 md:hidden">
            {enquiries.map((enquiry) => {
              const today = isToday(enquiry.createdAt);

              return (
                <div key={enquiry.id} className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-green-950">
                        {enquiry.customerName}
                      </p>

                      <p className="mt-1 text-xs text-stone-500">
                        {enquiry.product.name} ·{" "}
                        {enquiry.quantity.toString()}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                        enquiry.status
                      )}`}
                    >
                      {enquiry.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-stone-400">
                        {enquiry.createdAt.toLocaleDateString()}
                      </p>

                      {today && (
                        <p className="mt-1 text-xs font-medium text-green-700">
                          New today
                        </p>
                      )}
                    </div>

                    <Link
                      href={`/admin/enquiries/${enquiry.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-green-800 hover:bg-green-50"
                    >
                      <Eye size={16} />
                      View
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Mobile View All */}
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
  );
}
