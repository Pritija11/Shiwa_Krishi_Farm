"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Area } from "react-easy-crop";

import ImageCropper from "@/components/admin/ImageCropper";
import { createCroppedImage } from "@/lib/crop-image";

type Category = {
  id: string;
  name: string;
};

type ValidationFields = Record<string, string[]>;

type ProductImageItem =
  | { type: "existing"; key: string; preview: string }
  | { type: "new"; file: File; preview: string };

type ProductFormValues = {
  name: string;
  description: string;
  price: string;
  unit: string;
  availability: string;
  categoryId: string;
  isActive: boolean;
};

type ProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
  initialValues?: ProductFormValues;
  initialImages?: { key: string; url: string }[];
};

const DEFAULT_VALUES: ProductFormValues = {
  name: "",
  description: "",
  price: "",
  unit: "KG",
  availability: "IN_STOCK",
  categoryId: "",
  isActive: true,
};

export default function ProductForm({
  mode,
  productId,
  initialValues,
  initialImages,
}: ProductFormProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [form, setForm] = useState<ProductFormValues>(
    initialValues ?? DEFAULT_VALUES
  );

  // Existing + newly cropped images, in display/main-image order
  const [images, setImages] = useState<ProductImageItem[]>(
    (initialImages ?? []).map((image) => ({
      type: "existing",
      key: image.key,
      preview: image.url,
    }))
  );

  // Images waiting to be cropped
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  // Current image being cropped
  const [cropImage, setCropImage] = useState("");
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<Area | null>(null);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [fieldErrors, setFieldErrors] =
    useState<ValidationFields>({});

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
    const files = Array.from(event.target.files ?? []);

    // Allow selecting the same file again later
    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    const remainingSlots = 5 - images.length;

    if (files.length > remainingSlots) {
      setError(
        `You can add ${remainingSlots} more image${
          remainingSlots === 1 ? "" : "s"
        }.`
      );
      return;
    }

    for (const file of files) {
      if (
        !["image/jpeg", "image/png", "image/webp"].includes(
          file.type
        )
      ) {
        setError(
          "Only JPG, PNG, and WEBP images are allowed."
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(
          `Image "${file.name}" must be smaller than 5MB.`
        );
        return;
      }
    }

    setError("");
    setFieldErrors({});

    setPendingFiles(files);
    setCurrentFileIndex(0);
    setCroppedAreaPixels(null);

    const previewUrl = URL.createObjectURL(files[0]);

    setCropImage(previewUrl);
  }

  function handleCropComplete(
    croppedAreaPixels: Area
  ) {
    setCroppedAreaPixels(croppedAreaPixels);
  }

  async function handleCropConfirm() {
    if (!cropImage || !croppedAreaPixels) {
      return;
    }

    try {
      const croppedFile = await createCroppedImage(
        cropImage,
        croppedAreaPixels
      );

      const preview = URL.createObjectURL(croppedFile);

      setImages((previous) => [
        ...previous,
        {
          type: "new",
          file: croppedFile,
          preview,
        },
      ]);

      const nextIndex = currentFileIndex + 1;

      URL.revokeObjectURL(cropImage);

      if (nextIndex < pendingFiles.length) {
        // Crop next selected image
        setCurrentFileIndex(nextIndex);
        setCroppedAreaPixels(null);

        const nextPreview = URL.createObjectURL(
          pendingFiles[nextIndex]
        );

        setCropImage(nextPreview);
      } else {
        // Finished cropping all selected images
        setPendingFiles([]);
        setCurrentFileIndex(0);
        setCroppedAreaPixels(null);
        setCropImage("");
      }
    } catch (error) {
      console.error("Image crop error:", error);

      setError(
        "Failed to crop image. Please try again."
      );
    }
  }

  function handleCropCancel() {
    if (cropImage) {
      URL.revokeObjectURL(cropImage);
    }

    setPendingFiles([]);
    setCurrentFileIndex(0);
    setCroppedAreaPixels(null);
    setCropImage("");
  }

  function removeImage(index: number) {
    setImages((previous) => {
      const imageToRemove = previous[index];

      if (imageToRemove?.type === "new") {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      return previous.filter(
        (_, imageIndex) => imageIndex !== index
      );
    });
  }

  async function resolveImageKeys() {
    if (images.length === 0) {
      return [];
    }

    setUploadingImage(true);
    setError("");

    try {
      const resolvedKeys: string[] = [];

      for (const image of images) {
        if (image.type === "existing") {
          resolvedKeys.push(image.key);
          continue;
        }

        const formData = new FormData();

        formData.append("file", image.file);
        formData.append("folder", "products");

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

        resolvedKeys.push(data.key);
      }

      return resolvedKeys;
    } catch (error) {
      console.error("Image upload error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload images."
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

    setError("");
    setSuccess("");
    setFieldErrors({});

    // At least one image is required
    if (images.length === 0) {
      setError("Please add at least one product image.");
      return;
    }

    // Do not submit while another image is being cropped
    if (pendingFiles.length > 0 || cropImage) {
      setError(
        "Please finish cropping your selected images first."
      );
      return;
    }

    setSaving(true);

    try {
      const imageKeys = await resolveImageKeys();

      if (imageKeys === null) {
        return;
      }

      const endpoint =
        mode === "create"
          ? "/api/products"
          : `/api/products/${productId}`;

      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          unit: form.unit,
          availability: form.availability,
          images: imageKeys,
          categoryId: form.categoryId,
          isActive: form.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fields) {
          setFieldErrors(data.fields);
          setError(
            "Please fix the highlighted fields."
          );
        } else {
          setError(
            data.error ||
              `Failed to ${
                mode === "create" ? "create" : "update"
              } product.`
          );
        }

        return;
      }

      setSuccess(
        mode === "create"
          ? "Product created successfully!"
          : "Product updated successfully!"
      );

      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : `Failed to ${
              mode === "create" ? "create" : "update"
            } product.`
      );
    } finally {
      setSaving(false);
    }
  }

  const isCropping = Boolean(cropImage);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 max-w-4xl rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8"
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
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>

            {fieldErrors.categoryId?.map((message) => (
              <p
                key={message}
                className="mt-1 text-xs text-red-600"
              >
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
              <p
                key={message}
                className="mt-1 text-xs text-red-600"
              >
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
              <p
                key={message}
                className="mt-1 text-xs text-red-600"
              >
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
              <p
                key={message}
                className="mt-1 text-xs text-red-600"
              >
                {message}
              </p>
            ))}
          </div>

          {/* Product Images */}
          <div className="sm:col-span-2">
            <label
              htmlFor="images"
              className="text-sm font-medium text-green-950"
            >
              Product Images
            </label>

            <input
              id="images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={
                images.length >= 5 || isCropping
              }
              onChange={handleImageChange}
              className="mt-2 block w-full cursor-pointer rounded-xl border border-stone-200 bg-[#F8F5ED] text-sm text-stone-600 file:mr-4 file:border-0 file:bg-green-900 file:px-4 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-2 text-xs text-stone-500">
              Add 1–5 images. The first image will be the main
              product image. Each image is cropped to 4:3.
              JPG, PNG, or WEBP up to 5MB each.
            </p>

            {/* Image previews */}
            {images.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-5">
                {images.map((image, index) => (
                  <div
                    key={
                      image.type === "existing"
                        ? image.key
                        : image.preview
                    }
                  >
                    <div className="relative overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                      <img
                        src={image.preview}
                        alt={`Product image ${index + 1}`}
                        className="aspect-[4/3] w-full object-cover"
                      />

                      {/* Main image */}
                      {index === 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-green-900 px-2.5 py-1 text-[10px] font-medium text-white">
                          Main image
                        </span>
                      )}

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-sm font-medium text-red-600 shadow-sm transition hover:bg-white"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        ×
                      </button>
                    </div>

                    <p className="mt-2 truncate text-xs text-stone-500">
                      {image.type === "existing"
                        ? "Current image"
                        : image.file.name}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {images.length > 0 && (
              <p className="mt-4 text-xs font-medium text-green-700">
                {images.length} of 5 images selected
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
              <p
                key={message}
                className="mt-1 text-xs text-red-600"
              >
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
              Active products can be displayed on the public
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

        {/* Success */}
        {success && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {success}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={saving || uploadingImage}
            className="w-full rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              saving ||
              uploadingImage ||
              loadingCategories ||
              isCropping ||
              pendingFiles.length > 0
            }
            className="w-full rounded-full bg-green-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {uploadingImage
              ? "Uploading images..."
              : saving
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Create Product"
                  : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Cropper */}
      {isCropping && (
        <ImageCropper
          image={cropImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
        />
      )}
    </>
  );
}
