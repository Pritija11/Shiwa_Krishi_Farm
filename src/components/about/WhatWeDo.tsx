import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { prisma } from "@/lib/prisma";
import { getS3Url } from "@/lib/s3-url";

// Display copy for each known category slug. The section only ever shows
// these four tiles; a category without a matching slug here is skipped.
const ACTIVITY_DISPLAY: Record<
  string,
  { title: string; description: string; fallbackImage: string }
> = {
  poultry: {
    title: "Poultry & Eggs",
    description: "Fresh chicken and farm-raised eggs from our poultry.",
    fallbackImage: "/images/poultry.jpg",
  },
  goats: {
    title: "Goats",
    description: "Healthy goats raised with care on our farm.",
    fallbackImage: "/images/hero-goats.jpg",
  },
  dairy: {
    title: "Fresh Milk",
    description: "Fresh cow milk produced and collected from our farm.",
    fallbackImage: "/images/hero-dairy.webp",
  },
  vegetables: {
    title: "Seasonal Vegetables",
    description: "Fresh vegetables grown according to the season.",
    fallbackImage: "/images/hero-veggies.jpg",
  },
};

const ACTIVITY_ORDER = ["poultry", "goats", "dairy", "vegetables"];

async function getFarmActivities() {
  const categories = await prisma.category.findMany({
    where: { slug: { in: ACTIVITY_ORDER } },
  });

  const bySlug = new Map(categories.map((category) => [category.slug, category]));

  return Promise.all(
    ACTIVITY_ORDER.filter((slug) => ACTIVITY_DISPLAY[slug]).map(
      async (slug) => {
        const display = ACTIVITY_DISPLAY[slug];
        const category = bySlug.get(slug);

        return {
          title: display.title,
          description: display.description,
          image: category?.imageUrl
            ? await getS3Url(category.imageUrl)
            : display.fallbackImage,
        };
      }
    )
  );
}

export default async function WhatWeDo() {
  const farmActivities = await getFarmActivities();

  return (
    <section className="bg-[#E8EDE3] px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <Reveal className="max-w-2xl">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-green-800/20" />

            <span className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
              What We Do
            </span>
          </div>

          <h2 className="mt-5 font-[family-name:var(--font-dm-serif)] text-3xl leading-tight sm:text-4xl md:text-5xl">
            From our farm to your table.
          </h2>

          <p className="mt-5 text-base leading-7 text-stone-600 sm:text-lg">
            We raise and grow a range of farm products throughout the year,
            with availability naturally changing with the seasons.
          </p>
        </Reveal>

        {/* Farm Activities */}
        <Reveal className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {farmActivities.map((activity) => (
            <article
              key={activity.title}
              className="group overflow-hidden rounded-[1.5rem] border border-green-900/10 bg-[#F8F5ED]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={activity.image}
                  alt={activity.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <h3 className="font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
                  {activity.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {activity.description}
                </p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}