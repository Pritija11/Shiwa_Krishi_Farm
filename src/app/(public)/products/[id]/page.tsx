import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Leaf, MapPin, Sprout } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getS3Url } from "@/lib/s3-url";
import ProductGallery from "@/components/products/ProductGallery";
import ProductCard from "@/components/products/ProductCard";
import Reveal from "@/components/ui/Reveal";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

const RELATED_COUNT = 3;

const trustPoints = [
  {
    icon: Leaf,
    title: "Farm Fresh",
    description: "Grown and raised on our own land.",
  },
  {
    icon: Sprout,
    title: "Carefully Raised",
    description: "Quality checked before it reaches you.",
  },
  {
    icon: MapPin,
    title: "Local & Trusted",
    description: "Sourced from Shiwa Krishi Farm.",
  },
];

function formatAvailability(
  availability: "IN_STOCK" | "SEASONAL" | "OUT_OF_STOCK"
) {
  switch (availability) {
    case "IN_STOCK":
      return "In Stock" as const;

    case "SEASONAL":
      return "Seasonal" as const;

    case "OUT_OF_STOCK":
      return "Out of Stock" as const;
  }
}

// Purely presentational accent for the availability line in the info
// column — does not affect the underlying availability value/logic.
function getAvailabilityAccent(
  availability: ReturnType<typeof formatAvailability>
) {
  switch (availability) {
    case "In Stock":
      return { dot: "bg-green-600", text: "text-green-700" };

    case "Seasonal":
      return { dot: "bg-amber-500", text: "text-amber-700" };

    case "Out of Stock":
      return { dot: "bg-stone-400", text: "text-stone-500" };
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
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const availability = formatAvailability(product.availability);

  const galleryImages = await Promise.all(
    (product.images.length > 0
      ? product.images.map((image) => image.imageUrl)
      : product.imageUrl
        ? [product.imageUrl]
        : []
    ).map((key) => getS3Url(key))
  );

  const isDairy = product.category.name === "Dairy";

  const relatedProductsFromDb = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: product.categoryId,
      id: {
        not: product.id,
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: RELATED_COUNT,
  });

  const relatedProducts = await Promise.all(
    relatedProductsFromDb.map(async (related) => ({
      id: related.id,
      name: related.name,
      category: related.category.name,
      description: related.description,
      price: Number(related.price),
      unit: related.unit,

      image: related.imageUrl
        ? await getS3Url(related.imageUrl)
        : "/images/farm-hero-image.jpg",

      availability: formatAvailability(related.availability),
      subscription: related.category.name === "Dairy",
    }))
  );

  const availabilityAccent = getAvailabilityAccent(availability);

  return (
    <main className="bg-[#F8F5ED]">
      <section className="relative overflow-hidden px-6 pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-green-900/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-amber-700/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-10 flex items-center gap-1.5 text-xs text-stone-500 md:mb-14"
          >
            <Link href="/" className="transition hover:text-green-800">
              Home
            </Link>

            <ChevronRight size={12} />

            <Link
              href="/products"
              className="transition hover:text-green-800"
            >
              Products
            </Link>

            <ChevronRight size={12} />

            <Link
              href={`/products?category=${product.categoryId}`}
              className="transition hover:text-green-800"
            >
              {product.category.name}
            </Link>

            <ChevronRight size={12} />

            <span className="max-w-40 truncate text-stone-400 sm:max-w-none">
              {product.name}
            </span>
          </nav>

          <div className="grid gap-14 md:grid-cols-2 md:items-start lg:gap-20">
            {/* Product Gallery */}
            <ProductGallery
              images={galleryImages}
              productName={product.name}
              category={product.category.name}
              availability={availability}
            />

            {/* Product Information */}
            <div className="min-w-0 md:pt-2">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-green-700">
                {product.category.name}
              </p>

              <h1 className="mt-4 font-[family-name:var(--font-dm-serif)] text-4xl leading-[1.1] text-green-950 sm:text-5xl">
                {product.name}
              </h1>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold tracking-tight text-green-900">
                  Rs. {Number(product.price)}
                </span>

                <span className="text-sm text-stone-500">
                  / {product.unit.toLowerCase()}
                </span>
              </div>

              <div className="mt-7 h-px w-full max-w-xl bg-stone-200" />

              <p className="mt-7 max-w-xl text-base leading-7 text-stone-600">
                {product.description}
              </p>

              {/* Availability */}
              <div className="mt-6 flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${availabilityAccent.dot}`}
                />

                <span
                  className={`text-sm font-medium ${availabilityAccent.text}`}
                >
                  {availability}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-7 flex flex-wrap gap-3">
                {product.availability !== "OUT_OF_STOCK" ? (
                  <Link
                    href={`/order?product=${product.id}`}
                    className="rounded-full bg-green-900 px-8 py-4 text-sm font-medium tracking-wide text-white shadow-sm transition-all duration-300 hover:bg-green-800 hover:shadow-md"
                  >
                    Enquire / Order
                  </Link>
                ) : (
                  <span className="rounded-full bg-stone-200 px-8 py-4 text-sm font-medium text-stone-500">
                    Currently Unavailable
                  </span>
                )}

                {isDairy && (
                  <Link
                    href="/milk-subscription"
                    className="rounded-full bg-green-900/5 px-7 py-4 text-sm font-medium text-green-900 transition-colors hover:bg-green-900/10"
                  >
                    Milk Subscription
                  </Link>
                )}
              </div>

              {isDairy && (
                <div className="mt-5 rounded-xl bg-[#F3F6EF] px-4 py-3 text-sm text-green-800">
                  <span className="font-medium">
                    Milk subscription available
                  </span>{" "}
                  for recurring home delivery.
                </div>
              )}

              {/* Trust Points */}
              <div className="mt-12 rounded-3xl border border-stone-200 bg-white/50 px-6 py-6 sm:px-8">
                <div className="grid grid-cols-1 divide-y divide-stone-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  {trustPoints.map((point) => {
                    const Icon = point.icon;

                    return (
                      <div
                        key={point.title}
                        className="flex items-start gap-3 py-4 first:pt-0 last:pb-0 sm:px-6 sm:py-0 sm:first:pl-0 sm:last:pr-0"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EEF1E7] text-green-800">
                          <Icon size={15} strokeWidth={1.8} />
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-green-950">
                            {point.title}
                          </h3>

                          <p className="mt-0.5 text-xs leading-5 text-stone-500">
                            {point.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="px-6 pb-24 md:pb-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 h-px bg-stone-200" />

            <Reveal className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
                  Keep Exploring
                </p>

                <h2 className="mt-3 font-[family-name:var(--font-dm-serif)] text-3xl text-green-950 sm:text-4xl">
                  More from the farm
                </h2>
              </div>

              <Link
                href="/products"
                className="hidden shrink-0 text-sm font-medium text-green-800 transition hover:text-green-900 sm:block"
              >
                View all products →
              </Link>
            </Reveal>

            <Reveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </Reveal>
          </div>
        </section>
      )}
    </main>
  );
}
