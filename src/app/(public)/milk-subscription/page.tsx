import { prisma } from "@/lib/prisma";
import MilkSubscriptionForm from "@/components/milk-subscription/MilkSubscriptionForm";

export default async function MilkSubscriptionPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: {
      id: "site-settings",
    },
    select: {
      whatsapp: true,
    },
  });

  return <MilkSubscriptionForm whatsapp={settings?.whatsapp ?? ""} />;
}