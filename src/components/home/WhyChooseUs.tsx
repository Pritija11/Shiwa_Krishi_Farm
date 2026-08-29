import {
  Leaf,
  Heart,
  MapPin,
  Sprout,
} from "lucide-react";

const trustPoints = [
  {
    icon: Leaf,
    title: "Fresh From the Farm",
    description:
      "Our products come directly from Shiwa Krishi Farm, helping you enjoy food closer to its source.",
  },
  {
    icon: Heart,
    title: "Raised With Care",
    description:
      "We believe good food begins with responsible care for our animals, crops, and farm.",
  },
  {
    icon: MapPin,
    title: "Local & Trusted",
    description:
      "We are proud to serve our local community with farm products you can know and trust.",
  },
  {
    icon: Sprout,
    title: "Farm to Table",
    description:
      "We keep the journey from our farm to your table simple, transparent, and personal.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-[#173A2A] px-6 py-24 md:py-32">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-green-400/5 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-amber-200/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-green-200/30" />

            <span className="text-xs font-medium uppercase tracking-[0.25em] text-green-200">
              Why Choose Us
            </span>

            <span className="h-px w-10 bg-green-200/30" />
          </div>

          <h2 className="mt-5 font-[family-name:var(--font-dm-serif)] text-4xl leading-tight text-[#F8F5ED] sm:text-5xl md:text-6xl">
            Good food begins
            <span className="block text-green-200">
              with good care.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-green-50/70 sm:text-lg">
            At Shiwa Krishi Farm, we believe trust is built through care,
            quality, and a genuine connection between our farm and your table.
          </p>
        </div>

        {/* Trust Points */}
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((point) => {
            const Icon = point.icon;

            return (
              <div
                key={point.title}
                className="bg-[#173A2A] p-8 transition-colors duration-300 hover:bg-[#1D4734] md:p-10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-green-200/20 bg-green-200/10 text-green-200">
                  <Icon size={21} strokeWidth={1.6} />
                </div>

                <h3 className="mt-6 font-[family-name:var(--font-dm-serif)] text-2xl text-[#F8F5ED]">
                  {point.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-green-50/65">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}