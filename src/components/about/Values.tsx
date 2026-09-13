import Reveal from "@/components/ui/Reveal";

const values = [
  {
    number: "01",
    title: "Fresh",
    description:
      "We focus on providing fresh farm products with care at every step, from production to your table.",
  },
  {
    number: "02",
    title: "Responsible",
    description:
      "We believe good farming means caring for the land, animals, and people around us.",
  },
  {
    number: "03",
    title: "Ethical",
    description:
      "Our animals are raised with care, respect, and attention to their wellbeing.",
  },
  {
    number: "04",
    title: "Local",
    description:
      "We grow and raise locally so our community can enjoy farm products closer to home.",
  },
];

export default function Values() {
  return (
    <section className="bg-[#F8F5ED] px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <Reveal className="max-w-2xl">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-green-800/20" />

            <span className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
              Our Values
            </span>
          </div>

          <h2 className="mt-5 font-[family-name:var(--font-dm-serif)] text-3xl leading-tight sm:text-4xl md:text-5xl">
            The way we farm matters.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
            Our work is guided by simple principles that help us build a farm
            our community can trust.
          </p>
        </Reveal>

        {/* Values */}
        <Reveal className="mt-14 grid overflow-hidden rounded-[2rem] border border-green-900/10 md:grid-cols-4">
          {values.map((value, index) => (
            <div
              key={value.number}
              className={`p-8 md:p-10 ${
                index !== values.length - 1
                  ? "border-b border-green-900/10 md:border-b-0 md:border-r"
                  : ""
              }`}
            >
              <span className="text-xs font-medium tracking-widest text-green-700">
                {value.number}
              </span>

              <h3 className="mt-8 font-[family-name:var(--font-dm-serif)] text-3xl text-green-950">
                {value.title}
              </h3>

              <p className="mt-4 text-sm leading-6 text-stone-600">
                {value.description}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}