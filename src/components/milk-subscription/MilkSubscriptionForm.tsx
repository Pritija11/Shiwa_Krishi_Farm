"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  buildWhatsAppMessage,
  closeWhatsAppWindow,
  createWhatsAppUrl,
  isWhatsAppConfigured,
  openBlankWhatsAppWindow,
  redirectToWhatsApp,
} from "@/lib/whatsapp";
import { fetchJsonWithTimeout } from "@/lib/fetchJson";
import { subscriptionSchema } from "@/validations/subscription";
import {
  dayOfWeekOrder,
  formatDeliveryDays,
  formatDuration,
  type DayOfWeek,
} from "@/lib/subscription-duration";
import Reveal from "@/components/ui/Reveal";

type Product = {
  id: string;
  name: string;
};

type MilkSubscriptionFormProps = {
  whatsapp: string;
  phone: string;
  deliveryAreas: string;
  deliveryDays: string;
  products: Product[];
  isAvailable: boolean;
};

type FormErrors = Partial<Record<string, string>>;

const dayLabels: Record<DayOfWeek, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

const frequencyLabels: Record<string, string> = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  CUSTOM: "Custom Days",
};

function formatStartDateForMessage(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// The server returns the created subscription's endDate as a full ISO
// timestamp (stored as UTC midnight); format it in UTC so the displayed
// calendar date always matches what was actually stored, regardless of
// the customer's own local timezone.
function formatIsoDateForMessage(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function MilkSubscriptionForm({
  whatsapp,
  phone,
  deliveryAreas,
  deliveryDays,
  products,
  isAvailable,
}: MilkSubscriptionFormProps) {
  const infoItems = [
    deliveryAreas ? `Delivering to ${deliveryAreas}` : null,
    deliveryDays ? deliveryDays : null,
  ].filter((item): item is string => Boolean(item));

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [frequency, setFrequency] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const showDeliveryDays = frequency === "WEEKLY" || frequency === "CUSTOM";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setStatus("idle");
    setFieldErrors({});

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      customerName: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      deliveryAddress: String(formData.get("address") || ""),
      productId: String(formData.get("productId") || ""),
      quantity: Number(formData.get("quantity")),
      frequency: String(formData.get("frequency") || ""),
      deliveryDays: formData.getAll("deliveryDays").map(String),
      startDate: String(formData.get("startDate") || ""),
      duration: String(formData.get("duration") || ""),
      message: String(formData.get("message") || ""),
      acceptTerms: formData.get("acceptTerms") === "on",
    };

    const validation = subscriptionSchema.safeParse(data);

    if (!validation.success) {
      const errors: FormErrors = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (typeof field === "string" && !errors[field]) {
          errors[field] = issue.message;
        }
      });

      setFieldErrors(errors);
      setIsSubmitting(false);

      return;
    }

    if (!isWhatsAppConfigured(whatsapp)) {
      setErrorMessage(
        "WhatsApp is not configured right now. Please try again later or contact us by phone."
      );
      setStatus("error");
      setIsSubmitting(false);

      setTimeout(() => {
        setStatus("idle");
      }, 2000);

      return;
    }

    // Opened synchronously (before any await) so the browser still treats
    // this as a direct result of the user's click and doesn't block it.
    const whatsappWindow = openBlankWhatsAppWindow();

    try {
      const response = await fetchJsonWithTimeout("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        closeWhatsAppWindow(whatsappWindow);

        if (result?.fields) {
          const errors: FormErrors = {};

          for (const [field, messages] of Object.entries(
            result.fields as Record<string, string[]>
          )) {
            if (Array.isArray(messages) && messages[0]) {
              errors[field] = messages[0];
            }
          }

          setFieldErrors(errors);
          setIsSubmitting(false);

          return;
        }

        throw new Error(result?.error || "Failed to submit subscription");
      }

      const selectedProduct = products.find(
        (product) => product.id === validation.data.productId
      );

      const durationLabel = result?.endDate
        ? `${formatDuration(validation.data.duration)} (ends ${formatIsoDateForMessage(result.endDate)})`
        : formatDuration(validation.data.duration);

      const whatsappMessage = buildWhatsAppMessage([
        "Hello, I would like to request a milk subscription.",
        "",
        `Product: ${selectedProduct?.name ?? "Milk"}`,
        `Quantity: ${validation.data.quantity} L`,
        `Frequency: ${frequencyLabels[validation.data.frequency]}`,
        validation.data.deliveryDays.length > 0
          ? `Delivery Days: ${formatDeliveryDays(validation.data.deliveryDays)}`
          : "",
        `Start Date: ${formatStartDateForMessage(validation.data.startDate)}`,
        `Duration: ${durationLabel}`,
        `Delivery Address: ${validation.data.deliveryAddress}`,
        validation.data.message
          ? `Additional Message: ${validation.data.message}`
          : "",
        "",
        "Thank you.",
      ]);

      const whatsappUrl = createWhatsAppUrl(whatsapp, whatsappMessage);

      setStatus("success");
      form.reset();
      setFrequency("");

      setTimeout(() => {
        redirectToWhatsApp(whatsappWindow, whatsappUrl);
      }, 1000);

      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Subscription submission error:", error);
      closeWhatsAppWindow(whatsappWindow);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
      setStatus("error");

      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="bg-[#F8F5ED]">
      {/* Hero */}
      <section className="px-6 pb-10 pt-28 md:pb-12 md:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-green-800">
            Fresh Milk
          </p>

          <h1 className="mt-4 font-[family-name:var(--font-dm-serif)] text-4xl leading-tight text-green-950 sm:text-5xl md:text-6xl">
            Fresh milk,
            <span className="block text-green-800">
              delivered regularly.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
            Enjoy fresh cow milk from our farm with a simple daily, weekly,
            or custom delivery subscription.
          </p>

          {infoItems.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-stone-600">
              {infoItems.map((item, index) => (
                <span key={item} className="flex items-center gap-3">
                  {index > 0 && (
                    <span className="text-stone-300">•</span>
                  )}
                  <span>{item}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white px-6 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
              Simple &amp; Fresh
            </p>

            <h2 className="mt-3 font-[family-name:var(--font-dm-serif)] text-3xl text-green-950 sm:text-4xl md:text-5xl">
              How it works
            </h2>
          </Reveal>

          <Reveal className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-stone-200 bg-[#F8F5ED] p-7">
              <span className="text-sm font-medium text-green-800">01</span>

              <h3 className="mt-8 font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
                Choose your plan
              </h3>

              <p className="mt-3 text-sm leading-6 text-stone-600">
                Choose daily, weekly, or custom delivery days, and how long
                you&apos;d like your subscription to run.
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
          </Reveal>
        </div>
      </section>

      {/* Subscription Form */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <Reveal className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-green-800">
              Get Started
            </p>

            <h2 className="mt-4 font-[family-name:var(--font-dm-serif)] text-3xl text-green-950 sm:text-4xl md:text-5xl">
              Start your milk subscription
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
              Send us your details and we&apos;ll contact you to confirm
              availability, pricing, and delivery.
            </p>
          </Reveal>

          <Reveal>
          {isAvailable ? (
          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-[2rem] border border-stone-200/80 bg-white p-5 shadow-sm sm:p-8"
          >
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {/* Product */}
              <div className="col-span-2">
                <label
                  htmlFor="productId"
                  className="text-sm font-medium text-green-950"
                >
                  Product <span className="text-red-600">*</span>
                </label>

                <select
                  id="productId"
                  name="productId"
                  required
                  defaultValue=""
                  className="mt-2 w-full truncate rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
                >
                  <option value="" disabled>
                    Select
                  </option>

                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>

                {fieldErrors.productId && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {fieldErrors.productId}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label
                  htmlFor="quantity"
                  className="text-sm font-medium text-green-950"
                >
                  Quantity (L) <span className="text-red-600">*</span>
                </label>

                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0.1"
                  step="0.1"
                  required
                  placeholder="e.g. 2"
                  className="mt-2 w-full truncate rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
                />

                {fieldErrors.quantity && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {fieldErrors.quantity}
                  </p>
                )}
              </div>

              {/* Frequency */}
              <div>
                <label
                  htmlFor="frequency"
                  className="text-sm font-medium text-green-950"
                >
                  Frequency <span className="text-red-600">*</span>
                </label>

                <select
                  id="frequency"
                  name="frequency"
                  required
                  value={frequency}
                  onChange={(event) => setFrequency(event.target.value)}
                  className="mt-2 w-full truncate rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
                >
                  <option value="" disabled>
                    Select
                  </option>

                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="CUSTOM">Custom days</option>
                </select>

                {fieldErrors.frequency && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {fieldErrors.frequency}
                  </p>
                )}
              </div>

              {/* Delivery Days */}
              {showDeliveryDays && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-green-950">
                    Delivery Days <span className="text-red-600">*</span>
                  </label>

                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {dayOfWeekOrder.map((day) => (
                      <label
                        key={day}
                        className="flex items-center gap-2 rounded-lg border border-stone-200 bg-[#F8F5ED] px-3 py-2.5 text-sm text-green-950"
                      >
                        <input
                          type="checkbox"
                          name="deliveryDays"
                          value={day}
                          className="h-4 w-4 accent-green-800"
                        />
                        {dayLabels[day]}
                      </label>
                    ))}
                  </div>

                  {fieldErrors.deliveryDays && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {fieldErrors.deliveryDays}
                    </p>
                  )}
                </div>
              )}

              {/* Start Date */}
              <div>
                <label
                  htmlFor="startDate"
                  className="text-sm font-medium text-green-950"
                >
                  Start Date <span className="text-red-600">*</span>
                </label>

                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  min={today}
                  required
                  className="mt-2 w-full truncate rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
                />

                {fieldErrors.startDate && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {fieldErrors.startDate}
                  </p>
                )}
              </div>

              {/* Duration */}
              <div>
                <label
                  htmlFor="duration"
                  className="text-sm font-medium text-green-950"
                >
                  Duration <span className="text-red-600">*</span>
                </label>

                <select
                  id="duration"
                  name="duration"
                  required
                  defaultValue=""
                  className="mt-2 w-full truncate rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
                >
                  <option value="" disabled>
                    Select
                  </option>

                  <option value="ONGOING">Ongoing</option>
                  <option value="ONE_MONTH">1 month</option>
                  <option value="THREE_MONTHS">3 months</option>
                  <option value="SIX_MONTHS">6 months</option>
                </select>

                {fieldErrors.duration && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {fieldErrors.duration}
                  </p>
                )}
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-green-950"
                >
                  Full Name <span className="text-red-600">*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="mt-2 w-full truncate rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
                />

                {fieldErrors.customerName && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {fieldErrors.customerName}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-green-950"
                >
                  Phone Number <span className="text-red-600">*</span>
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="98XXXXXXXX"
                  className="mt-2 w-full truncate rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
                />

                {fieldErrors.phone && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="col-span-2">
                <label
                  htmlFor="address"
                  className="text-sm font-medium text-green-950"
                >
                  Delivery Address / Area{" "}
                  <span className="text-red-600">*</span>
                </label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  placeholder="Your delivery area"
                  className="mt-2 w-full truncate rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
                />

                {fieldErrors.deliveryAddress && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {fieldErrors.deliveryAddress}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-green-950"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full truncate rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
                />

                {fieldErrors.email && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-green-950"
                >
                  Message
                </label>

                <input
                  id="message"
                  name="message"
                  type="text"
                  placeholder="Anything else?"
                  className="mt-2 w-full truncate rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
                />

                {fieldErrors.message && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {fieldErrors.message}
                  </p>
                )}
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="mt-6 flex items-start gap-3">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone-300 accent-green-800"
              />

              <label
                htmlFor="acceptTerms"
                className="text-sm leading-5 text-stone-600"
              >
                I have read and agree to the{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-green-800 underline underline-offset-2 hover:text-green-900"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="/terms"
                  className="font-medium text-green-800 underline underline-offset-2 hover:text-green-900"
                >
                  Terms &amp; Conditions
                </Link>
                .
              </label>
            </div>

            {fieldErrors.acceptTerms && (
              <p className="mt-1.5 text-xs text-red-600">
                {fieldErrors.acceptTerms}
              </p>
            )}

            {/* Status Message */}
            {status === "success" && (
              <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-800">
                Your milk subscription request is submitted. Opening WhatsApp...
              </div>
            )}

            {status === "error" && (
              <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
                {errorMessage || "Something went wrong. Please try again."}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 w-full rounded-full bg-green-900 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Preparing WhatsApp..." : "Subscribe via WhatsApp"}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-stone-500">
              Your subscription request will be saved, then WhatsApp will
              open with your details ready to send.
            </p>
          </form>
          ) : (
            <div className="mt-10 rounded-[2rem] border border-stone-200/80 bg-white p-10 text-center shadow-sm">
              <h3 className="font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
                Milk subscriptions aren&apos;t available right now
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-stone-600">
                We&apos;re not taking new milk subscription requests at the
                moment. Please check back soon, or reach out to us directly
                and we&apos;ll let you know when it&apos;s available again.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="rounded-full bg-green-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-800"
                  >
                    Call Us
                  </a>
                )}

                <Link
                  href="/contact"
                  className="rounded-full border border-green-900/20 px-6 py-3 text-sm font-medium text-green-900 transition hover:bg-green-900/5"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          )}
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-950 px-6 py-16 text-center md:py-24">
        <Reveal className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#DDE8D8]">
            From our farm to your table
          </p>

          <h2 className="mt-4 font-[family-name:var(--font-dm-serif)] text-3xl text-white sm:text-4xl md:text-5xl">
            Prefer to talk to us first?
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/70">
            Get in touch with us directly to ask about today&apos;s milk
            availability and delivery options.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="inline-block rounded-full bg-white px-7 py-3.5 text-sm font-medium text-green-950 transition hover:bg-[#DDE8D8]"
              >
                Call Us
              </a>
            )}

            <Link
              href="/contact"
              className="inline-block rounded-full border border-white/30 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
