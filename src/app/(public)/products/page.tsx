import type { Metadata } from "next";
import ProductsHero from "@/components/products/ProductsHero";
import CategoryFilter from "@/components/products/CategoryFilter";
import ProductGrid, {
  type Product,
} from "@/components/products/ProductGrid";
import { prisma } from "@/lib/prisma";
import { getS3Url } from "@/lib/s3-url";

export const metadata: Metadata = {
  title: "Our Products",
  description:
    "Browse fresh poultry & eggs, goat meat, cow milk, and organic vegetables from Shiwa Krishi Farm, with current availability and pricing.",
};

const PRODUCTS_PER_PAGE = 12;

type ProductsPageProps = {
  searchParams: Promise<{
    category?: string;
    availability?: string;
    sort?: string;
    page?: string;
  }>;
};

const availabilityFilterMap: Record<string, "IN_STOCK" | "SEASONAL"> = {
  "in-stock": "IN_STOCK",
  seasonal: "SEASONAL",
};

function formatAvailability(
  availability: "IN_STOCK" | "SEASONAL" | "OUT_OF_STOCK"
): Product["availability"] {
  switch (availability) {
    case "IN_STOCK":
      return "In Stock";

    case "SEASONAL":
      return "Seasonal";

    case "OUT_OF_STOCK":
      return "Out of Stock";
  }
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { category, availability, sort, page } = await searchParams;

  const availabilityFilter = availability
    ? availabilityFilterMap[availability]
    : undefined;

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

  const where = {
    isActive: true,
    ...(category
      ? {
          category: {
            slug: category,
          },
        }
      : {}),
    ...(availabilityFilter
      ? {
          availability: availabilityFilter,
        }
      : {}),
  };

  const [categories, totalCount] = await Promise.all([
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    }),

    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(
    Math.ceil(totalCount / PRODUCTS_PER_PAGE),
    1
  );

  const requestedPage = Number(page) || 1;
  const currentPage = Math.min(
    Math.max(requestedPage, 1),
    totalPages
  );

  const productsFromDb = await prisma.product.findMany({
    where,
    include: {
      category: true,
    },
    orderBy,
    skip: (currentPage - 1) * PRODUCTS_PER_PAGE,
    take: PRODUCTS_PER_PAGE,
  });

  const hasActiveFilters = Boolean(category) || Boolean(availabilityFilter);

  const products: Product[] = await Promise.all(
    productsFromDb.map(async (product) => ({
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
    }))
  );

  return (
    <main>
      <ProductsHero />

      <CategoryFilter categories={categories} />

      <ProductGrid
        products={products}
        hasActiveFilters={hasActiveFilters}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </main>
  );
}