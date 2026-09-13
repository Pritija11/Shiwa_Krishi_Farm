import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Product = {
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

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const availabilityStyles = {
    "In Stock": "bg-green-100 text-green-800",
    Seasonal: "bg-amber-100 text-amber-800",
    "Out of Stock": "bg-stone-100 text-stone-500",
  };

  const isOutOfStock = product.availability === "Out of Stock";

  return (
    <article className="group overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:border-green-900/20 hover:shadow-md">
      {/* Product Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
              isOutOfStock ? "opacity-75" : ""
            }`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {/* Category */}
          <div className="absolute left-4 top-4">
            <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-green-950 shadow-sm">
              {product.category}
            </span>
          </div>

          {/* Availability */}
          <div className="absolute right-4 top-4">
            <span
              className={`rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider shadow-sm ${
                availabilityStyles[product.availability]
              }`}
            >
              {product.availability}
            </span>
          </div>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-6">
        <h3 className="font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
          {product.name}
        </h3>

        <p className="mt-2 text-sm leading-6 text-stone-500">
          {product.description}
        </p>

        <div className="my-5 h-px bg-stone-200" />

        {/* Price + Product Link */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-lg font-semibold text-green-900">
              Rs. {product.price}
            </span>

            <span className="ml-1 text-sm text-stone-500">
              / {product.unit}
            </span>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-green-800/20 text-green-800 transition-all duration-300 hover:bg-green-800 hover:text-white"
            aria-label={`View ${product.name}`}
          >
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>

        {/* Subscription */}
        {product.subscription && (
          <div className="mt-4 rounded-xl bg-[#F3F6EF] px-4 py-3 text-sm text-green-800">
            <span className="font-medium">Milk subscription available</span>
          </div>
        )}
      </div>
    </article>
  );
}
