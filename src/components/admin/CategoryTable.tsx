"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: {
    products: number;
  };
};

type CategoryTableProps = {
  categories: Category[];
};

export default function CategoryTable({
  categories,
}: CategoryTableProps) {
  return (
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

              <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wide text-stone-500">
                Actions
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

                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-green-800 transition hover:text-green-950"
                    >
                      <Pencil size={14} strokeWidth={1.8} />
                      Edit
                    </Link>

                    {category._count.products === 0 && (
                      <DeleteCategoryButton
                        id={category.id}
                        name={category.name}
                      />
                    )}
                  </div>
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

            <div className="mt-4 flex items-center gap-3">
              <Link
                href={`/admin/categories/${category.id}/edit`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-green-800 transition hover:text-green-950"
              >
                <Pencil size={14} strokeWidth={1.8} />
                Edit
              </Link>

              {category._count.products === 0 && (
                <DeleteCategoryButton
                  id={category.id}
                  name={category.name}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
