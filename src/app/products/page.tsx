import ProductsHero from "@/components/products/ProductsHero";
import CategoryFilter from "@/components/products/CategoryFilter";
import ProductGrid, {
  type Product,
} from "@/components/products/ProductGrid";
import { prisma } from "@/lib/prisma";

type ProductsPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
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
  const { category } = await searchParams;

  const [categories, productsFromDb] = await Promise.all([
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    }),

    prisma.product.findMany({
      where: {
        isActive: true,
        ...(category
          ? {
              categoryId: category,
            }
          : {}),
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const products: Product[] = productsFromDb.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category.name,
    description: product.description,
    price: Number(product.price),
    unit: product.unit,
    image: product.imageUrl ?? "/images/farm-hero-image.jpg",
    availability: formatAvailability(product.availability),
  }));

  return (
    <main>
      <ProductsHero />

      <CategoryFilter categories={categories} />

      <ProductGrid products={products} />
    </main>
  );
}