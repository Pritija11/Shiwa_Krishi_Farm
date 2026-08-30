import Link from "next/link";

export default function MilkSubscriptionPage() {
  return (
    <main className="bg-[#F8F5ED]">
      {/* Hero */}
      <section className="px-6 pb-20 pt-36 md:pb-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-green-800">
            Fresh Milk
          </p>

          <h1 className="mt-4 font-[family-name:var(--font-dm-serif)] text-5xl leading-tight text-green-950 sm:text-6xl md:text-7xl">
            Fresh milk,
            <span className="block text-green-800">
              delivered regularly.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
            Enjoy fresh cow milk from our farm with a simple daily or weekly
            delivery subscription.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
              Simple &amp; Fresh
            </p>

            <h2 className="mt-3 font-[family-name:var(--font-dm-serif)] text-4xl text-green-950 sm:text-5xl">
              How it works
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-stone-200 bg-[#F8F5ED] p-7">
              <span className="text-sm font-medium text-green-800">01</span>

              <h3 className="mt-8 font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
                Choose your plan
              </h3>

              <p className="mt-3 text-sm leading-6 text-stone-600">
                Choose whether you would like fresh milk delivered daily or
                weekly.
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-[#F8F5ED] p-7">
              <span className="text-sm font-medium text-green-800">02</span>

              <h3 className="mt-8 font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
                Tell us your needs
              </h3>

              <p className="mt-3 text-sm leading-6 text-stone-600">
                Let us know your preferred quantity, delivery area, and start
                date.
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-[#F8F5ED] p-7">
              <span className="text-sm font-medium text-green-800">03</span>

              <h3 className="mt-8 font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
                Receive fresh milk
              </h3>

              <p className="mt-3 text-sm leading-6 text-stone-600">
                We&apos;ll confirm your subscription and arrange your regular
                delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Form */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-green-800">
              Get Started
            </p>

            <h2 className="mt-4 font-[family-name:var(--font-dm-serif)] text-4xl text-green-950 sm:text-5xl">
              Start your milk subscription
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
              Send us your details and we&apos;ll contact you to confirm
              availability, pricing, and delivery.
            </p>
          </div>

          <form className="mt-10 rounded-[2rem] border border-stone-200/80 bg-white p-6 shadow-sm sm:p-10">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-green-950"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-green-950"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="98XXXXXXXX"
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="text-sm font-medium text-green-950"
                >
                  Delivery Address / Area
                </label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  placeholder="Your delivery area"
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
                />
              </div>

              {/* Frequency */}
              <div>
                <label
                  htmlFor="frequency"
                  className="text-sm font-medium text-green-950"
                >
                  Delivery Frequency
                </label>

                <select
                  id="frequency"
                  name="frequency"
                  required
                  defaultValue=""
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
                >
                  <option value="" disabled>
                    Select frequency
                  </option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label
                  htmlFor="quantity"
                  className="text-sm font-medium text-green-950"
                >
                  Quantity
                </label>

                <input
                  id="quantity"
                  name="quantity"
                  type="text"
                  required
                  placeholder="e.g. 1 litre"
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
                />
              </div>

              {/* Start Date */}
              <div>
                <label
                  htmlFor="startDate"
                  className="text-sm font-medium text-green-950"
                >
                  Preferred Start Date
                </label>

                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-green-950"
                >
                  Additional Message
                </label>

                <input
                  id="message"
                  name="message"
                  type="text"
                  placeholder="Anything else?"
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 w-full rounded-full bg-green-900 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-green-800"
            >
              Request Subscription
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-stone-500">
              We&apos;ll contact you to confirm your subscription details.
            </p>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-950 px-6 py-20 text-center md:py-24">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#DDE8D8]">
            From our farm to your table
          </p>

          <h2 className="mt-4 font-[family-name:var(--font-dm-serif)] text-4xl text-white sm:text-5xl">
            Prefer to talk to us first?
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/70">
            Get in touch with us directly to ask about today&apos;s milk
            availability and delivery options.
          </p>

          <Link
            href="/contact"
            className="mt-7 inline-block rounded-full bg-white px-7 py-3.5 text-sm font-medium text-green-950 transition hover:bg-[#DDE8D8]"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}