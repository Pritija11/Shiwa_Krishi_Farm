"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CategoryFormValues = {
  name: string;
  slug: string;
  description: string;
};

type CategoryFormProps = {
  mode: "create" | "edit";
  categoryId?: string;
  initialValues?: CategoryFormValues;
};

const DEFAULT_VALUES: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
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
}: CategoryFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<CategoryFormValues>(
    initialValues ?? DEFAULT_VALUES
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
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
          description: form.description || null,
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
