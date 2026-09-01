
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: string | number;
  unit: string;
  availability: string;
  imageUrl: string | null;
  imagePreviewUrl: string | null;
  categoryId: string;
  isActive: boolean;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

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

  useEffect(() => {
    async function loadData() {
      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch("/api/categories"),
        ]);

        if (!productResponse.ok) {
          throw new Error("Failed to load product.");
        }

        if (!categoriesResponse.ok) {
          throw new Error("Failed to load categories.");
        }

        const product: Product = await productResponse.json();
        const categoriesData: Category[] =
          await categoriesResponse.json();

        setCategories(categoriesData);

        setForm({
          name: product.name,
          description: product.description,
          price: String(product.price),
          unit: product.unit,
          availability: product.availability,
          imageUrl: product.imageUrl || "",
          categoryId: product.categoryId,
          isActive: product.isActive,
        });

        // Use the signed S3 URL for the existing image preview
        setPreviewUrl(product.imagePreviewUrl || "");
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

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
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  }

  async function uploadImage(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to upload image."
      );
    }

    return data.key as string;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      let imageKey = form.imageUrl || null;

      // Only upload when a new image has been selected
      if (selectedFile) {
        setUploading(true);

        imageKey = await uploadImage(selectedFile);

        setUploading(false);
      }

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
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
        throw new Error(
          data.error || "Failed to update product."
        );
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update product."
      );

      setUploading(false);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="px-6 py-10 lg:px-10">
        <p className="text-sm text-stone-500">
          Loading product...
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      {/* Header */}
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
          Products
        </p>

        <h1 className="mt-2 font-[family-name:var(--font-dm-serif)] text-4xl text-green-950 sm:text-5xl">
          Edit Product
        </h1>

        <p className="mt-3 text-sm text-stone-600">
          Update product information, pricing, availability, and
          status.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 max-w-4xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Name */}
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
              className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
            />
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
              className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
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
              className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
            />
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
              className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
            >
              <option value="KG">Kilogram</option>
              <option value="LITRE">Litre</option>
              <option value="PIECE">Piece</option>
              <option value="DOZEN">Dozen</option>
            </select>
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
              className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
            >
              <option value="IN_STOCK">In Stock</option>
              <option value="SEASONAL">Seasonal</option>
              <option value="OUT_OF_STOCK">
                Out of Stock
              </option>
            </select>
          </div>

          {/* Image */}
          <div>
            <label
              htmlFor="image"
              className="text-sm font-medium text-green-950"
            >
              Product Image
            </label>

            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 w-full rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm text-stone-600 outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-green-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-green-800"
            />

            <p className="mt-2 text-xs text-stone-500">
              Select a new image only if you want to replace the
              current one.
            </p>

            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-stone-500">
                  {selectedFile
                    ? "New image preview"
                    : "Current image"}
                </p>

                <div className="relative h-40 w-40 overflow-hidden rounded-xl border border-stone-200">
                  <Image
                    src={previewUrl}
                    alt={form.name || "Product image"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
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
              className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-[#F8F5ED] px-4 py-3 text-sm outline-none transition focus:border-green-700"
            />
          </div>

          {/* Active */}
          <div className="sm:col-span-2">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
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
              Inactive products can remain in the database but will
              not be shown as active products.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={saving}
            className="rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-green-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading
              ? "Uploading image..."
              : saving
                ? "Saving..."
                : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
