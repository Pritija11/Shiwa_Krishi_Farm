
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Pencil, Eye, Package, Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import type { Availability } from "@/generated/prisma/client";

type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  unit: string;
  availability: Availability;
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

const MOBILE_PAGE_SIZE = 5;
const DESKTOP_PAGE_SIZE = 10;

export default function ProductTable({
  products,
  categories,
}: ProductTableProps) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [availability, setAvailability] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DESKTOP_PAGE_SIZE);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(
    null
  );
  const [deleteError, setDeleteError] = useState<string | null>(
    null
  );
  const [archiveTarget, setArchiveTarget] = useState<Product | null>(
    null
  );
  const [archiveError, setArchiveError] = useState<string | null>(
    null
  );

  // Fewer rows per page on mobile, where each row/card takes more vertical space
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    function applyPageSize(isDesktop: boolean) {
      setPageSize(isDesktop ? DESKTOP_PAGE_SIZE : MOBILE_PAGE_SIZE);
      setCurrentPage(1);
    }

    applyPageSize(mediaQuery.matches);

    function handleChange(event: MediaQueryListEvent) {
      applyPageSize(event.matches);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () =>
      mediaQuery.removeEventListener("change", handleChange);
  }, []);

  async function performArchiveToggle(
    productId: string,
    isActive: boolean
  ) {
    setPendingId(productId);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Failed to ${isActive ? "archive" : "restore"} product.`
        );
      }

      router.refresh();
      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update product status.";

      if (archiveTarget?.id === productId) {
        setArchiveError(message);
      } else {
        window.alert(message);
      }

      return false;
    } finally {
      setPendingId(null);
    }
  }

  function openArchiveDialog(product: Product) {
    setArchiveError(null);
    setArchiveTarget(product);
  }

  function closeArchiveDialog() {
    setArchiveTarget(null);
    setArchiveError(null);
  }

  async function confirmArchiveToggle() {
    if (!archiveTarget) {
      return;
    }

    const succeeded = await performArchiveToggle(
      archiveTarget.id,
      archiveTarget.isActive
    );

    if (succeeded) {
      closeArchiveDialog();
    }
  }

  function openDeleteDialog(product: Product) {
    setDeleteError(null);
    setDeleteTarget(product);
  }

  function closeDeleteDialog() {
    setDeleteTarget(null);
    setDeleteError(null);
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    const productId = deleteTarget.id;

    setPendingId(productId);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete product.");
      }

      setDeleteTarget(null);
      router.refresh();
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Failed to delete product."
      );
    } finally {
      setPendingId(null);
    }
  }

  async function archiveFromDeleteDialog() {
    if (!deleteTarget) {
      return;
    }

    await performArchiveToggle(deleteTarget.id, deleteTarget.isActive);
    closeDeleteDialog();
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "ALL" || product.category.id === category;

      const matchesAvailability =
        availability === "ALL" || product.availability === availability;

      const matchesStatus =
        status === "ALL" ||
        (status === "ACTIVE" && product.isActive) ||
        (status === "ARCHIVED" && !product.isActive);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability &&
        matchesStatus
      );
    });
  }, [products, search, category, availability, status]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return filteredProducts.slice(
      startIndex,
      startIndex + pageSize
    );
  }, [filteredProducts, currentPage, pageSize]);

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

  function handleStatusChange(value: string) {
    setStatus(value);
    setCurrentPage(1);
  }

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  }

  const startItem =
    filteredProducts.length === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const endItem = Math.min(
    currentPage * pageSize,
    filteredProducts.length
  );

  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
      {/* Filters */}
      <div className="border-b border-stone-100 p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_180px_180px_180px]">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>

            <input
              id="product-search"
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
          <label htmlFor="product-category-filter" className="sr-only">
            Filter by category
          </label>

          <select
            id="product-category-filter"
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
          <label
            htmlFor="product-availability-filter"
            className="sr-only"
          >
            Filter by availability
          </label>

          <select
            id="product-availability-filter"
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

          {/* Status */}
          <label htmlFor="product-status-filter" className="sr-only">
            Filter by status
          </label>

          <select
            id="product-status-filter"
            value={status}
            onChange={(event) =>
              handleStatusChange(event.target.value)
            }
            className="rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm text-green-950 outline-none focus:border-green-700"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
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
                    {formatCurrency(product.price)}
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
                    <ProductActions
                      product={product}
                      pendingId={pendingId}
                      onArchive={openArchiveDialog}
                      onDelete={openDeleteDialog}
                      className="flex justify-end gap-2"
                    />
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
                    {formatCurrency(product.price)} /{" "}
                    {product.unit.toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <AvailabilityBadge
                  availability={product.availability}
                />

                <StatusBadge isActive={product.isActive} />
              </div>

              <ProductActions
                product={product}
                pendingId={pendingId}
                onArchive={openArchiveDialog}
                onDelete={openDeleteDialog}
                className="mt-3 flex gap-2"
              />
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

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <ConfirmDialog
          title={
            deleteError ? "Can't delete product" : "Delete product"
          }
          description={
            <>
              Are you sure you want to permanently delete{" "}
              <span className="font-medium text-green-950">
                {deleteTarget.name}
              </span>
              ? This will also remove its images and cannot be
              undone.
            </>
          }
          errorMessage={deleteError}
          onClose={closeDeleteDialog}
          onConfirm={
            deleteError ? archiveFromDeleteDialog : confirmDelete
          }
          confirmLabel={deleteError ? "Archive Instead" : "Delete"}
          pendingLabel={deleteError ? "Archiving..." : "Deleting..."}
          isPending={pendingId === deleteTarget.id}
          confirmVariant={deleteError ? "primary" : "danger"}
        />
      )}

      {/* Archive / Restore Confirmation Dialog */}
      {archiveTarget && (
        <ConfirmDialog
          title={
            archiveTarget.isActive
              ? "Archive product"
              : "Restore product"
          }
          description={
            archiveTarget.isActive ? (
              <>
                Are you sure you want to archive{" "}
                <span className="font-medium text-green-950">
                  {archiveTarget.name}
                </span>
                ? It will be hidden from the website but you can
                restore it anytime.
              </>
            ) : (
              <>
                Are you sure you want to restore{" "}
                <span className="font-medium text-green-950">
                  {archiveTarget.name}
                </span>
                ? It will become visible on the website again.
              </>
            )
          }
          errorMessage={archiveError}
          onClose={closeArchiveDialog}
          onConfirm={archiveError ? undefined : confirmArchiveToggle}
          confirmLabel={archiveTarget.isActive ? "Archive" : "Restore"}
          pendingLabel={
            archiveTarget.isActive ? "Archiving..." : "Restoring..."
          }
          isPending={pendingId === archiveTarget.id}
        />
      )}
    </div>
  );
}

function ProductActions({
  product,
  pendingId,
  onArchive,
  onDelete,
  className = "flex gap-2",
}: {
  product: Product;
  pendingId: string | null;
  onArchive: (product: Product) => void;
  onDelete: (product: Product) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <Link
        href={`/products/${product.id}`}
        target="_blank"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-green-800 hover:text-green-800"
        title="View product"
        aria-label="View product"
      >
        <Eye size={16} />
      </Link>

      <Link
        href={`/admin/products/${product.id}/edit`}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-green-800 hover:text-green-800"
        title="Edit product"
        aria-label="Edit product"
      >
        <Pencil size={16} />
      </Link>

      <button
        type="button"
        onClick={() => onArchive(product)}
        disabled={pendingId === product.id}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-amber-600 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
        title={
          product.isActive ? "Archive product" : "Restore product"
        }
        aria-label={
          product.isActive ? "Archive product" : "Restore product"
        }
      >
        {product.isActive ? (
          <Archive size={16} />
        ) : (
          <ArchiveRestore size={16} />
        )}
      </button>

      <button
        type="button"
        onClick={() => onDelete(product)}
        disabled={pendingId === product.id}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-red-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        title="Delete product"
        aria-label="Delete product"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function formatCurrency(value: string | number) {
  return `Rs. ${Number(value).toFixed(2)}`;
}

function AvailabilityBadge({
  availability,
}: {
  availability: Availability;
}) {
  const styles: Record<Availability, string> = {
    IN_STOCK: "bg-green-50 text-green-700",
    SEASONAL: "bg-amber-50 text-amber-700",
    OUT_OF_STOCK: "bg-red-50 text-red-700",
  };

  const labels: Record<Availability, string> = {
    IN_STOCK: "In Stock",
    SEASONAL: "Seasonal",
    OUT_OF_STOCK: "Out of Stock",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${styles[availability]}`}
    >
      {labels[availability]}
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

