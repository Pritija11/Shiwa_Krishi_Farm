import ProductCard from "./ProductCard";

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
};

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <section className="bg-[#F8F5ED] px-6 pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
            Farm Fresh
          </p>

          <h2 className="mt-3 font-[family-name:var(--font-dm-serif)] text-4xl text-green-950 sm:text-5xl">
            What&apos;s available
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl border border-stone-200 bg-white px-6 py-16 text-center">
            <h3 className="font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
              No products available
            </h3>

            <p className="mt-2 text-sm text-stone-500">
              Please check back soon for our latest farm-fresh products.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}