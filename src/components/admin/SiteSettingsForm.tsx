"use client";

import { FormEvent, useState } from "react";
import type { Area } from "react-easy-crop";

import ImageCropper from "@/components/admin/ImageCropper";
import { createCroppedImage } from "@/lib/crop-image";

const MAX_HERO_IMAGES = 5;

type HeroImageItem =
  | { type: "existing"; key: string; preview: string }
  | { type: "new"; file: File; preview: string };

type SiteSettingsData = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  locationUrl: string;
  googleMapsUrl: string;
  googleBusinessProfileUrl: string;
  workingHours: string;
  deliveryAreas: string;
  deliveryDays: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
};

type SiteSettingsFormProps = {
  initialData: SiteSettingsData;
  initialHeroImages: { key: string; url: string }[];
};

export default function SiteSettingsForm({
  initialData,
  initialHeroImages,
}: SiteSettingsFormProps) {
  const [formData, setFormData] = useState<SiteSettingsData>(initialData);

  // Hero images: existing (already on S3) + newly cropped, in slideshow order
  const [heroImages, setHeroImages] = useState<HeroImageItem[]>(
    initialHeroImages.map((image) => ({
      type: "existing",
      key: image.key,
      preview: image.url,
    }))
  );

  // Hero images waiting to be cropped
  const [pendingHeroFiles, setPendingHeroFiles] = useState<File[]>([]);
  const [currentHeroFileIndex, setCurrentHeroFileIndex] = useState(0);

  // Hero image currently being cropped
  const [heroCropImage, setHeroCropImage] = useState("");
  const [heroCroppedAreaPixels, setHeroCroppedAreaPixels] =
    useState<Area | null>(null);

  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleHeroImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files ?? []);

    // Allow selecting the same file again later
    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    const remainingSlots = MAX_HERO_IMAGES - heroImages.length;

    if (files.length > remainingSlots) {
      setErrorMessage(
        `You can add ${remainingSlots} more image${
          remainingSlots === 1 ? "" : "s"
        }.`
      );
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    for (const file of files) {
      const extension = file.name.split(".").pop()?.toLowerCase();

      const isAcceptedImage =
        ["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        (extension && ["jpg", "jpeg", "png", "webp"].includes(extension));

      if (!isAcceptedImage) {
        setErrorMessage("Only JPG, JPEG, PNG, and WEBP images are allowed.");
        setTimeout(() => setErrorMessage(""), 2000);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(`Image "${file.name}" must be smaller than 5MB.`);
        setTimeout(() => setErrorMessage(""), 2000);
        return;
      }
    }

    setErrorMessage("");

    setPendingHeroFiles(files);
    setCurrentHeroFileIndex(0);
    setHeroCroppedAreaPixels(null);

    setHeroCropImage(URL.createObjectURL(files[0]));
  }

  function handleHeroCropComplete(croppedAreaPixels: Area) {
    setHeroCroppedAreaPixels(croppedAreaPixels);
  }

  async function handleHeroCropConfirm() {
    if (!heroCropImage || !heroCroppedAreaPixels) {
      return;
    }

    try {
      const croppedFile = await createCroppedImage(
        heroCropImage,
        heroCroppedAreaPixels,
        {
          maxWidth: 1920,
          maxHeight: 1080,
          fileNamePrefix: "hero-image",
        }
      );

      const preview = URL.createObjectURL(croppedFile);

      setHeroImages((previous) => [
        ...previous,
        { type: "new", file: croppedFile, preview },
      ]);

      const nextIndex = currentHeroFileIndex + 1;

      URL.revokeObjectURL(heroCropImage);

      if (nextIndex < pendingHeroFiles.length) {
        setCurrentHeroFileIndex(nextIndex);
        setHeroCroppedAreaPixels(null);
        setHeroCropImage(
          URL.createObjectURL(pendingHeroFiles[nextIndex])
        );
      } else {
        setPendingHeroFiles([]);
        setCurrentHeroFileIndex(0);
        setHeroCroppedAreaPixels(null);
        setHeroCropImage("");
      }
    } catch (error) {
      console.error("Hero image crop error:", error);

      setErrorMessage("Failed to crop image. Please try again.");
      setTimeout(() => setErrorMessage(""), 2000);
    }
  }

  function handleHeroCropCancel() {
    if (heroCropImage) {
      URL.revokeObjectURL(heroCropImage);
    }

    setPendingHeroFiles([]);
    setCurrentHeroFileIndex(0);
    setHeroCroppedAreaPixels(null);
    setHeroCropImage("");
  }

  function removeHeroImage(index: number) {
    setHeroImages((previous) => {
      const imageToRemove = previous[index];

      if (imageToRemove?.type === "new") {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      return previous.filter((_, imageIndex) => imageIndex !== index);
    });
  }

  async function resolveHeroImageKeys() {
    setUploadingHeroImage(true);

    try {
      const resolvedKeys: string[] = [];

      for (const image of heroImages) {
        if (image.type === "existing") {
          resolvedKeys.push(image.key);
          continue;
        }

        const uploadData = new FormData();

        uploadData.append("file", image.file);
        uploadData.append("folder", "hero");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to upload hero image.");
        }

        resolvedKeys.push(data.key);
      }

      return resolvedKeys;
    } finally {
      setUploadingHeroImage(false);
    }
  }

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

    setSuccessMessage("");
    setErrorMessage("");

    if (heroImages.length === 0) {
      setErrorMessage("Please add at least one hero image.");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    if (pendingHeroFiles.length > 0 || heroCropImage) {
      setErrorMessage("Please finish cropping your selected hero images first.");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    setIsSaving(true);

    try {
      const heroImageKeys = await resolveHeroImageKeys();

      const response = await fetch("/api/site-settings", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, heroImages: heroImageKeys }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setSuccessMessage("Site settings saved successfully.");

      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);

      setFormData({
        phone: data.phone ?? "",
        whatsapp: data.whatsapp ?? "",
        email: data.email ?? "",
        address: data.address ?? "",
        locationUrl: data.locationUrl ?? "",
        googleMapsUrl: data.googleMapsUrl ?? "",
        googleBusinessProfileUrl: data.googleBusinessProfileUrl ?? "",
        workingHours: data.workingHours ?? "",
        deliveryAreas: data.deliveryAreas ?? "",
        deliveryDays: data.deliveryDays ?? "",
        facebookUrl: data.facebookUrl ?? "",
        instagramUrl: data.instagramUrl ?? "",
        tiktokUrl: data.tiktokUrl ?? "",
      });

      // Mark newly uploaded images as persisted so re-saving doesn't
      // upload them to S3 a second time.
      setHeroImages((previous) =>
        previous.map((image, index) => ({
          type: "existing",
          key: heroImageKeys[index],
          preview: image.preview,
        }))
      );
    } catch (error) {
      console.error("SAVE ERROR:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Hero Images */}
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
            Homepage
          </p>

          <h2 className="mt-2 font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
            Hero Images
          </h2>

          <p className="mt-2 text-sm leading-6 text-stone-500">
            These images rotate in the homepage hero banner. At least 1
            image is required, up to 5 allowed.
          </p>
        </div>

        <div className="mt-7">
          <label
            htmlFor="heroImages"
            className="block text-sm font-medium text-green-950"
          >
            Hero Images <span className="text-red-600">*</span>
          </label>

          <input
            id="heroImages"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={
              heroImages.length >= MAX_HERO_IMAGES || Boolean(heroCropImage)
            }
            onChange={handleHeroImageChange}
            className="mt-2 block w-full cursor-pointer rounded-xl border border-stone-200 bg-white text-sm text-stone-600 file:mr-4 file:border-0 file:bg-green-900 file:px-4 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <p className="mt-2 text-xs text-stone-500">
            Add 1–5 images. The first image shows first in the slideshow.
            Each image is cropped to a 16:9 banner. JPG, PNG, or WEBP up to
            5MB each.
          </p>

          {heroImages.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-5">
              {heroImages.map((image, index) => (
                <div
                  key={
                    image.type === "existing" ? image.key : image.preview
                  }
                >
                  <div className="relative overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.preview}
                      alt={`Hero image ${index + 1}`}
                      className="aspect-video w-full object-cover"
                    />

                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-green-900 px-2.5 py-1 text-[10px] font-medium text-white">
                        Shows first
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => removeHeroImage(index)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-sm font-medium text-red-600 shadow-sm transition hover:bg-white"
                      aria-label={`Remove hero image ${index + 1}`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* General Information */}
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
            General Information
          </p>

          <h2 className="mt-2 font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
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

          <h2 className="mt-2 font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
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

          {/* Google Business Profile */}
          <div>
            <label
              htmlFor="googleBusinessProfileUrl"
              className="block text-sm font-medium text-green-950"
            >
              Google Business Profile Link
            </label>

            <p className="mt-1 text-xs text-stone-500">
              Link to your Google Business Profile listing, shown as a
              &quot;Find us on Google&quot; button on the Contact page.
            </p>

            <input
              id="googleBusinessProfileUrl"
              name="googleBusinessProfileUrl"
              type="url"
              value={formData.googleBusinessProfileUrl}
              onChange={handleChange}
              placeholder="https://g.page/..."
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

          <h2 className="mt-2 font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
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
          disabled={isSaving || uploadingHeroImage}
          className="rounded-full bg-green-900 px-7 py-3 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploadingHeroImage
            ? "Uploading images..."
            : isSaving
              ? "Saving..."
              : "Save Settings"}
        </button>
      </div>

      {/* Hero Image Cropper */}
      {heroCropImage && (
        <ImageCropper
          image={heroCropImage}
          aspect={16 / 9}
          title="Crop Hero Image"
          description="Adjust the image so the important part fits inside the 16:9 banner frame."
          onCropComplete={handleHeroCropComplete}
          onCancel={handleHeroCropCancel}
          onConfirm={handleHeroCropConfirm}
        />
      )}
    </form>
  );
}