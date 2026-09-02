"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type GalleryCategory =
  | "FARM"
  | "ANIMALS"
  | "POULTRY"
  | "GOATS"
  | "DAIRY"
  | "VEGETABLES"
  | "FAMILY"
  | "OTHER";

type MediaType = "IMAGE" | "VIDEO";

type ValidationFields = Record<string, string[]>;

const categories: {
  value: GalleryCategory;
  label: string;
}[] = [
  { value: "FARM", label: "Farm" },
  { value: "ANIMALS", label: "Animals" },
  { value: "POULTRY", label: "Poultry" },
  { value: "GOATS", label: "Goats" },
  { value: "DAIRY", label: "Dairy" },
  { value: "VEGETABLES", label: "Vegetables" },
  { value: "FAMILY", label: "Family" },
  { value: "OTHER", label: "Other" },
];

export default function NewGalleryItemPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "FARM" as GalleryCategory,
    isActive: true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<MediaType | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] =
    useState<ValidationFields>({});

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      [name]: [],
    }));

    setError("");
  }

  function handleMediaChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setError("Please select an image or video file.");
      return;
    }

    const maxSize = isImage
      ? 5 * 1024 * 1024
      : 50 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        isImage
          ? "Image must be smaller than 5MB."
          : "Video must be smaller than 50MB."
      );
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const type: MediaType = isImage ? "IMAGE" : "VIDEO";
    const objectUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setMediaType(type);
    setPreviewUrl(objectUrl);

    setError("");
    setFieldErrors((previous) => ({
      ...previous,
      mediaUrl: [],
    }));
  }

  async function uploadMedia() {
    if (!selectedFile) {
      return null;
    }

    setUploadingMedia(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("folder", "gallery");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to upload media."
        );
      }

      return {
        key: data.key as string,
        mediaType: data.mediaType as MediaType,
      };
    } catch (error) {
      console.error("Gallery media upload error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload media."
      );

      return null;
    } finally {
      setUploadingMedia(false);
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setFieldErrors({});

    if (!selectedFile) {
      setError("Please select an image or video.");
      setLoading(false);
      return;
    }

    try {
      // ---------------------------------------
      // Upload media to S3
      // ---------------------------------------

      const uploadedMedia = await uploadMedia();

      if (!uploadedMedia) {
        return;
      }

      // ---------------------------------------
      // Create GalleryItem
      // ---------------------------------------

      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          mediaUrl: uploadedMedia.key,
          mediaType: uploadedMedia.mediaType,
          category: form.category,
          isActive: form.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fields) {
          setFieldErrors(data.fields);
          setError("Please fix the highlighted fields.");
        } else {
          setError(
            data.error || "Failed to create gallery item."
          );
        }

        return;
      }

      router.push("/admin/gallery");
      router.refresh();
    } catch (error) {
      console.error("Failed to create gallery item:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create gallery item."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    router.back();
  }

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      {/* Header */}
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
          Gallery
        </p>

        <h1 className="mt-2 font-[family-name:var(--font-dm-serif)] text-4xl text-green-950 sm:text-5xl">
          Add Gallery Item
        </h1>

        <p className="mt-3 text-sm text-stone-600">
          Add a photo or video to your farm gallery.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 max-w-4xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Title */}
          <div className="sm:col-span-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-green-950"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="e.g. Fresh morning at the farm"
              className={`mt-2 w-full rounded-xl border bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700 ${
                fieldErrors.title
                  ? "border-red-400"
                  : "border-stone-200"
              }`}
            />

            {fieldErrors.title?.map((message) => (
              <p
                key={message}
                className="mt-1 text-xs text-red-600"
              >
                {message}
              </p>
            ))}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="text-sm font-medium text-green-950"
            >
              Category
            </label>

            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className={`mt-2 w-full rounded-xl border bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700 ${
                fieldErrors.category
                  ? "border-red-400"
                  : "border-stone-200"
              }`}
            >
              {categories.map((category) => (
                <option
                  key={category.value}
                  value={category.value}
                >
                  {category.label}
                </option>
              ))}
            </select>

            {fieldErrors.category?.map((message) => (
              <p
                key={message}
                className="mt-1 text-xs text-red-600"
              >
                {message}
              </p>
            ))}
          </div>

          {/* Media */}
          <div>
            <label
              htmlFor="media"
              className="text-sm font-medium text-green-950"
            >
              Image or Video
            </label>

            <input
              id="media"
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
              onChange={handleMediaChange}
              required
              className="mt-2 block w-full cursor-pointer rounded-xl border border-stone-200 bg-[#F8F5ED] text-sm text-stone-600 file:mr-4 file:border-0 file:bg-green-900 file:px-4 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-green-800"
            />

            <p className="mt-2 text-xs text-stone-500">
              Images up to 5MB. Videos up to 50MB.
            </p>

            {mediaType && (
              <p className="mt-1 text-xs font-medium text-green-700">
                {mediaType === "IMAGE"
                  ? "Image selected"
                  : "Video selected"}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-green-950"
            >
              Description
              <span className="ml-1 font-normal text-stone-400">
                (Optional)
              </span>
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={500}
              rows={4}
              placeholder="Add a short description..."
              className={`mt-2 w-full resize-none rounded-xl border bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700 ${
                fieldErrors.description
                  ? "border-red-400"
                  : "border-stone-200"
              }`}
            />

            <div className="mt-1 flex justify-between">
              {fieldErrors.description?.map((message) => (
                <p
                  key={message}
                  className="text-xs text-red-600"
                >
                  {message}
                </p>
              ))}

              <span className="ml-auto text-xs text-stone-400">
                {form.description.length}/500
              </span>
            </div>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="sm:col-span-2">
              <p className="text-sm font-medium text-green-950">
                Preview
              </p>

              <div className="mt-3 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                {mediaType === "IMAGE" ? (
                  <img
                    src={previewUrl}
                    alt="Gallery preview"
                    className="max-h-[450px] w-full object-contain"
                  />
                ) : (
                  <video
                    src={previewUrl}
                    controls
                    className="max-h-[450px] w-full"
                  />
                )}
              </div>

              {selectedFile && (
                <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
                  <span className="truncate">
                    {selectedFile.name}
                  </span>

                  <span className="ml-4 shrink-0">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Active Status */}
          <div className="sm:col-span-2">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    isActive: event.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-stone-300 accent-green-900"
              />

              <span className="text-sm font-medium text-green-950">
                Gallery item is active
              </span>
            </label>

            <p className="mt-1 pl-7 text-xs text-stone-500">
              Active gallery items are visible on the public
              website.
            </p>
          </div>
        </div>

        {/* General Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading || uploadingMedia}
            className="rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || uploadingMedia}
            className="rounded-full bg-green-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploadingMedia
              ? "Uploading media..."
              : loading
                ? "Creating..."
                : "Add to Gallery"}
          </button>
        </div>
      </form>
    </div>
  );
}