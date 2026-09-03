"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
};

type ValidationFields = Record<string, string[]>;

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    unit: "KG",
    availability: "IN_STOCK",
    imageUrl: "",
    categoryId: "",
    isActive: true,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ValidationFields>({});

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");

        if (!response.ok) {
          throw new Error("Failed to load categories");
        }

        const data = await response.json();

        setCategories(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

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

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setError("");
    setFieldErrors({});
    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  async function uploadImage() {
    if (!selectedImage) {
      return null;
    }

    setUploadingImage(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("file", selectedImage);
      formData.append("folder", "products");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      return data.key;
    } catch (error) {
      console.error("Image upload error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload image."
      );

      return null;
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      let imageKey = null;

      if (selectedImage) {
        imageKey = await uploadImage();

        if (!imageKey) {
          setLoading(false);
          return;
        }
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          unit: form.unit,
          availability: form.availability,
          imageUrl: imageKey,
          categoryId: form.categoryId,
          isActive: form.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fields) {
          setFieldErrors(data.fields);
          setError("Please fix the highlighted fields.");
        } else {
          setError(data.error || "Failed to create product.");
        }

        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      {/* Header */}
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
          Products
        </p>

        <h1 className="mt-2 font-[family-name:var(--font-dm-serif)] text-4xl text-green-950 sm:text-5xl">
          Add Product
        </h1>

        <p className="mt-3 text-sm text-stone-600">
          Add a new product to your farm inventory.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 max-w-4xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Product Name */}
          <div>
            <label
              htmlFor="name"
              className="text-sm font-medium text-green-950"
            >
              Product Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Fresh Cow Milk"
              className={`mt-2 w-full rounded-xl border bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700 ${
                fieldErrors.name
                  ? "border-red-400"
                  : "border-stone-200"
              }`}
            />

            {fieldErrors.name?.map((message) => (
              <p key={message} className="mt-1 text-xs text-red-600">
                {message}
              </p>
            ))}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="categoryId"
              className="text-sm font-medium text-green-950"
            >
              Category
            </label>

            <select
              id="categoryId"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
              disabled={loadingCategories}
              className={`mt-2 w-full rounded-xl border bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700 disabled:opacity-60 ${
                fieldErrors.categoryId
                  ? "border-red-400"
                  : "border-stone-200"
              }`}
            >
              <option value="">
                {loadingCategories
                  ? "Loading categories..."
                  : "Select category"}
              </option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {fieldErrors.categoryId?.map((message) => (
              <p key={message} className="mt-1 text-xs text-red-600">
                {message}
              </p>
            ))}
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="text-sm font-medium text-green-950"
            >
              Price
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
              placeholder="e.g. 120"
              className={`mt-2 w-full rounded-xl border bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700 ${
                fieldErrors.price
                  ? "border-red-400"
                  : "border-stone-200"
              }`}
            />

            {fieldErrors.price?.map((message) => (
              <p key={message} className="mt-1 text-xs text-red-600">
                {message}
              </p>
            ))}
          </div>

          {/* Unit */}
          <div>
            <label
              htmlFor="unit"
              className="text-sm font-medium text-green-950"
            >
              Unit
            </label>

            <select
              id="unit"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              required
              className={`mt-2 w-full rounded-xl border bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700 ${
                fieldErrors.unit
                  ? "border-red-400"
                  : "border-stone-200"
              }`}
            >
              <option value="KG">Kilogram</option>
              <option value="LITRE">Litre</option>
              <option value="PIECE">Piece</option>
              <option value="DOZEN">Dozen</option>
            </select>

            {fieldErrors.unit?.map((message) => (
              <p key={message} className="mt-1 text-xs text-red-600">
                {message}
              </p>
            ))}
          </div>

          {/* Availability */}
          <div>
            <label
              htmlFor="availability"
              className="text-sm font-medium text-green-950"
            >
              Availability
            </label>

            <select
              id="availability"
              name="availability"
              value={form.availability}
              onChange={handleChange}
              required
              className={`mt-2 w-full rounded-xl border bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700 ${
                fieldErrors.availability
                  ? "border-red-400"
                  : "border-stone-200"
              }`}
            >
              <option value="IN_STOCK">In Stock</option>
              <option value="SEASONAL">Seasonal</option>
              <option value="OUT_OF_STOCK">
                Out of Stock
              </option>
            </select>

            {fieldErrors.availability?.map((message) => (
              <p key={message} className="mt-1 text-xs text-red-600">
                {message}
              </p>
            ))}
          </div>

          {/* Product Image */}
          <div>
            <label
              htmlFor="image"
              className="text-sm font-medium text-green-950"
            >
              Product Image
            </label>

            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 block w-full cursor-pointer rounded-xl border border-stone-200 bg-[#F8F5ED] text-sm text-stone-600 file:mr-4 file:border-0 file:bg-green-900 file:px-4 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-green-800"
            />

            <p className="mt-2 text-xs text-stone-500">
              JPG, PNG, WEBP up to 5MB.
            </p>

            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Selected product"
                  className="h-32 w-32 rounded-xl object-cover"
                />

                <p className="mt-2 text-xs text-green-700">
                  {selectedImage?.name}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
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
              required
              rows={5}
              placeholder="Describe the product..."
              className={`mt-2 w-full resize-none rounded-xl border bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700 ${
                fieldErrors.description
                  ? "border-red-400"
                  : "border-stone-200"
              }`}
            />

            {fieldErrors.description?.map((message) => (
              <p key={message} className="mt-1 text-xs text-red-600">
                {message}
              </p>
            ))}
          </div>

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
                Product is active
              </span>
            </label>

            <p className="mt-1 pl-7 text-xs text-stone-500">
              Active products can be displayed on the public website.
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
            onClick={() => router.back()}
            className="rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || uploadingImage || loadingCategories}
            className="rounded-full bg-green-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploadingImage
              ? "Uploading image..."
              : loading
                ? "Creating..."
                : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}