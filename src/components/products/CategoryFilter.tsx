"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type CategoryFilterProps = {
  categories: Category[];
};

const availabilityOptions = [
  { value: "", label: "Availability: All" },
  { value: "in-stock", label: "In Stock" },
  { value: "seasonal", label: "Seasonal" },
];

const sortOptions = [
  { value: "", label: "Sort: Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function CategoryFilter({
  categories,
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category");
  const selectedAvailability = searchParams.get("availability") ?? "";
  const selectedSort = searchParams.get("sort") ?? "";

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }

    // Changing a filter changes the result set, so always land back on page 1.
    params.delete("page");

    const query = params.toString();
    router.push(query ? `/products?${query}` : "/products");
  }

  return (
    <section className="border-b border-stone-200/70 bg-[#F8F5ED] px-6 py-5">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Pills */}
        <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          <button
            type="button"
            onClick={() => updateParams({ category: null })}
            className={`shrink-0 cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition ${
              !selectedCategory
                ? "bg-green-900 text-white"
                : "border border-green-900/20 text-green-900 hover:bg-green-900/5"
            }`}
          >
            All Products
          </button>

          {categories.map((category) => {
            const isSelected = selectedCategory === category.slug;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => updateParams({ category: category.slug })}
                className={`shrink-0 cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  isSelected
                    ? "bg-green-900 text-white"
                    : "border border-green-900/20 text-green-900 hover:bg-green-900/5"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Availability + Sort */}
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:flex-nowrap sm:shrink-0">
          <div className="relative">
            <select
              value={selectedAvailability}
              onChange={(event) =>
                updateParams({ availability: event.target.value || null })
              }
              aria-label="Filter by availability"
              className="appearance-none rounded-full border border-green-900/20 bg-white py-2.5 pl-4 pr-8 text-sm font-medium text-green-900 transition hover:bg-green-900/5 focus:outline-none focus:ring-2 focus:ring-green-900/30"
            >
              {availabilityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-green-900/60"
            />
          </div>

          <div className="relative">
            <select
              value={selectedSort}
              onChange={(event) =>
                updateParams({ sort: event.target.value || null })
              }
              aria-label="Sort products"
              className="appearance-none rounded-full border border-green-900/20 bg-white py-2.5 pl-4 pr-8 text-sm font-medium text-green-900 transition hover:bg-green-900/5 focus:outline-none focus:ring-2 focus:ring-green-900/30"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-green-900/60"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
