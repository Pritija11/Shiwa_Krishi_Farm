"use client";

import { FormEvent, useState } from "react";

type SiteSettingsData = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  locationUrl: string;
  googleMapsUrl: string;
  workingHours: string;
  deliveryAreas: string;
  deliveryDays: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
};

type SiteSettingsFormProps = {
  initialData: SiteSettingsData;
};

export default function SiteSettingsForm({
  initialData,
}: SiteSettingsFormProps) {
  const [formData, setFormData] = useState<SiteSettingsData>(initialData);

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("FORM SUBMITTED");
    console.log("FORM DATA:", formData);

    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/site-settings", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("API STATUS:", response.status);

      const data = await response.json();

      console.log("API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setSuccessMessage("Site settings saved successfully.");

      setFormData({
        phone: data.phone ?? "",
        whatsapp: data.whatsapp ?? "",
        email: data.email ?? "",
        address: data.address ?? "",
        locationUrl: data.locationUrl ?? "",
        googleMapsUrl: data.googleMapsUrl ?? "",
        workingHours: data.workingHours ?? "",
        deliveryAreas: data.deliveryAreas ?? "",
        deliveryDays: data.deliveryDays ?? "",
        facebookUrl: data.facebookUrl ?? "",
        instagramUrl: data.instagramUrl ?? "",
        tiktokUrl: data.tiktokUrl ?? "",
      });
    } catch (error) {
      console.error("SAVE ERROR:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* General Information */}
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
            General Information
          </p>

          <h2 className="mt-2 text-2xl text-green-950">
            Contact Details
          </h2>

          <p className="mt-2 text-sm leading-6 text-stone-500">
            These details are displayed throughout the public website.
          </p>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-green-950"
            >
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+977 98XXXXXXXX"
              className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/10"
              required
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label
              htmlFor="whatsapp"
              className="block text-sm font-medium text-green-950"
            >
              WhatsApp Number
            </label>

            <input
              id="whatsapp"
              name="whatsapp"
              type="text"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="+977 98XXXXXXXX"
              className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/10"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-green-950"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="hello@example.com"
              className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/10"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-green-950"
            >
              Address
            </label>

            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="Shiwa Krishi Farm, Nepal"
              className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/10"
              required
            />
          </div>
        </div>
      </section>

      {/* Business & Delivery */}
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
            Business & Delivery
          </p>

          <h2 className="mt-2 text-2xl text-green-950">
            Farm Information
          </h2>

          <p className="mt-2 text-sm leading-6 text-stone-500">
            Manage location, working hours, and delivery information.
          </p>
        </div>

        <div className="mt-7 space-y-6">
          {/* Location Embed URL */}
          <div>
            <label
              htmlFor="locationUrl"
              className="block text-sm font-medium text-green-950"
            >
              Location Embed URL
            </label>

            <p className="mt-1 text-xs text-stone-500">
              Google Maps embed URL used to display the map on the Contact
              page.
            </p>

            <input
              id="locationUrl"
              name="locationUrl"
              type="url"
              value={formData.locationUrl}
              onChange={handleChange}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/10"
            />
          </div>

          {/* Google Maps Link */}
          <div>
            <label
              htmlFor="googleMapsUrl"
              className="block text-sm font-medium text-green-950"
            >
              Google Maps Link
            </label>

            <p className="mt-1 text-xs text-stone-500">
              Normal Google Maps link used by the &quot;Open in Google
              Maps&quot; button.
            </p>

            <input
              id="googleMapsUrl"
              name="googleMapsUrl"
              type="url"
              value={formData.googleMapsUrl}
              onChange={handleChange}
              placeholder="https://share.google/..."
              className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/10"
            />
          </div>

          {/* Working Hours */}
          <div>
            <label
              htmlFor="workingHours"
              className="block text-sm font-medium text-green-950"
            >
              Working Hours
            </label>

            <textarea
              id="workingHours"
              name="workingHours"
              value={formData.workingHours}
              onChange={handleChange}
              rows={3}
              placeholder={"Sunday - Friday: 7:00 AM - 6:00 PM\nSaturday: Closed"}
              className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/10"
            />
          </div>

          {/* Delivery Areas */}
          <div>
            <label
              htmlFor="deliveryAreas"
              className="block text-sm font-medium text-green-950"
            >
              Delivery Areas
            </label>

            <textarea
              id="deliveryAreas"
              name="deliveryAreas"
              value={formData.deliveryAreas}
              onChange={handleChange}
              rows={3}
              placeholder="Lalitpur, Kathmandu, Bhaktapur..."
              className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/10"
            />
          </div>

          {/* Delivery Days */}
          <div>
            <label
              htmlFor="deliveryDays"
              className="block text-sm font-medium text-green-950"
            >
              Delivery Days
            </label>

            <input
              id="deliveryDays"
              name="deliveryDays"
              type="text"
              value={formData.deliveryDays}
              onChange={handleChange}
              placeholder="Sunday, Tuesday, Thursday"
              className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/10"
            />
          </div>
        </div>
      </section>

      {/* Social & Messaging */}
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
            Social & Messaging
          </p>

          <h2 className="mt-2 text-2xl text-green-950">
            Social Links
          </h2>

          <p className="mt-2 text-sm leading-6 text-stone-500">
            Add your social media links. Leave a field empty if you do not
            use that platform.
          </p>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          {/* Facebook */}
          <div>
            <label
              htmlFor="facebookUrl"
              className="block text-sm font-medium text-green-950"
            >
              Facebook URL
            </label>

            <input
              id="facebookUrl"
              name="facebookUrl"
              type="url"
              value={formData.facebookUrl}
              onChange={handleChange}
              placeholder="https://facebook.com/..."
              className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/10"
            />
          </div>

          {/* Instagram */}
          <div>
            <label
              htmlFor="instagramUrl"
              className="block text-sm font-medium text-green-950"
            >
              Instagram URL
            </label>

            <input
              id="instagramUrl"
              name="instagramUrl"
              type="url"
              value={formData.instagramUrl}
              onChange={handleChange}
              placeholder="https://instagram.com/..."
              className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/10"
            />
          </div>

          {/* TikTok */}
          <div>
            <label
              htmlFor="tiktokUrl"
              className="block text-sm font-medium text-green-950"
            >
              TikTok URL
            </label>

            <input
              id="tiktokUrl"
              name="tiktokUrl"
              type="url"
              value={formData.tiktokUrl}
              onChange={handleChange}
              placeholder="https://tiktok.com/@..."
              className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/10"
            />
          </div>
        </div>
      </section>

      {/* Messages */}
      {successMessage && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-full bg-green-900 px-7 py-3 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}