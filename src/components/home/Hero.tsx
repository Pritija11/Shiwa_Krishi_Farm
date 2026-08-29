"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const heroImages = [
  "/images/farm-hero-image.jpg",
  "/images/hero-goats.jpg",
  "/images/hero-veggies.jpg",
  "/images/hero-dairy.jpg",
];

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Hero Images */}
      {heroImages.map((image, index) => (
        <Image
          key={image}
          src={image}
          alt="Shiwa Krishi Farm"
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover object-center transition-all duration-[6000ms] ease-out ${
  index === currentImage
    ? "scale-110 opacity-100"
    : "scale-100 opacity-0"
}`}
        />
      ))}

      {/* Green Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-950/80 via-green-900/50 to-green-950/30" />

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto w-full max-w-7xl px-6 pt-24">
          <div className="max-w-2xl text-white">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-green-200">
              Fresh • Natural • Local
            </p>

            <h1 className="font-[family-name:var(--font-dm-serif)] text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Fresh From Our Farm,
              <span className="block text-green-200">
                Straight To Your Table.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">
              Fresh milk, organic vegetables, poultry and farm-raised
              products grown and cared for with love.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-full bg-green-600 px-7 py-3.5 font-medium text-white transition hover:bg-green-700"
              >
                Explore Products
              </Link>

              <Link
                href="/order"
                className="rounded-full border border-white/70 bg-white/10 px-7 py-3.5 font-medium text-white backdrop-blur-sm transition hover:bg-white hover:text-green-800"
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}