import type { Metadata } from "next";
import Image from "next/image";
import Hero from "@/components/home/Hero";
import ProductCategories from "@/components/home/ProductCategories";
import AboutFarm from "@/components/home/AboutFarm";
import Products from "@/components/products/Products";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import OrderCTA from "@/components/home/OrderCTA";
import { prisma } from "@/lib/prisma";
import { getS3Url } from "@/lib/s3-url";

export const metadata: Metadata = {
  title: "Fresh Farm Products in Gokarneshwor, Nepal",
  description:
    "Shiwa Krishi Farm grows and raises fresh, organic poultry, goat meat, cow milk, and vegetables in Gokarneshwor, Bagmati Province. Order directly or subscribe to daily milk delivery across Kathmandu Valley.",
};

export default async function Home() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "site-settings" },
    select: { heroImages: true },
  });

  const heroImages = await Promise.all(
    (settings?.heroImages ?? []).map((key) => getS3Url(key))
  );

  return (
    <div>
      <Hero images={heroImages} />
      <ProductCategories />
      <AboutFarm />
      <Products />
      <WhyChooseUs />
      <OrderCTA />
    </div>
  );
}

    