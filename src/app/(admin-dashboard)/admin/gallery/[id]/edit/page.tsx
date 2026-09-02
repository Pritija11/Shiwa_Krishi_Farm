import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getS3Url } from "@/lib/s3-url";
import EditGalleryForm from "@/components/admin/EditGalleryForm";

type EditGalleryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditGalleryPage({
  params,
}: EditGalleryPageProps) {
  const { id } = await params;

  const galleryItem = await prisma.galleryItem.findUnique({
    where: {
      id,
    },
  });

  if (!galleryItem) {
    notFound();
  }

  const currentMediaUrl = galleryItem.mediaUrl.startsWith("/")
    ? galleryItem.mediaUrl
    : await getS3Url(galleryItem.mediaUrl);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-green-950">
          Edit Gallery Item
        </h1>

        <p className="mt-1 text-sm text-stone-500">
          Update the gallery item or archive it.
        </p>
      </div>

      <EditGalleryForm
        item={{
          id: galleryItem.id,
          title: galleryItem.title,
          description: galleryItem.description,
          mediaUrl: galleryItem.mediaUrl,
          currentMediaUrl,
          mediaType: galleryItem.mediaType,
          category: galleryItem.category,
          isActive: galleryItem.isActive,
        }}
      />
    </div>
  );
}