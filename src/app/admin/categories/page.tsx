import Link from "next/link";
import { Plus, FolderOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";

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
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead className="border-b border-stone-200 bg-[#F8F5ED]">
                    <tr>
                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-stone-500">
                        Category
                      </th>

                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-stone-500">
                        Slug
                      </th>

                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-stone-500">
                        Products
                      </th>

                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-stone-500">
                        Description
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {categories.map((category) => (
                      <tr
                        key={category.id}
                        className="border-b border-stone-100 last:border-0"
                      >
                        <td className="px-6 py-5">
                          <p className="font-medium text-green-950">
                            {category.name}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">
                            {category.slug}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-stone-600">
                          {category._count.products}
                        </td>

                        <td className="px-6 py-5 text-sm text-stone-600">
                          {category.description || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-stone-100 md:hidden">
                {categories.map((category) => (
                  <div key={category.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-medium text-green-950">
                          {category.name}
                        </h2>

                        <span className="mt-2 inline-block rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">
                          {category.slug}
                        </span>
                      </div>

                      <span className="text-sm text-stone-500">
                        {category._count.products} products
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-stone-600">
                      {category.description || "No description"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}