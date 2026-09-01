
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  search?: string;
  status?: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  search,
  status,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();

    params.set("page", page.toString());

    if (search) {
      params.set("search", search);
    }

    if (status && status !== "ALL") {
      params.set("status", status);
    }

    return `/admin/enquiries?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between border-t border-stone-100 px-6 py-4">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50 hover:text-green-950"
        >
          <ChevronLeft size={16} />
          Previous
        </Link>
      ) : (
        <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-stone-100 px-3 py-2 text-sm font-medium text-stone-300">
          <ChevronLeft size={16} />
          Previous
        </span>
      )}

      {/* Page Numbers */}
      <div className="hidden items-center gap-1 sm:flex">
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;

          return (
            <Link
              key={page}
              href={createPageUrl(page)}
              className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
                page === currentPage
                  ? "bg-green-950 text-white"
                  : "text-stone-600 hover:bg-stone-50 hover:text-green-950"
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Mobile Page Indicator */}
      <p className="text-sm text-stone-500 sm:hidden">
        Page {currentPage} of {totalPages}
      </p>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50 hover:text-green-950"
        >
          Next
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-stone-100 px-3 py-2 text-sm font-medium text-stone-300">
          Next
          <ChevronRight size={16} />
        </span>
      )}
    </div>
  );
}

