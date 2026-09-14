export type MediaType = "IMAGE" | "VIDEO";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

export function getMediaTypeFromFile(file: File): MediaType | null {
  if (file.type.startsWith("image/")) {
    return "IMAGE";
  }

  if (file.type.startsWith("video/")) {
    return "VIDEO";
  }

  return null;
}

export function validateGalleryMediaFile(file: File): string | null {
  const mediaType = getMediaTypeFromFile(file);

  if (!mediaType) {
    return "Please select an image or video file.";
  }

  if (mediaType === "IMAGE" && file.size > MAX_IMAGE_SIZE) {
    return "Image must be smaller than 5MB.";
  }

  if (mediaType === "VIDEO" && file.size > MAX_VIDEO_SIZE) {
    return "Video must be smaller than 50MB.";
  }

  return null;
}

export async function uploadGalleryMedia(file: File) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("folder", "gallery");

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to upload media.");
  }

  return {
    key: data.key as string,
    mediaType: data.mediaType as MediaType,
  };
}
