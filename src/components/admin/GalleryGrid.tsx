import Image from "next/image";
import Link from "next/link";

import { getS3Url } from "@/lib/s3-url";
import ArchiveGalleryButton from "@/components/admin/ArchiveGalleryButton";

type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  category:
    | "FARM"
    | "ANIMALS"
    | "POULTRY"
    | "GOATS"
    | "DAIRY"
    | "VEGETABLES"
    | "FAMILY"
    | "OTHER";
  isActive: boolean;
  createdAt: Date;
};

type GalleryGridProps = {
  items: GalleryItem[];
};

export default async function GalleryGrid({
  items,
}: GalleryGridProps) {
  const itemsWithUrls = await Promise.all(
    items.map(async (item) => ({
      ...item,
      mediaUrl: item.mediaUrl.startsWith("/")
        ? item.mediaUrl
        : await getS3Url(item.mediaUrl),
    }))
  );

  return (
    <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {itemsWithUrls.map((item) => (
        <article
          key={item.id}
          className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
        >
          {/* Media */}
          <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
            {item.mediaType === "IMAGE" ? (
              <Image
                src={item.mediaUrl}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <video
                src={item.mediaUrl}
                className="h-full w-full object-cover"
                muted
                playsInline
              />
            )}

            {/* Status */}
            <div className="absolute left-3 top-3">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${
                  item.isActive
                    ? "bg-white/90 text-green-800"
                    : "bg-stone-900/75 text-white"
                }`}
              >
                {item.isActive ? "Active" : "Archived"}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-green-950">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs font-medium text-green-800">
                  {formatCategory(item.category)}
                </p>
              </div>

              <span className="shrink-0 rounded-md bg-stone-100 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-stone-500">
                {item.mediaType}
              </span>
            </div>

            {/* Description */}
            {item.description && (
              <p className="mt-3 line-clamp-2 text-xs leading-5 text-stone-500">
                {item.description}
              </p>
            )}

            {/* Actions */}
            <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
              <p className="text-[11px] text-stone-400">
                {formatDate(item.createdAt)}
              </p>

              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/gallery/${item.id}/edit`}
                  className="text-xs font-medium text-green-800 transition hover:text-green-950"
                >
                  Edit
                </Link>

                <ArchiveGalleryButton
                  id={item.id}
                  isActive={item.isActive}
                />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function formatCategory(category: GalleryItem["category"]) {
  return (
    category.charAt(0) +
    category.slice(1).toLowerCase()
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}