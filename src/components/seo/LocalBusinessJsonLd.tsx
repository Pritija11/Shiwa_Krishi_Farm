import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

export default async function LocalBusinessJsonLd() {
  let settings = null;

  try {
    settings = await prisma.siteSettings.findUnique({
      where: { id: "site-settings" },
    });
  } catch (error) {
    console.error("LocalBusinessJsonLd: could not load site settings, skipping JSON-LD.", error);
    return null;
  }

  if (!settings) {
    return null;
  }

  const siteUrl = getSiteUrl();

  // Google doesn't support SVG for the `logo` property, so this points at
  // the raster app icon rather than the source logo.svg.
  const logoUrl = `${siteUrl}/icon.png`;
  const imageUrl = `${siteUrl}/images/farm-hero-image.jpg`;

  const sameAs = [
    settings.facebookUrl,
    settings.instagramUrl,
    settings.tiktokUrl,
  ].filter((url): url is string => Boolean(url));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Shiwa Krishi Tatha Pasupanchi Farm",
    description:
      "Fresh, organic farm products including poultry, goat meat, cow milk, and vegetables in Gokarneshwor, Bagmati Province, Nepal.",
    url: siteUrl,
    logo: logoUrl,
    image: imageUrl,
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "QC43+PHV",
      addressLocality: "Gokarneshwor",
      addressRegion: "Bagmati Province",
      postalCode: "44600",
      addressCountry: "NP",
    },
    ...(settings.googleMapsUrl
      ? { hasMap: settings.googleMapsUrl }
      : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
