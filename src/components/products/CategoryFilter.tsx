"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Category = {
  id: string;
  name: string;
};

type CategoryFilterProps = {
  categories: Category[];
};

export default function CategoryFilter({
  categories,
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category");

  function handleCategoryChange(categoryId: string) {
    if (categoryId === "all") {
      router.push("/products");
      return;
    }

    router.push(`/products?category=${categoryId}`);
  }

  return (
    <section className="bg-[#F8F5ED] px-6 pb-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleCategoryChange("all")}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
              !selectedCategory
                ? "bg-green-900 text-white"
                : "border border-green-900/20 text-green-900 hover:bg-green-900/5"
            }`}
          >
            All Products
          </button>

          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryChange(category.id)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
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
      </div>
    </section>
  );
}