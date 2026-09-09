"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import ProductForm from "@/components/admin/ProductForm";

type ProductResponse = {
  name: string;
  description: string;
  price: string | number;
  unit: string;
  availability: string;
  categoryId: string;
  isActive: boolean;
  images: { key: string; url: string }[];
};

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [product, setProduct] = useState<ProductResponse | null>(
    null
  );

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${id}`);

        if (!response.ok) {
          throw new Error("Failed to load product.");
        }

        setProduct(await response.json());
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      {/* Header */}
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
          Products
        </p>

        <h1 className="mt-2 font-[family-name:var(--font-dm-serif)] text-3xl text-green-950 sm:text-4xl lg:text-5xl">
          Edit Product
        </h1>

        <p className="mt-3 text-sm text-stone-600">
          Update product information, pricing, availability, and
          status.
        </p>
      </div>

      {loading && (
        <p className="mx-auto mt-8 max-w-4xl text-sm text-stone-500">
          Loading product...
        </p>
      )}

      {!loading && error && (
        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && product && (
        <ProductForm
          mode="edit"
          productId={id}
          initialValues={{
            name: product.name,
            description: product.description,
            price: String(product.price),
            unit: product.unit,
            availability: product.availability,
            categoryId: product.categoryId,
            isActive: product.isActive,
          }}
          initialImages={product.images}
        />
      )}
    </div>
  );
}
