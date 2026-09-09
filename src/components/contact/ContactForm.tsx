"use client";

import { FormEvent, useState } from "react";
import { createWhatsAppUrl } from "@/lib/whatsapp";

type ContactFormProps = {
  whatsapp: string;
};

export default function ContactForm({ whatsapp }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setSuccess(false);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      const whatsappMessage = [
        "Hello, I would like to contact Shiwa Krishi Farm.",
        "",
        data.subject ? `Subject: ${data.subject}` : "",
        `Name: ${data.name}`,
        data.phone ? `Phone: ${data.phone}` : "",
        data.email ? `Email: ${data.email}` : "",
        "",
        `Message: ${data.message}`,
        "",
        "Thank you.",
      ]
        .filter(Boolean)
        .join("\n");

      const whatsappUrl = createWhatsAppUrl(
        whatsapp,
        whatsappMessage
      );

      setSuccess(true);
      form.reset();

      setTimeout(() => {
        window.location.href = whatsappUrl;
      }, 1000);
    } catch (error) {
      console.error("Contact submission error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-10"
    >
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
            placeholder="98XXXXXXXX"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
          />
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
            className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
          />
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="text-sm font-medium text-green-950"
          >
            Subject
          </label>

          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="How can we help?"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
          />
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="text-sm font-medium text-green-950"
          >
            Message
          </label>

          <textarea
            id="message"
            name="message"
            rows={5}
            required
            placeholder="Tell us how we can help..."
            className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
          Your message was saved successfully. Opening WhatsApp...
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 w-full rounded-full bg-green-900 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Preparing WhatsApp..." : "Contact via WhatsApp"}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-stone-500">
        Your message will be saved, then WhatsApp will open with your message
        ready to send.
      </p>
    </form>
  );
}