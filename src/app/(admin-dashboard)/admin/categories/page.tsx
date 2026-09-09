import Link from "next/link";
import { Plus, FolderOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import CategoryTable from "@/components/admin/CategoryTable";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      {/* Header */}
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
              Management
            </p>

            <h1 className="mt-2 font-[family-name:var(--font-dm-serif)] text-4xl text-green-950 sm:text-5xl">
              Categories
            </h1>

            <p className="mt-3 text-sm text-stone-600">
              Manage the categories used to organize your farm products.
            </p>
          </div>

          <Link
            href="/admin/categories/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-green-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-800"
          >
            <Plus size={17} />
            Add Category
          </Link>
        </div>

        {/* Summary */}
        <div className="mt-8">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-stone-500">Total Categories</p>

            <p className="mt-2 text-2xl font-semibold text-green-950">
              {categories.length}
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-8">
          {categories.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center shadow-sm">
              <FolderOpen
                className="mx-auto text-green-800"
                size={32}
                strokeWidth={1.6}
              />

              <h2 className="mt-4 font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
                No categories yet
              </h2>

              <p className="mt-2 text-sm text-stone-500">
                Create your first category to organize your products.
              </p>

              <Link
                href="/admin/categories/new"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-800"
              >
                <Plus size={17} />
                Add Category
              </Link>
            </div>
          ) : (
            <CategoryTable categories={categories} />
          )}
        </div>
      </div>
    </div>
  );
}