export type GalleryCategory =
  | "FARM"
  | "ANIMALS"
  | "POULTRY"
  | "GOATS"
  | "DAIRY"
  | "VEGETABLES"
  | "FAMILY"
  | "OTHER";

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  "FARM",
  "ANIMALS",
  "POULTRY",
  "GOATS",
  "DAIRY",
  "VEGETABLES",
  "FAMILY",
  "OTHER",
];

export function formatGalleryCategory(category: GalleryCategory) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}
