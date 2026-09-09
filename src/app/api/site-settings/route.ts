import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { siteSettingsSchema } from "@/validations/site-settings";

// PUT /api/site-settings
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const result = siteSettingsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error:
            result.error.issues[0]?.message || "Validation failed",
        },
        { status: 400 }
      );
    }

    const {
      phone,
      whatsapp,
      email,
      address,
      locationUrl,
      googleMapsUrl,
      workingHours,
      deliveryAreas,
      deliveryDays,
      facebookUrl,
      instagramUrl,
      tiktokUrl,
    } = result.data;

    const data = {
      phone,
      whatsapp,
      email,
      address,
      locationUrl: locationUrl || null,
      googleMapsUrl: googleMapsUrl || null,
      workingHours: workingHours || null,
      deliveryAreas: deliveryAreas || null,
      deliveryDays: deliveryDays || null,
      facebookUrl: facebookUrl || null,
      instagramUrl: instagramUrl || null,
      tiktokUrl: tiktokUrl || null,
    };

    const settings = await prisma.siteSettings.upsert({
      where: {
        id: "site-settings",
      },
      update: data,
      create: {
        id: "site-settings",
        ...data,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to update site settings:", error);

    return NextResponse.json(
      { error: "Failed to update site settings" },
      { status: 500 }
    );
  }
}
