
import Link from "next/link";
import { Eye } from "lucide-react";

type EnquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

type EnquiryTableProps = {
  enquiries: {
    id: string;
    customerName: string;
    phone: string;
    quantity: any;
    status: EnquiryStatus;
    createdAt: Date;
    product: {
      name: string;
    };
  }[];
};

function isToday(date: Date) {
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function getStatusStyle(status: EnquiryStatus) {
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

export default function EnquiryTable({
  enquiries,
}: EnquiryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px]">
        <thead>
          <tr className="border-b border-stone-100 text-left">
            <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-stone-400">
              Customer
            </th>

            <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-stone-400">
              Product
            </th>

            <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-stone-400">
              Contact
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

                  <p className="mt-1 text-xs text-stone-400">
                    Quantity: {enquiry.quantity.toString()}
                  </p>
                </td>

                {/* Contact */}
                <td className="px-6 py-5">
                  <p className="text-sm text-stone-700">
                    {enquiry.phone}
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

                  {today && (
                    <p className="mt-1 text-xs text-green-700">
                      Today
                    </p>
                  )}
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
  );
}

