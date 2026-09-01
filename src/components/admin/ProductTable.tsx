
"use client";

import Link from "next/link";
import { Search, Pencil, Eye, Package } from "lucide-react";
import { useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  unit: string;
  availability: string;
  imageUrl: string | null;
  isActive: boolean;
  category: {
    id: string;
    name: string;
  };
};

type Category = {
  id: string;
  name: string;
};

type ProductTableProps = {
  products: Product[];
  categories: Category[];
};

const PAGE_SIZE = 10;

export default function ProductTable({
  products,
  categories,
}: ProductTableProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [availability, setAvailability] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "ALL" || product.category.id === category;

      const matchesAvailability =
        availability === "ALL" || product.availability === availability;

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [products, search, category, availability]);

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return filteredProducts.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );
  }, [filteredProducts, currentPage]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleCategoryChange(value: string) {
    setCategory(value);
    setCurrentPage(1);
  }

  function handleAvailabilityChange(value: string) {
    setAvailability(value);
    setCurrentPage(1);
  }

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  }

  const startItem =
    filteredProducts.length === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const endItem = Math.min(
    currentPage * PAGE_SIZE,
    filteredProducts.length
  );

  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
      {/* Filters */}
      <div className="border-b border-stone-100 p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_200px_200px]">
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
                handleSearchChange(event.target.value)
              }
              placeholder="Search products..."
              className="w-full rounded-xl border border-stone-200 bg-[#F8F5ED] py-3 pl-11 pr-4 text-sm text-green-950 outline-none transition placeholder:text-stone-400 focus:border-green-700"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(event) =>
              handleCategoryChange(event.target.value)
            }
            className="rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm text-green-950 outline-none focus:border-green-700"
          >
            <option value="ALL">All Categories</option>

            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          {/* Availability */}
          <select
            value={availability}
            onChange={(event) =>
              handleAvailabilityChange(event.target.value)
            }
            className="rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm text-green-950 outline-none focus:border-green-700"
          >
            <option value="ALL">All Availability</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="SEASONAL">Seasonal</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Result Count */}
      <div className="border-b border-stone-100 px-5 py-4">
        <p className="text-xs text-stone-500">
          Showing{" "}
          <span className="font-medium text-green-900">
            {startItem}-{endItem}
          </span>{" "}
          of{" "}
          <span className="font-medium text-green-900">
            {filteredProducts.length}
          </span>{" "}
          products
        </p>
      </div>

      {/* Desktop Table */}
      {paginatedProducts.length > 0 && (
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 text-left">
                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-stone-400">
                  Product
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-stone-400">
                  Category
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-stone-400">
                  Price
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-stone-400">
                  Availability
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-stone-400">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-wider text-stone-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-stone-100 last:border-0 transition hover:bg-stone-50/70"
                >
                  {/* Product */}
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DDE8D8] text-green-800">
                          <Package size={19} />
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-medium text-green-950">
                          {product.name}
                        </p>

                        <p className="mt-1 max-w-xs truncate text-xs text-stone-500">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-5 text-sm text-stone-600">
                    {product.category.name}
                  </td>

                  {/* Price */}
                  <td className="px-5 py-5 text-sm font-medium text-green-900">
                    Rs. {Number(product.price).toFixed(2)}
                  </td>

                  {/* Availability */}
                  <td className="px-5 py-5">
                    <AvailabilityBadge
                      availability={product.availability}
                    />
                  </td>

                  {/* Status */}
                  <td className="px-5 py-5">
                    <StatusBadge isActive={product.isActive} />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-5">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/products/${product.id}`}
                        target="_blank"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-green-800 hover:text-green-800"
                        title="View product"
                      >
                        <Eye size={16} />
                      </Link>

                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-green-800 hover:text-green-800"
                        title="Edit product"
                      >
                        <Pencil size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Cards */}
      {paginatedProducts.length > 0 && (
        <div className="divide-y divide-stone-100 md:hidden">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="p-5">
              <div className="flex gap-3">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#DDE8D8] text-green-800">
                    <Package size={19} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-green-950">
                    {product.name}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    {product.category.name}
                  </p>

                  <p className="mt-2 text-sm font-medium text-green-900">
                    Rs. {Number(product.price).toFixed(2)} /{" "}
                    {product.unit.toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <AvailabilityBadge
                    availability={product.availability}
                  />

                  <StatusBadge isActive={product.isActive} />
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    target="_blank"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500"
                    title="View product"
                  >
                    <Eye size={16} />
                  </Link>

                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500"
                    title="Edit product"
                  >
                    <Pencil size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="px-6 py-14 text-center">
          <Search
            className="mx-auto text-stone-400"
            size={28}
            strokeWidth={1.5}
          />

          <p className="mt-3 text-sm font-medium text-green-950">
            No products found
          </p>

          <p className="mt-1 text-xs text-stone-500">
            Try changing your search or filters.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-4 border-t border-stone-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-stone-500">
            Page{" "}
            <span className="font-medium text-green-900">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-medium text-green-900">
              {totalPages}
            </span>
          </p>

          <div className="flex items-center justify-center gap-1.5">
            {/* Previous */}
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-medium transition ${
                    currentPage === page
                      ? "bg-green-950 text-white"
                      : "border border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* Next */}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AvailabilityBadge({
  availability,
}: {
  availability: string;
}) {
  const styles = {
    IN_STOCK: "bg-green-50 text-green-700",
    SEASONAL: "bg-amber-50 text-amber-700",
    OUT_OF_STOCK: "bg-red-50 text-red-700",
  };

  const labels = {
    IN_STOCK: "In Stock",
    SEASONAL: "Seasonal",
    OUT_OF_STOCK: "Out of Stock",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
        styles[availability as keyof typeof styles]
      }`}
    >
      {labels[availability as keyof typeof labels] ?? availability}
    </span>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
        isActive
          ? "bg-green-50 text-green-700"
          : "bg-stone-100 text-stone-500"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

