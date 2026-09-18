import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { prisma } from "@/lib/prisma";
import { getS3Url } from "@/lib/s3-url";
import Reveal from "@/components/ui/Reveal";

const FEATURED_COUNT = 4;

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

async function getHomepageProducts() {
  const featured = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: FEATURED_COUNT,
  });

  let selected = featured;

  // Fill any remaining slots with the newest active products, so the
  // homepage always shows FEATURED_COUNT cards even if the admin
  // hasn't marked (enough) products as featured yet.
  if (selected.length < FEATURED_COUNT) {
    const alreadyPicked = selected.map((product) => product.id);

    const fallback = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(alreadyPicked.length > 0 && {
          id: {
            notIn: alreadyPicked,
          },
        }),
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: FEATURED_COUNT - selected.length,
    });

    selected = [...selected, ...fallback];
  }

  return Promise.all(
    selected.map(async (product) => ({
      id: product.id,
      name: product.name,
      category: product.category.name,
      description: product.description,
      price: Number(product.price),
      unit: product.unit,

      image: product.imageUrl
        ? await getS3Url(product.imageUrl)
        : "/images/farm-hero-image.jpg",

      availability: formatAvailability(product.availability),

      // Only dairy currently offers a recurring delivery subscription.
      subscription: product.category.name === "Dairy",
    }))
  );
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export default async function Products() {
  const [products, categories] = await Promise.all([
    getHomepageProducts(),
    getCategories(),
  ]);

  return (
    <section className="relative overflow-hidden bg-[#F8F5ED] px-6 py-16 md:py-24">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-green-900/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-20 h-80 w-80 rounded-full bg-amber-700/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <Reveal className="text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-green-800/20" />

            <span className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
              Our Products
            </span>

            <span className="h-px w-10 bg-green-800/20" />
          </div>

          <h2 className="mx-auto mt-5 max-w-3xl font-[family-name:var(--font-dm-serif)] text-3xl leading-tight text-green-950 sm:text-4xl md:text-5xl">
            Fresh from our farm,
            <span className="block text-green-700">
              made for your table.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
            From fresh dairy to seasonal produce, discover carefully grown
            and raised products from Shiwa Krishi Farm.
          </p>
        </Reveal>

        {/* Category Navigation */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          <Link
            href="/products"
            className="rounded-full border border-green-800 bg-green-800 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300"
          >
            All Products
          </Link>

          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="rounded-full border border-stone-300 bg-white/60 px-5 py-2.5 text-sm font-medium text-green-900 transition-all duration-300 hover:border-green-700 hover:bg-green-50"
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Products Surface */}
        <Reveal className="mt-14 rounded-[2rem] border border-stone-200/70 bg-white/40 p-4 sm:p-6 md:p-8">
          {products.length === 0 ? (
            <p className="py-10 text-center text-sm text-stone-500">
              Products will appear here soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </Reveal>

        {/* Bottom CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/products"
            className="group inline-flex items-center rounded-full border border-green-800 px-7 py-3.5 text-sm font-medium text-green-800 transition-all duration-300 hover:bg-green-800 hover:text-white"
          >
            Explore All Products
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
