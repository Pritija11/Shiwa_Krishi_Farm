"use client";

import { useState } from "react";
import { enquirySchema } from "@/validations/enquiry";

type Product = {
  id: string;
  name: string;
};

type OrderFormProps = {
  products: Product[];
  selectedProduct?: string;
};

type FormErrors = Partial<Record<string, string>>;

type Toast = {
  type: "success" | "error";
  message: string;
};

export default function OrderForm({
  products,
  selectedProduct = "",
}: OrderFormProps) {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<Toast | null>(null);

  const today = new Date().toISOString().split("T")[0];

  function showToast(type: Toast["type"], message: string) {
    setToast({
      type,
      message,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setFieldErrors({});
    setToast(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      customerName: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      productId: String(formData.get("product") || ""),
      quantity: Number(formData.get("quantity")),
      deliveryAddress: String(formData.get("address") || ""),
      preferredDate: String(formData.get("preferredDate") || ""),
      message: String(formData.get("message") || ""),
    };

    // Frontend Zod validation
    const validation = enquirySchema.safeParse(data);

    if (!validation.success) {
      const errors: FormErrors = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (typeof field === "string" && !errors[field]) {
          errors[field] = issue.message;
        }
      });

      setFieldErrors(errors);
      setLoading(false);

      return;
    }

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to send enquiry."
        );
      }

      form.reset();

      showToast(
        "success",
        "Your enquiry has been sent successfully!"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div
          role="alert"
          className={`fixed right-4 top-6 z-50 w-[calc(100%-2rem)] max-w-sm rounded-2xl border px-5 py-4 shadow-lg ${
            toast.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg">
              {toast.type === "success" ? "✓" : "!"}
            </span>

            <p className="text-sm font-medium leading-5">
              {toast.message}
            </p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-12 rounded-[2rem] border border-stone-200/80 bg-white p-6 shadow-sm sm:p-10"
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

          {/* Product */}
          <div>
            <label
              htmlFor="product"
              className="text-sm font-medium text-green-950"
            >
              Product
            </label>

            <select
              id="product"
              name="product"
              required
              defaultValue={selectedProduct}
              className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
            >
              <option value="" disabled>
                Select a product
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
              Quantity
            </label>

            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="e.g. 2"
              className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
            />

            {fieldErrors.quantity && (
              <p className="mt-1.5 text-xs text-red-600">
                {fieldErrors.quantity}
              </p>
            )}
          </div>

          {/* Delivery Address */}
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

            {fieldErrors.deliveryAddress && (
              <p className="mt-1.5 text-xs text-red-600">
                {fieldErrors.deliveryAddress}
              </p>
            )}
          </div>

          {/* Preferred Date */}
          <div>
            <label
              htmlFor="preferredDate"
              className="text-sm font-medium text-green-950"
            >
              Preferred Date
            </label>

            <input
              id="preferredDate"
              name="preferredDate"
              type="date"
              min={today}
              required
              className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
            />

            {fieldErrors.preferredDate && (
              <p className="mt-1.5 text-xs text-red-600">
                {fieldErrors.preferredDate}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="text-sm font-medium text-green-950"
            >
              Additional Message
            </label>

            <textarea
              id="message"
              name="message"
              rows={1}
              placeholder="Anything else you'd like us to know?"
              className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
            />

            {fieldErrors.message && (
              <p className="mt-1.5 text-xs text-red-600">
                {fieldErrors.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-full bg-green-900 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Enquiry"}
        </button>

        <p className="mt-4 text-center text-xs leading-5 text-stone-500">
          We&apos;ll contact you to confirm availability, price, and
          delivery details.
        </p>
      </form>
    </>
  );
}