import Image from "next/image";

export default function ProductsHero() {
  return (
    <section className="relative flex min-h-[55vh] items-end overflow-hidden">
      <Image
        src="/images/hero-veggies.jpg"
        alt="Fresh produce from Shiwa Krishi Farm"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-green-950/45" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-40">
        <div className="max-w-3xl">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-white/80">
            Our Products
          </p>

          <h1 className="font-[family-name:var(--font-dm-serif)] text-5xl leading-tight text-white sm:text-6xl md:text-7xl">
            Fresh from
            <span className="block text-[#DDE8D8]">
              our farm.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
            Explore the fresh products we grow and raise at Shiwa Krishi Farm,
            from farm-fresh eggs and milk to goats and seasonal vegetables.
          </p>
        </div>
      </div>
    </section>
  );
}