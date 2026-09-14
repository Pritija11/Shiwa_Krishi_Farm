"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ProductsPaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function ProductsPagination({
  currentPage,
  totalPages,
}: ProductsPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  function goToPage(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const query = params.toString();
    router.push(query ? `/products?${query}` : "/products");
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Products pagination"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-green-900/20 text-green-900 transition hover:bg-green-900/5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => goToPage(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium transition ${
            page === currentPage
              ? "bg-green-900 text-white"
              : "border border-green-900/20 text-green-900 hover:bg-green-900/5"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-green-900/20 text-green-900 transition hover:bg-green-900/5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
