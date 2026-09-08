import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type SiteSettingsInput = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  locationUrl?: string;
  googleMapsUrl?: string;
  workingHours?: string;
  deliveryAreas?: string;
  deliveryDays?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
};

// GET /api/site-settings
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch site settings:", error);

    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}

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

    const body = (await request.json()) as SiteSettingsInput;

    if (!body.phone?.trim()) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    if (!body.whatsapp?.trim()) {
      return NextResponse.json(
        { error: "WhatsApp number is required" },
        { status: 400 }
      );
    }

    if (!body.email?.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!body.address?.trim()) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    const settings = await prisma.siteSettings.upsert({
      where: {
        id: "site-settings",
      },
      update: {
        phone: body.phone.trim(),
        whatsapp: body.whatsapp.trim(),
        email: body.email.trim(),
        address: body.address.trim(),
        locationUrl: body.locationUrl?.trim() || null,
        googleMapsUrl: body.googleMapsUrl?.trim() || null,
        workingHours: body.workingHours?.trim() || null,
        deliveryAreas: body.deliveryAreas?.trim() || null,
        deliveryDays: body.deliveryDays?.trim() || null,
        facebookUrl: body.facebookUrl?.trim() || null,
        instagramUrl: body.instagramUrl?.trim() || null,
        tiktokUrl: body.tiktokUrl?.trim() || null,
      },
      create: {
        id: "site-settings",
        phone: body.phone.trim(),
        whatsapp: body.whatsapp.trim(),
        email: body.email.trim(),
        address: body.address.trim(),
        locationUrl: body.locationUrl?.trim() || null,
        googleMapsUrl: body.googleMapsUrl?.trim() || null,
        workingHours: body.workingHours?.trim() || null,
        deliveryAreas: body.deliveryAreas?.trim() || null,
        deliveryDays: body.deliveryDays?.trim() || null,
        facebookUrl: body.facebookUrl?.trim() || null,
        instagramUrl: body.instagramUrl?.trim() || null,
        tiktokUrl: body.tiktokUrl?.trim() || null,
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