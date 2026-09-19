"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CategoryFormValues = {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
};

type CategoryFormProps = {
  mode: "create" | "edit";
  categoryId?: string;
  initialValues?: CategoryFormValues;
  // Resolved, displayable URL for the existing image (initialValues.imageUrl
  // is just the raw S3 key, which isn't directly renderable).
  currentImageUrl?: string;
};

const DEFAULT_VALUES: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
};

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export default function CategoryForm({
  mode,
  categoryId,
  initialValues,
  currentImageUrl,
}: CategoryFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<CategoryFormValues>(
    initialValues ?? DEFAULT_VALUES
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(
    currentImageUrl ?? ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleNameChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const value = event.target.value;

    setForm((previous) => ({
      ...previous,
      name: value,
      // Only auto-generate the slug when creating a new category, so
      // editing a name later doesn't silently change an existing URL.
      slug: mode === "create" ? generateSlug(value) : previous.slug,
    }));
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    // Allow selecting the same file again later
    event.target.value = "";

    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();

    const isAcceptedImage =
      ["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      (extension && ["jpg", "jpeg", "png", "webp"].includes(extension));

    if (!isAcceptedImage) {
      setError("Only JPG, JPEG, PNG, and WEBP images are allowed.");
      setTimeout(() => setError(""), 2000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      setTimeout(() => setError(""), 2000);
      return;
    }

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview("");
    setForm((previous) => ({ ...previous, imageUrl: "" }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      let imageUrl = form.imageUrl;

      if (imageFile) {
        const formData = new FormData();

        formData.append("file", imageFile);
        formData.append("folder", "categories");

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadData.error || "Failed to upload image."
          );
        }

        imageUrl = uploadData.key;
      }

      const endpoint =
        mode === "create"
          ? "/api/categories"
          : `/api/categories/${categoryId}`;

      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description,
          imageUrl: imageUrl || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Failed to ${mode === "create" ? "create" : "update"} category.`
        );
      }

      router.push("/admin/categories");
      router.refresh();
    } catch (error) {
      console.error(
        `${mode === "create" ? "Create" : "Update"} category error:`,
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : `Failed to ${mode === "create" ? "create" : "update"} category.`
      );

      setTimeout(() => {
        setError("");
      }, 2000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 max-w-3xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="space-y-6">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="text-sm font-medium text-green-950"
          >
            Category Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleNameChange}
            required
            placeholder="e.g. Dairy"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
          />
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="text-sm font-medium text-green-950"
          >
            Slug
          </label>

          <input
            id="slug"
            name="slug"
            type="text"
            value={form.slug}
            onChange={handleChange}
            required
            placeholder="e.g. dairy"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
          />

          <p className="mt-2 text-xs text-stone-500">
            {mode === "create"
              ? "Used in URLs and generated automatically from the category name."
              : "Used in URLs. Change with care if this category is already linked anywhere."}
          </p>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="text-sm font-medium text-green-950"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe this category..."
            className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label
            htmlFor="image"
            className="text-sm font-medium text-green-950"
          >
            Cover Image (Optional)
          </label>

          <p className="mt-1 text-xs text-stone-500">
            Used for this category&apos;s photo on the homepage and about
            page. Falls back to a default photo if not set. JPG, PNG, or
            WEBP, up to 5MB.
          </p>

          <input
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="mt-2 block w-full cursor-pointer rounded-xl border border-stone-200 bg-[#F8F5ED] text-sm text-stone-600 file:mr-4 file:border-0 file:bg-green-900 file:px-4 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-green-800"
          />

          {imagePreview && (
            <div className="mt-4 flex items-start gap-4">
              <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-stone-200">
                <Image
                  src={imagePreview}
                  alt="Category preview"
                  fill
                  className="object-cover"
                  unoptimized={imagePreview.startsWith("blob:")}
                />
              </div>

              <button
                type="button"
                onClick={handleRemoveImage}
                className="mt-1 text-xs font-medium text-red-600 hover:underline"
              >
                Remove image
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-green-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create Category"
              : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
