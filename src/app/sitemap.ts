import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, priority: 1 },
    { url: `${siteUrl}/about`, priority: 0.7 },
    { url: `${siteUrl}/products`, priority: 0.9 },
    { url: `${siteUrl}/order`, priority: 0.8 },
    { url: `${siteUrl}/milk-subscription`, priority: 0.8 },
    { url: `${siteUrl}/gallery`, priority: 0.5 },
    { url: `${siteUrl}/contact`, priority: 0.7 },
    { url: `${siteUrl}/privacy`, priority: 0.2 },
    { url: `${siteUrl}/terms`, priority: 0.2 },
  ];

  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, updatedAt: true },
  });

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/products/${product.id}`,
    lastModified: product.updatedAt,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
