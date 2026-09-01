
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getS3Url } from "@/lib/s3-url";
import ProductTable from "@/components/admin/ProductTable";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  // Generate temporary signed URLs for S3 images
  const productsWithUrls = await Promise.all(
    products.map(async (product) => ({
      ...product,
      price: product.price.toString(),
      imageUrl: product.imageUrl
        ? await getS3Url(product.imageUrl)
        : null,
    }))
  );

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
            Management
          </p>

          <h1 className="mt-2 font-[family-name:var(--font-dm-serif)] text-4xl text-green-950 sm:text-5xl">
            Products
          </h1>

          <p className="mt-3 text-sm text-stone-600">
            Manage your farm products, pricing, availability, and categories.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-green-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-800"
        >
          <Plus size={17} />
          Add Product
        </Link>
      </div>

      {/* Summary */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-stone-500">Total Products</p>

          <p className="mt-2 text-2xl font-semibold text-green-950">
            {products.length}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-stone-500">Active Products</p>

          <p className="mt-2 text-2xl font-semibold text-green-950">
            {products.filter((product) => product.isActive).length}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-stone-500">Out of Stock</p>

          <p className="mt-2 text-2xl font-semibold text-green-950">
            {
              products.filter(
                (product) => product.availability === "OUT_OF_STOCK",
              ).length
            }
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="mt-8">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center shadow-sm">
            <Package
              className="mx-auto text-green-800"
              size={32}
              strokeWidth={1.6}
            />

            <h2 className="mt-4 font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
              No products yet
            </h2>

            <p className="mt-2 text-sm text-stone-500">
              Add your first farm product to get started.
            </p>

            <Link
              href="/admin/products/new"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-800"
            >
              <Plus size={17} />
              Add Product
            </Link>
          </div>
        ) : (
          <ProductTable
            products={productsWithUrls}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
}
