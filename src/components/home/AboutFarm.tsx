import Image from "next/image";
import Link from "next/link";
import { Sprout, Tractor, HeartHandshake } from "lucide-react";

const values = [
  {
    icon: Sprout,
    title: "Our Vision",
    description: "Growing a healthier and more sustainable future.",
  },
  {
    icon: Tractor,
    title: "Our Mission",
    description: "Providing fresh, quality products with care.",
  },
  {
    icon: HeartHandshake,
    title: "Our Values",
    description: "Quality, honesty, care, and respect for nature.",
  },
];

export default function AboutFarm() {
  return (
    <section className="bg-[#EFE8DA] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Farm Image */}
          <div className="relative h-[480px] overflow-hidden rounded-3xl md:h-[560px]">
            <Image
              src="/images/farm-about.jpg"
              alt="Shiwa Krishi Farm"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top"
            />
          </div>

          {/* Content */}
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-green-700">
              About Our Farm
            </p>

            <h2 className="font-[family-name:var(--font-dm-serif)] text-4xl leading-tight text-green-950 sm:text-5xl md:text-6xl">
              Rooted in nature.
              <span className="block text-green-700">Raised with care.</span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
              At Shiwa Krishi Farm, we believe good food starts with good
              farming. We care for our land, animals, and crops so that we can
              bring fresh and quality farm products to your table.
            </p>

            <Link
              href="/about"
              className="mt-7 inline-flex items-center rounded-full bg-green-800 px-6 py-3 font-medium text-white transition hover:bg-green-900"
            >
              Discover Our Farm
              <span className="ml-2">→</span>
            </Link>

            {/* Vision / Mission / Values */}
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <div
                    key={value.title}
                    className="rounded-2xl border border-green-900/10 bg-white/25 p-5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDE8D8] text-green-800">
                      <Icon size={20} strokeWidth={1.8} />
                    </div>

                    <h3 className="mt-4 font-[family-name:var(--font-dm-serif)] text-xl text-green-950">
                      {value.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
