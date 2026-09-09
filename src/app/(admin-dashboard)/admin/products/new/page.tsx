"use client";

import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      {/* Header */}
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
          Products
        </p>

        <h1 className="mt-2 font-[family-name:var(--font-dm-serif)] text-3xl text-green-950 sm:text-4xl lg:text-5xl">
          Add Product
        </h1>

        <p className="mt-3 text-sm text-stone-600">
          Add a new product to your farm inventory.
        </p>
      </div>

      <ProductForm mode="create" />
    </div>
  );
}
