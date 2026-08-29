import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Fresh Vegetables",
    description: "Seasonal produce grown fresh on our farm.",
    image: "/images/hero-veggies.jpg",
    href: "/products?category=vegetables",
  },
  {
    name: "Fresh Dairy",
    description: "Fresh, wholesome milk from our farm.",
    image: "/images/hero-dairy.jpg",
    href: "/products?category=dairy",
  },
  {
    name: "Poultry",
    description: "Quality farm-raised poultry products.",
    image: "/images/poultry.jpg",
    href: "/products?category=poultry",
  },
  {
    name: "Goat & Meat",
    description: "Farm-raised meat, carefully sourced and prepared.",
    image: "/images/hero-goats.jpg",
    href: "/products?category=meat",
  },
];

export default function ProductCategories() {
  return (
    <section className="bg-[#F8F5ED] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-green-700">
            What We Offer
          </p>

          <h2 className="font-[family-name:var(--font-dm-serif)] text-4xl leading-tight text-green-950 sm:text-5xl md:text-6xl">
            Naturally grown.
            <span className="block text-green-700">
              Carefully raised.
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
            Discover fresh, quality products grown and raised with care at
            Shiwa Krishi Farm.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative h-[420px] overflow-hidden rounded-3xl"
            >
              {/* Image */}
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-950/85 via-green-950/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-9">
                <span className="mb-3 inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-sm">
                Farm Fresh
                </span>

                <h3 className="font-[family-name:var(--font-dm-serif)] text-3xl md:text-4xl">
                  {category.name}
                </h3>

                <div className="mt-3 flex items-center justify-between gap-4">
                  <p className="max-w-sm text-sm leading-6 text-white/80">
                    {category.description}
                  </p>

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 text-xl backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-green-900">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}