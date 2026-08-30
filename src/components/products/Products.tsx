import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";

const products = [
  {
    id: "fresh-cow-milk",
    name: "Fresh Cow Milk",
    category: "Dairy",
    description: "Fresh cow milk collected with care from our farm.",
    price: 120,
    unit: "litre",
    image: "/images/hero-dairy.jpg",
    availability: "In Stock" as const,
    subscription: true,
  },
  {
    id: "farm-fresh-eggs",
    name: "Farm Fresh Eggs",
    category: "Poultry",
    description: "Fresh eggs from carefully raised farm poultry.",
    price: 180,
    unit: "dozen",
    image: "/images/poultry.jpg",
    availability: "In Stock" as const,
    subscription: false,
  },
  {
    id: "seasonal-vegetables",
    name: "Seasonal Vegetables",
    category: "Vegetables",
    description: "Fresh seasonal vegetables grown at our farm.",
    price: 80,
    unit: "kg",
    image: "/images/hero-veggies.jpg",
    availability: "Seasonal" as const,
    subscription: false,
  },
];
const categories = ["All", "Dairy", "Vegetables", "Poultry", "Meat"];

export default function Products() {
  return (
    <section className="relative overflow-hidden bg-[#F8F5ED] px-6 py-24 md:py-32">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-green-900/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-20 h-80 w-80 rounded-full bg-amber-700/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-green-800/20" />

            <span className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
              Our Products
            </span>

            <span className="h-px w-10 bg-green-800/20" />
          </div>

          <h2 className="mx-auto mt-5 max-w-3xl font-[family-name:var(--font-dm-serif)] text-4xl leading-tight text-green-950 sm:text-5xl md:text-6xl">
            Fresh from our farm,
            <span className="block text-green-700">
              made for your table.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
            From fresh dairy to seasonal produce, discover carefully grown
            and raised products from Shiwa Krishi Farm.
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                index === 0
                  ? "border-green-800 bg-green-800 text-white"
                  : "border-stone-300 bg-white/60 text-green-900 hover:border-green-700 hover:bg-green-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Surface */}
        <div className="mt-14 rounded-[2rem] border border-stone-200/70 bg-white/40 p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </div>

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