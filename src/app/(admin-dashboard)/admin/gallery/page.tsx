import Link from "next/link";
import { Image as ImageIcon, Plus, Search } from "lucide-react";

import { prisma } from "@/lib/prisma";
import GalleryGrid from "@/components/admin/GalleryGrid";
import Pagination from "@/components/admin/Pagination";

type GalleryPageProps = {
  searchParams: Promise<{
    page?: string;
    category?: string;
    status?: string;
    search?: string;
  }>;
};

const PAGE_SIZE = 12;

const validCategories = [
  "FARM",
  "ANIMALS",
  "POULTRY",
  "GOATS",
  "DAIRY",
  "VEGETABLES",
  "FAMILY",
  "OTHER",
] as const;

const validStatuses = ["ACTIVE", "ARCHIVED"] as const;

type GalleryCategory = (typeof validCategories)[number];
type GalleryStatus = (typeof validStatuses)[number];

export default async function GalleryPage({
  searchParams,
}: GalleryPageProps) {
  const params = await searchParams;

  const currentPage = Math.max(
    1,
    Number.parseInt(params.page || "1", 10) || 1
  );

  const search = params.search?.trim() || "";

  const categoryParam = params.category;

  const category: GalleryCategory | "ALL" =
    categoryParam &&
    validCategories.includes(categoryParam as GalleryCategory)
      ? (categoryParam as GalleryCategory)
      : "ALL";

  const statusParam = params.status;

  const status: GalleryStatus | "ALL" =
    statusParam &&
    validStatuses.includes(statusParam as GalleryStatus)
      ? (statusParam as GalleryStatus)
      : "ALL";

  const where = {
    ...(category !== "ALL" && {
      category,
    }),

    ...(status !== "ALL" && {
      isActive: status === "ACTIVE",
    }),

    ...(search && {
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),
  };

  const [
    totalItems,
    activeItems,
    archivedItems,
    filteredTotal,
    galleryItems,
  ] = await Promise.all([
    prisma.galleryItem.count(),

    prisma.galleryItem.count({
      where: {
        isActive: true,
      },
    }),

    prisma.galleryItem.count({
      where: {
        isActive: false,
      },
    }),

    prisma.galleryItem.count({
      where,
    }),

    prisma.galleryItem.findMany({
      where,
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const totalPages = Math.ceil(filteredTotal / PAGE_SIZE);

  if (totalPages > 0 && currentPage > totalPages) {
    return (
      <div className="px-6 py-8 lg:px-10 lg:py-10">
        <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-stone-600">
            This page does not exist.
          </p>

          <Link
            href="/admin/gallery"
            className="mt-4 inline-flex rounded-lg bg-green-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-900"
          >
            Back to gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
            Farm Media
          </p>

          <h1 className="mt-2 font-[family-name:var(--font-dm-serif)] text-4xl text-green-950 sm:text-5xl">
            Gallery
          </h1>

          <p className="mt-3 text-sm text-stone-600">
            Manage photos displayed on the farm website.
          </p>
        </div>

        <Link
          href="/admin/gallery/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-900"
        >
          <Plus size={17} strokeWidth={1.8} />
          Add image
        </Link>
      </div>

      {/* Summary */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard title="Total Images" value={totalItems} />
        <SummaryCard title="Active" value={activeItems} />
        <SummaryCard title="Archived" value={archivedItems} />
      </div>

      {/* Filters */}
      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <form
          action="/admin/gallery"
          method="GET"
          className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]"
        >
          <div className="relative">
            <Search
              size={18}
              strokeWidth={1.8}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by title or description..."
              className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-4 text-sm text-green-950 outline-none transition placeholder:text-stone-400 focus:border-green-800 focus:bg-white"
            />
          </div>

          <select
            name="category"
            defaultValue={category}
            className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-green-950 outline-none transition focus:border-green-800 focus:bg-white"
          >
            <option value="ALL">All categories</option>
            {validCategories.map((item) => (
              <option key={item} value={item}>
                {formatCategory(item)}
              </option>
            ))}
          </select>

          <select
            name="status"
            defaultValue={status}
            className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-green-950 outline-none transition focus:border-green-800 focus:bg-white"
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-green-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-900"
          >
            Search
          </button>
        </form>

        {(search || category !== "ALL" || status !== "ALL") && (
          <Link
            href="/admin/gallery"
            className="mt-3 inline-flex text-sm font-medium text-stone-500 transition hover:text-green-900"
          >
            Clear filters
          </Link>
        )}
      </div>

      {/* Gallery */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
          <div className="flex items-center gap-2">
            <ImageIcon
              size={18}
              strokeWidth={1.7}
              className="text-green-800"
            />

            <h2 className="font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
              Farm Gallery
            </h2>
          </div>

          <p className="hidden text-sm text-stone-500 sm:block">
            {filteredTotal}{" "}
            {filteredTotal === 1 ? "image" : "images"}
          </p>
        </div>

        {galleryItems.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <ImageIcon
              className="mx-auto text-green-800"
              size={30}
              strokeWidth={1.7}
            />

            <p className="mt-4 text-sm font-medium text-green-950">
              No gallery images found
            </p>

            <p className="mt-1 text-xs text-stone-500">
              {search || category !== "ALL" || status !== "ALL"
                ? "Try changing your search or filters."
                : "Add your first farm image to get started."}
            </p>

            {(search || category !== "ALL" || status !== "ALL") && (
              <Link
                href="/admin/gallery"
                className="mt-5 inline-flex rounded-lg bg-green-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-900"
              >
                Clear filters
              </Link>
            )}
          </div>
        ) : (
          <>
            <GalleryGrid items={galleryItems} />

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

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-xs text-stone-500">{title}</p>

      <p className="mt-2 text-2xl font-semibold text-green-950">
        {value}
      </p>
    </div>
  );
}

function formatCategory(category: GalleryCategory) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}