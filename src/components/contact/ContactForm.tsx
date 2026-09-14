"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  buildWhatsAppMessage,
  closeWhatsAppWindow,
  createWhatsAppUrl,
  isWhatsAppConfigured,
  openBlankWhatsAppWindow,
  redirectToWhatsApp,
} from "@/lib/whatsapp";
import { fetchJsonWithTimeout } from "@/lib/fetchJson";
import { contactSchema } from "@/validations/contact";

type ContactFormProps = {
  whatsapp: string;
};

type FormErrors = Partial<Record<string, string>>;

export default function ContactForm({ whatsapp }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setStatus("idle");
    setFieldErrors({});

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
      acceptTerms: formData.get("acceptTerms") === "on",
    };

    const validation = contactSchema.safeParse(data);

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
      const response = await fetchJsonWithTimeout("/api/contact", {
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

        throw new Error(result?.error || "Failed to send message");
      }

      const whatsappMessage = buildWhatsAppMessage([
        "Hello, I would like to contact Shiwa Krishi Farm.",
        "",
        validation.data.subject ? `Subject: ${validation.data.subject}` : "",
        `Name: ${validation.data.name}`,
        validation.data.phone ? `Phone: ${validation.data.phone}` : "",
        validation.data.email ? `Email: ${validation.data.email}` : "",
        "",
        `Message: ${validation.data.message}`,
        "",
        "Thank you.",
      ]);

      const whatsappUrl = createWhatsAppUrl(whatsapp, whatsappMessage);

      setStatus("success");
      form.reset();

      setTimeout(() => {
        redirectToWhatsApp(whatsappWindow, whatsappUrl);
      }, 1000);

      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Contact submission error:", error);
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
            Full Name <span className="text-red-600">*</span>
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
          />

          {fieldErrors.name && (
            <p className="mt-1.5 text-xs text-red-600">
              {fieldErrors.name}
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
            className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
          />

          {fieldErrors.phone && (
            <p className="mt-1.5 text-xs text-red-600">
              {fieldErrors.phone}
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
            className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
          />

          {fieldErrors.email && (
            <p className="mt-1.5 text-xs text-red-600">
              {fieldErrors.email}
            </p>
          )}
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

          {fieldErrors.subject && (
            <p className="mt-1.5 text-xs text-red-600">
              {fieldErrors.subject}
            </p>
          )}
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="text-sm font-medium text-green-950"
          >
            Message <span className="text-red-600">*</span>
          </label>

          <textarea
            id="message"
            name="message"
            rows={5}
            required
            placeholder="Tell us how we can help..."
            className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
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

      {/* Error */}
      {status === "error" && (
        <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage || "Something went wrong. Please try again."}
        </div>
      )}

      {/* Success */}
      {status === "success" && (
        <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
          Your message is submitted successfully. Opening WhatsApp...
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
