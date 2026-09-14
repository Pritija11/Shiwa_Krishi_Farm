import Link from "next/link";
import ProductCard from "./ProductCard";
import ProductsPagination from "./ProductsPagination";
import Reveal from "@/components/ui/Reveal";

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  availability: "In Stock" | "Seasonal" | "Out of Stock";
  subscription?: boolean;
};

type ProductGridProps = {
  products: Product[];
  hasActiveFilters?: boolean;
  currentPage?: number;
  totalPages?: number;
};

export default function ProductGrid({
  products,
  hasActiveFilters = false,
  currentPage = 1,
  totalPages = 1,
}: ProductGridProps) {
  return (
    <section className="bg-[#F8F5ED] px-6 pb-16 pt-8 md:pb-24 md:pt-10">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
            Farm Fresh
          </p>

          <h2 className="mt-3 font-[family-name:var(--font-dm-serif)] text-3xl text-green-950 sm:text-4xl md:text-5xl">
            What&apos;s available
          </h2>
        </Reveal>

        {products.length === 0 ? (
          <div className="rounded-3xl border border-stone-200 bg-white px-6 py-16 text-center">
            <h3 className="font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
              {hasActiveFilters
                ? "No products found"
                : "No products available"}
            </h3>

            <p className="mt-2 text-sm text-stone-500">
              {hasActiveFilters
                ? "Try changing your filters or browse all products."
                : "Please check back soon for our latest farm-fresh products."}
            </p>

            {hasActiveFilters && (
              <Link
                href="/products"
                className="mt-5 inline-flex items-center rounded-full border border-green-900/20 px-5 py-2.5 text-sm font-medium text-green-900 transition hover:bg-green-900/5"
              >
                Clear filters
              </Link>
            )}
          </div>
        ) : (
          <>
            <Reveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Reveal>

            <ProductsPagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </>
        )}
      </div>
    </section>
  );
}