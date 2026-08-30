import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="relative flex min-h-[70vh] items-end overflow-hidden">
      <Image
        src="/images/farm-about.jpg"
        alt="Shiwa Krishi Farm"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-green-950/45" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-40">
        <div className="max-w-3xl">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-white/80">
            About Shiwa Krishi Farm
          </p>

          <h1 className="font-[family-name:var(--font-dm-serif)] text-5xl leading-tight text-white sm:text-6xl md:text-7xl">
            Rooted in the land,
            <span className="block text-[#DDE8D8]">
              grown with care.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
            We are a local mixed farm bringing together poultry, goats,
            fresh dairy, and seasonal vegetables with a simple belief:
            good food starts with good care.
          </p>
        </div>
      </div>
    </section>
  );
}