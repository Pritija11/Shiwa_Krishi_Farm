"use client";

import { useState } from "react";

type Product = {
  id: string;
  name: string;
};

type OrderFormProps = {
  products: Product[];
  selectedProduct?: string;
};

export default function OrderForm({
  products,
  selectedProduct = "",
}: OrderFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      customerName: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      productId: formData.get("product"),
      quantity: formData.get("quantity"),
      deliveryAddress: formData.get("address"),
      preferredDate: formData.get("preferredDate"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send enquiry");
      }

      // Clear the form
      form.reset();

      // Show success message
      setSuccess("Your enquiry has been sent successfully!");

      // Automatically hide success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      // Automatically hide error message after 3 seconds
      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  }

  return (
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

          <textarea
            id="message"
            name="message"
            rows={1}
            placeholder="Anything else you'd like us to know?"
            className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
          />
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-800">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full rounded-full bg-green-900 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Enquiry"}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-stone-500">
        We&apos;ll contact you to confirm availability, price, and delivery
        details.
      </p>
    </form>
  );
}