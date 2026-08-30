import Link from "next/link";

export default function AboutCTA() {
  return (
    <section className="bg-green-950 px-6 py-24 text-center md:py-28">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#DDE8D8]">
          From our farm to your table
        </p>

        <h2 className="mt-5 font-[family-name:var(--font-dm-serif)] text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
          Want to know what&apos;s fresh?
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
          Explore our farm products or get in touch with us to learn more about
          what is currently available.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/products"
            className="rounded-full bg-white px-7 py-3.5 text-sm font-medium text-green-950 transition hover:bg-[#DDE8D8]"
          >
            Explore Products
          </Link>

          <Link
            href="/contact"
            className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
