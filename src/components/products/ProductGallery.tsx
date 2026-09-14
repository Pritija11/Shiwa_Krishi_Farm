"use client";

import { useState } from "react";
import Image from "next/image";

type Availability = "In Stock" | "Seasonal" | "Out of Stock";

type ProductGalleryProps = {
  images: string[];
  productName: string;
  category: string;
  availability: Availability;
};

const availabilityStyles: Record<Availability, string> = {
  "In Stock": "bg-green-100 text-green-800",
  Seasonal: "bg-amber-100 text-amber-800",
  "Out of Stock": "bg-stone-100 text-stone-500",
};

export default function ProductGallery({
  images,
  productName,
  category,
  availability,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = images[activeIndex];

  return (
    <div className="min-w-0">
      <div className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#E7E3D8]">
        {activeImage ? (
          <Image
            src={activeImage}
            alt={productName}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-500">
            No image available
          </div>
        )}

        <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
          <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-green-950 shadow-sm">
            {category}
          </span>
        </div>

        <div className="absolute right-4 top-4 sm:right-5 sm:top-5">
          <span
            className={`rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider shadow-sm ${availabilityStyles[availability]}`}
          >
            {availability}
          </span>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 rounded-full bg-green-950/80 px-2.5 py-1 text-[11px] font-medium text-white/90 sm:bottom-5 sm:right-5">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1} of ${productName}`}
              aria-current={index === activeIndex}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl transition-all duration-200 sm:h-24 sm:w-24 ${
                index === activeIndex
                  ? "opacity-100 ring-2 ring-green-800 ring-offset-2 ring-offset-[#F8F5ED]"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                sizes="96px"
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
