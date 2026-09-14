import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import MilkSubscriptionForm from "@/components/milk-subscription/MilkSubscriptionForm";

export const metadata: Metadata = {
  title: "Milk Subscription",
  description:
    "Subscribe to fresh cow milk delivery from Shiwa Krishi Farm. Choose daily, weekly, or custom delivery days that fit your household.",
};

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
