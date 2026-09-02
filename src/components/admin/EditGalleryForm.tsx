"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type GalleryCategory =
  | "FARM"
  | "ANIMALS"
  | "POULTRY"
  | "GOATS"
  | "DAIRY"
  | "VEGETABLES"
  | "FAMILY"
  | "OTHER";

type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  mediaUrl: string;
  currentMediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  category: GalleryCategory;
  isActive: boolean;
};

type EditGalleryFormProps = {
  item: GalleryItem;
};

const categories: GalleryCategory[] = [
  "FARM",
  "ANIMALS",
  "POULTRY",
  "GOATS",
  "DAIRY",
  "VEGETABLES",
  "FAMILY",
  "OTHER",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

export default function EditGalleryForm({
  item,
}: EditGalleryFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(
    item.description ?? ""
  );
  const [category, setCategory] =
    useState<GalleryCategory>(item.category);
  const [isActive, setIsActive] = useState(item.isActive);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(
    item.currentMediaUrl
  );
  const [previewType, setPreviewType] = useState(item.mediaType);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setError("");

    const isImage = selectedFile.type.startsWith("image/");
    const isVideo = selectedFile.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setError("Please select an image or video.");
      return;
    }

    if (isImage && selectedFile.size > MAX_IMAGE_SIZE) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    if (isVideo && selectedFile.size > MAX_VIDEO_SIZE) {
      setError("Video must be smaller than 50MB.");
      return;
    }

    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl = URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setPreviewUrl(newPreviewUrl);
    setPreviewType(isImage ? "IMAGE" : "VIDEO");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setIsSaving(true);

    try {
      let mediaUrl = item.mediaUrl;
      let mediaType = item.mediaType;

      /*
       * If the user selected a new file,
       * upload it first.
       */
      if (file) {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("folder", "gallery");

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadData.error || "Failed to upload media."
          );
        }

        mediaUrl = uploadData.key;
        mediaType = uploadData.mediaType;
      }

      /*
       * Update the database record.
       */
      const response = await fetch(`/api/gallery/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          mediaUrl,
          mediaType,
          category,
          isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update gallery item."
        );
      }

      router.push("/admin/gallery");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-6">
        {/* Current media */}
        <div>
          <label className="mb-2 block text-sm font-medium text-green-950">
            Media
          </label>

          <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
            <div className="relative aspect-video">
              {previewType === "IMAGE" ? (
                <Image
                  src={previewUrl}
                  alt={title || "Gallery media"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              ) : (
                <video
                  src={previewUrl}
                  controls
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>

          <label className="mt-3 block">
            <span className="mb-2 block text-xs font-medium text-stone-600">
              Replace media (optional)
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
              onChange={handleFileChange}
              className="block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-600 file:mr-4 file:rounded-md file:border-0 file:bg-stone-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-stone-700"
            />
          </label>

          <p className="mt-2 text-xs text-stone-400">
            Images: JPG, PNG, WEBP up to 5MB. Videos: MP4, WEBM up to
            50MB.
          </p>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-green-950"
          >
            Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={100}
            className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
            placeholder="Enter gallery title"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-green-950"
          >
            Category
          </label>

          <select
            id="category"
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value as GalleryCategory
              )
            }
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
          >
            {categories.map((categoryOption) => (
              <option
                key={categoryOption}
                value={categoryOption}
              >
                {formatCategory(categoryOption)}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-green-950"
          >
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            maxLength={500}
            rows={4}
            className="w-full resize-none rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
            placeholder="Optional description"
          />

          <p className="mt-1 text-right text-xs text-stone-400">
            {description.length}/500
          </p>
        </div>

        {/* Status */}
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) =>
                setIsActive(event.target.checked)
              }
              className="h-4 w-4 rounded border-stone-300 text-green-700 focus:ring-green-600"
            />

            <div>
              <p className="text-sm font-medium text-green-950">
                Active
              </p>

              <p className="text-xs text-stone-500">
                {isActive
                  ? "This item is visible on the public gallery."
                  : "This item is archived and hidden from the public gallery."}
              </p>
            </div>
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-stone-100 pt-5">
          <button
            type="button"
            onClick={() => router.push("/admin/gallery")}
            disabled={isSaving}
            className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-green-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

function formatCategory(category: GalleryCategory) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}