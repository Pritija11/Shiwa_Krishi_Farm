import { prisma } from "@/lib/prisma";
import { getS3Url } from "@/lib/s3-url";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";

export default async function SiteSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: {
      id: "site-settings",
    },
  });

  const heroImages = await Promise.all(
    (settings?.heroImages ?? []).map(async (key) => ({
      key,
      url: await getS3Url(key),
    }))
  );

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
          Website Configuration
        </p>

        <h1 className="mt-2 font-[family-name:var(--font-dm-serif)] text-2xl text-green-950 sm:text-3xl">
          Site Settings
        </h1>

        <p className="mt-3 text-sm text-stone-600">
          Manage contact information, delivery details, and social links
          displayed across the farm website.
        </p>
      </div>

      {/* Settings Form */}
      <div className="mt-8">
        <SiteSettingsForm
          initialData={{
            phone: settings?.phone ?? "",
            whatsapp: settings?.whatsapp ?? "",
            email: settings?.email ?? "",
            address: settings?.address ?? "",
            locationUrl: settings?.locationUrl ?? "",
            googleMapsUrl: settings?.googleMapsUrl ?? "",
            googleBusinessProfileUrl: settings?.googleBusinessProfileUrl ?? "",
            workingHours: settings?.workingHours ?? "",
            deliveryAreas: settings?.deliveryAreas ?? "",
            deliveryDays: settings?.deliveryDays ?? "",
            facebookUrl: settings?.facebookUrl ?? "",
            instagramUrl: settings?.instagramUrl ?? "",
            tiktokUrl: settings?.tiktokUrl ?? "",
          }}
          initialHeroImages={heroImages}
        />
      </div>
    </div>
  );
}