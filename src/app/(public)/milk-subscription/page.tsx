import { prisma } from "@/lib/prisma";
import MilkSubscriptionForm from "@/components/milk-subscription/MilkSubscriptionForm";

export default async function MilkSubscriptionPage() {
  const [settings, milkProducts] = await Promise.all([
    prisma.siteSettings.findUnique({
      where: {
        id: "site-settings",
      },
      select: {
        whatsapp: true,
        phone: true,
        deliveryAreas: true,
        deliveryDays: true,
      },
    }),

    prisma.product.findMany({
      where: {
        isActive: true,
        category: {
          name: "Dairy",
        },
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  return (
    <MilkSubscriptionForm
      whatsapp={settings?.whatsapp ?? ""}
      phone={settings?.phone ?? ""}
      deliveryAreas={settings?.deliveryAreas ?? ""}
      deliveryDays={settings?.deliveryDays ?? ""}
      products={milkProducts}
      isAvailable={milkProducts.length > 0}
    />
  );
}
