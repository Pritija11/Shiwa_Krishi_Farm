import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { prisma } from "@/lib/prisma";
import { getS3Url } from "@/lib/s3-url";

// Display copy for each known category slug. The section only ever shows
// these four tiles; a category without a matching slug here is skipped.
const CATEGORY_DISPLAY: Record<
  string,
  { name: string; description: string; fallbackImage: string }
> = {
  vegetables: {
    name: "Fresh Vegetables",
    description: "Seasonal produce grown fresh on our farm.",
    fallbackImage: "/images/hero-veggies.jpg",
  },
  dairy: {
    name: "Fresh Dairy",
    description: "Fresh, wholesome milk from our farm.",
    fallbackImage: "/images/hero-dairy.webp",
  },
  poultry: {
    name: "Poultry",
    description: "Quality farm-raised poultry products.",
    fallbackImage: "/images/poultry.jpg",
  },
  goats: {
    name: "Goats",
    description: "Farm-raised goat meat, carefully sourced and prepared.",
    fallbackImage: "/images/hero-goats.jpg",
  },
};

const CATEGORY_ORDER = ["vegetables", "dairy", "poultry", "goats"];

async function getCategoryTiles() {
  const categories = await prisma.category.findMany({
    where: { slug: { in: CATEGORY_ORDER } },
  });

  const bySlug = new Map(categories.map((category) => [category.slug, category]));

  return Promise.all(
    CATEGORY_ORDER.filter((slug) => CATEGORY_DISPLAY[slug]).map(
      async (slug) => {
        const display = CATEGORY_DISPLAY[slug];
        const category = bySlug.get(slug);

        return {
          slug,
          name: display.name,
          description: display.description,
          href: `/products?category=${slug}`,
          image: category?.imageUrl
            ? await getS3Url(category.imageUrl)
            : display.fallbackImage,
        };
      }
    )
  );
}

export default async function ProductCategories() {
  const categories = await getCategoryTiles();

  return (
    <section className="bg-[#F8F5ED] px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <Reveal className="mb-14 max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-green-700">
            What We Offer
          </p>

          <h2 className="font-[family-name:var(--font-dm-serif)] text-3xl leading-tight text-green-950 sm:text-4xl md:text-5xl">
            Naturally grown.
            <span className="block text-green-700">
              Carefully raised.
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
            Discover fresh, quality products grown and raised with care at
            Shiwa Krishi Farm.
          </p>
        </Reveal>

        {/* Category Grid */}
        <Reveal className="grid grid-cols-2 gap-3 sm:gap-5">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[4/3] sm:rounded-3xl lg:aspect-video"
            >
              {/* Image */}
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 40vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-950/85 via-green-950/20 to-transparent" />

              {/* Badge */}
              <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider text-green-950 shadow-sm sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[11px]">
                Farm Fresh
              </span>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-7 md:p-9">
                <h3 className="font-[family-name:var(--font-dm-serif)] text-lg leading-tight sm:text-3xl md:text-4xl">
                  {category.name}
                </h3>

                <div className="mt-2 flex items-end justify-between gap-3 sm:mt-3 sm:items-center sm:gap-4">
                  <p className="hidden max-w-sm text-sm leading-6 text-white/80 sm:block">
                    {category.description}
                  </p>

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 text-base backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-green-900 sm:h-11 sm:w-11 sm:text-xl">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
