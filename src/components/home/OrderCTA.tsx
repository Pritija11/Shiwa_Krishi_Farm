import Link from "next/link";

export default function OrderCTA() {
  return (
    <section className="relative overflow-hidden bg-[#F8F5ED] px-6 py-24 md:py-32">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-900/5 blur-3xl" />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Label */}
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-green-800/20" />

          <span className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
            From Our Farm To You
          </span>

          <span className="h-px w-10 bg-green-800/20" />
        </div>

        {/* Heading */}
        <h2 className="mt-6 font-[family-name:var(--font-dm-serif)] text-4xl leading-tight text-green-950 sm:text-5xl md:text-6xl">
          Bring the goodness of our farm
          <span className="block text-green-700">
            to your table.
          </span>
        </h2>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
          Fresh farm products, carefully grown and raised with care.
          Get in touch with us to place your order or learn more.
        </p>

        {/* Actions */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/order"
            className="inline-flex min-w-40 items-center justify-center rounded-full bg-green-800 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-green-900 hover:shadow-lg"
          >
            Order Now
            <span className="ml-2">→</span>
          </Link>

          <Link
            href="/contact"
            className="inline-flex min-w-40 items-center justify-center rounded-full border border-green-800/30 bg-white/60 px-7 py-3.5 text-sm font-medium text-green-900 transition-all duration-300 hover:border-green-800 hover:bg-white"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}