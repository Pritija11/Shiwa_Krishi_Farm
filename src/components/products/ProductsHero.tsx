import Image from "next/image";

export default function ProductsHero() {
  return (
    <section className="relative flex min-h-[32vh] items-end overflow-hidden sm:min-h-[36vh]">
      <Image
        src="/images/hero-veggies.jpg"
        alt="Fresh produce from Shiwa Krishi Farm"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-green-950/45" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-10 pt-28 md:pb-12 md:pt-32">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-white/80">
            Our Products
          </p>

          <h1 className="font-[family-name:var(--font-dm-serif)] text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
            Fresh from
            <span className="block text-[#DDE8D8]">
              our farm.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
            Explore the fresh products we grow and raise at Shiwa Krishi Farm,
            from farm-fresh eggs and milk to goats and seasonal vegetables.
          </p>
        </div>
      </div>
    </section>
  );
}