import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getS3Url } from "@/lib/s3-url";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

function formatAvailability(
  availability: "IN_STOCK" | "SEASONAL" | "OUT_OF_STOCK"
) {
  switch (availability) {
    case "IN_STOCK":
      return "In Stock";

    case "SEASONAL":
      return "Seasonal";

    case "OUT_OF_STOCK":
      return "Out of Stock";
  }
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const availability = formatAvailability(product.availability);

  // Generate a signed S3 URL for the product image
  const imageUrl = product.imageUrl
    ? await getS3Url(product.imageUrl)
    : null;

  return (
    <main className="bg-[#F8F5ED]">
      <section className="px-6 pb-24 pt-36 md:pb-32">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
          {/* Product Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                priority
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[#E7E3D8] text-sm text-stone-500">
                No image available
              </div>
            )}
          </div>

          {/* Product Information */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
              {product.category.name}
            </p>

            <h1 className="mt-4 font-[family-name:var(--font-dm-serif)] text-5xl leading-tight text-green-950 sm:text-6xl">
              {product.name}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
              {product.description}
            </p>

            {/* Availability */}
            <div className="mt-6">
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  product.availability === "IN_STOCK"
                    ? "bg-green-100 text-green-800"
                    : product.availability === "SEASONAL"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-stone-100 text-stone-500"
                }`}
              >
                {availability}
              </span>
            </div>

            {/* Price */}
            <div className="mt-8">
              <span className="text-2xl font-medium text-green-800">
                Rs. {Number(product.price)}
              </span>

              <span className="ml-1 text-sm text-stone-500">
                / {product.unit.toLowerCase()}
              </span>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/order?product=${product.id}`}
                className="rounded-full bg-green-900 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-green-800"
              >
                Enquire / Order
              </Link>

              {product.category.name.toLowerCase().includes("milk") && (
                <Link
                  href="/milk-subscription"
                  className="rounded-full border border-green-900/20 px-7 py-3.5 text-sm font-medium text-green-900 transition hover:bg-green-900/5"
                >
                  Milk Subscription
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}