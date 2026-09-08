import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { gallerySchema } from "@/validations/gallery";

// GET /api/gallery
export async function GET() {
  try {
    const galleryItems = await prisma.galleryItem.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error("Failed to fetch gallery:", error);

    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}

// POST /api/gallery
export async function POST(request: Request) {
  try {
    // ---------------------------------------
    // Authentication
    // ---------------------------------------

    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ---------------------------------------
    // Parse request
    // ---------------------------------------

    const body = await request.json();

    // ---------------------------------------
    // Validate request
    // ---------------------------------------

    const result = gallerySchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      return NextResponse.json(
        {
          error: "Validation failed",
          fields: errors,
        },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      mediaUrl,
      mediaType,
      category,
      isActive,
    } = result.data;

    // ---------------------------------------
    // Create gallery item
    // ---------------------------------------

    const galleryItem = await prisma.galleryItem.create({
      data: {
        title,
        description: description || null,
        mediaUrl,
        mediaType,
        category,
        isActive,
      },
    });

    return NextResponse.json(galleryItem, { status: 201 });
  } catch (error) {
    console.error("Failed to create gallery item:", error);

    return NextResponse.json(
      { error: "Failed to create gallery item" },
      { status: 500 }
    );
  }
}