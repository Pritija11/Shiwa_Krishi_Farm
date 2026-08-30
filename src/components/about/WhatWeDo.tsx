import Image from "next/image";

const farmActivities = [
  {
    title: "Poultry & Eggs",
    description: "Fresh chicken and farm-raised eggs from our poultry.",
    image: "/images/hero-poultry.jpg",
  },
  {
    title: "Goats",
    description: "Healthy goats raised with care on our farm.",
    image: "/images/hero-goats.jpg",
  },
  {
    title: "Fresh Milk",
    description: "Fresh cow milk produced and collected from our farm.",
    image: "/images/hero-dairy.jpg",
  },
  {
    title: "Seasonal Vegetables",
    description: "Fresh vegetables grown according to the season.",
    image: "/images/hero-veggies.jpg",
  },
];

export default function WhatWeDo() {
  return (
    <section className="bg-[#E8EDE3] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-green-800/20" />

            <span className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
              What We Do
            </span>
          </div>

          <h2 className="mt-5 font-[family-name:var(--font-dm-serif)] text-4xl leading-tight sm:text-5xl">
            From our farm to your table.
          </h2>

          <p className="mt-5 text-base leading-7 text-stone-600 sm:text-lg">
            We raise and grow a range of farm products throughout the year,
            with availability naturally changing with the seasons.
          </p>
        </div>

        {/* Farm Activities */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>
      </div>
    </section>
  );
}