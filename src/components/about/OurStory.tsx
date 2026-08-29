import Image from "next/image";

export default function OurStory() {
  return (
    <section className="bg-[#F8F5ED] px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-2 md:items-center">
        
        {/* Text */}
        <div>
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-green-800/20" />

            <span className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
              Our Story
            </span>
          </div>

          <h2 className="mt-5 max-w-xl font-[family-name:var(--font-dm-serif)] text-4xl leading-tight sm:text-5xl">
            A farm built around care, quality, and community.
          </h2>

          <div className="mt-7 space-y-5 text-base leading-7 text-stone-600">
            <p>
              Shiwa Krishi Farm is a local mixed farm focused on producing
              fresh, quality food for our community.
            </p>

            <p>
              From raising poultry and goats to producing fresh cow milk and
              seasonal vegetables, our work follows the natural rhythm of
              farming.
            </p>

            <p>
              We believe customers should know where their food comes from and
              how it is produced. That is why we value transparency,
              freshness, and responsible farming.
            </p>
          </div>
        </div>

        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
          <Image
            src="/images/farm-about.jpg"
            alt="Life at Shiwa Krishi Farm"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}