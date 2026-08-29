import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/settings
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      return NextResponse.json(
        { error: "Site settings not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch site settings:", error);

    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}

// POST /api/settings
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      phone,
      whatsapp,
      email,
      address,
      locationUrl,
      workingHours,
      deliveryAreas,
      deliveryDays,
      facebookUrl,
      instagramUrl,
      tiktokUrl,
    } = body;

    if (!phone || !whatsapp || !email || !address) {
      return NextResponse.json(
        { error: "Required site information is missing" },
        { status: 400 }
      );
    }

    const existingSettings = await prisma.siteSettings.findFirst();

    const data = {
      phone,
      whatsapp,
      email,
      address,
      locationUrl: locationUrl || null,
      workingHours: workingHours || null,
      deliveryAreas: deliveryAreas || null,
      deliveryDays: deliveryDays || null,
      facebookUrl: facebookUrl || null,
      instagramUrl: instagramUrl || null,
      tiktokUrl: tiktokUrl || null,
    };

    const settings = existingSettings
      ? await prisma.siteSettings.update({
          where: {
            id: existingSettings.id,
          },
          data,
        })
      : await prisma.siteSettings.create({
          data,
        });

    return NextResponse.json(settings, {
      status: existingSettings ? 200 : 201,
    });
  } catch (error) {
    console.error("Failed to save site settings:", error);

    return NextResponse.json(
      { error: "Failed to save site settings" },
      { status: 500 }
    );
  }
}