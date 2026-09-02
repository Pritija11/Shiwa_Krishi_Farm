import Link from "next/link";

type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  subject: string | null;
  message: string;
  status: "NEW" | "READ" | "RESOLVED";
  createdAt: Date;
};

type ContactMessageTableProps = {
  messages: ContactMessage[];
};

const statusStyles = {
  NEW: "bg-amber-50 text-amber-700 ring-amber-600/20",
  READ: "bg-blue-50 text-blue-700 ring-blue-600/20",
  RESOLVED: "bg-green-50 text-green-700 ring-green-600/20",
} as const;

export default function ContactMessageTable({
  messages,
}: ContactMessageTableProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left">
          <thead className="border-b border-stone-100 bg-stone-50/70">
            <tr>
              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-stone-500">
                Customer
              </th>

              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-stone-500">
                Contact
              </th>

              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-stone-500">
                Subject
              </th>

              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-stone-500">
                Message
              </th>

              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-stone-500">
                Status
              </th>

              <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-stone-500">
                Date
              </th>

              <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wide text-stone-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">
            {messages.map((message) => (
              <tr
                key={message.id}
                className="transition hover:bg-stone-50/60"
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-green-950">
                    {message.name}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm text-stone-700">
                      {message.phone}
                    </p>

                    {message.email && (
                      <p className="max-w-[180px] truncate text-xs text-stone-500">
                        {message.email}
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <p className="max-w-[180px] truncate text-sm text-stone-700">
                    {message.subject || "No subject"}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <p className="max-w-[240px] truncate text-sm text-stone-500">
                    {message.message}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                      statusStyles[message.status]
                    }`}
                  >
                    {formatStatus(message.status)}
                  </span>
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-500">
                  {formatDate(message.createdAt)}
                </td>

                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/contact-messages/${message.id}`}
                    className="text-sm font-medium text-green-800 transition hover:text-green-950"
                  >
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
        {messages.map((message) => (
          <div key={message.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-green-950">
                  {message.name}
                </p>

                <p className="mt-1 text-xs text-stone-500">
                  {message.phone}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                  statusStyles[message.status]
                }`}
              >
                {formatStatus(message.status)}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-stone-800">
                {message.subject || "No subject"}
              </p>

              <p className="mt-1 line-clamp-2 text-sm text-stone-500">
                {message.message}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                {message.email && (
                  <p className="max-w-[220px] truncate text-xs text-stone-500">
                    {message.email}
                  </p>
                )}

                <p className="mt-1 text-xs text-stone-400">
                  {formatDate(message.createdAt)}
                </p>
              </div>

              <Link
                href={`/admin/contact-messages/${message.id}`}
                className="text-sm font-medium text-green-800 transition hover:text-green-950"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function formatStatus(status: ContactMessage["status"]) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}