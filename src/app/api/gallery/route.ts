import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    console.error("Failed to fetch gallery items:", error);

    return NextResponse.json(
      { error: "Failed to fetch gallery items" },
      { status: 500 }
    );
  }
}

// POST /api/gallery
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      description,
      mediaUrl,
      mediaType,
      category,
    } = body;

    if (!title || !mediaUrl) {
      return NextResponse.json(
        { error: "Title and media URL are required" },
        { status: 400 }
      );
    }

    if (
      mediaType &&
      !["IMAGE", "VIDEO"].includes(mediaType)
    ) {
      return NextResponse.json(
        { error: "Invalid media type" },
        { status: 400 }
      );
    }

    if (
      category &&
      ![
        "FARM",
        "ANIMALS",
        "POULTRY",
        "GOATS",
        "DAIRY",
        "VEGETABLES",
        "FAMILY",
        "OTHER",
      ].includes(category)
    ) {
      return NextResponse.json(
        { error: "Invalid gallery category" },
        { status: 400 }
      );
    }

    const galleryItem = await prisma.galleryItem.create({
      data: {
        title,
        description: description || null,
        mediaUrl,
        mediaType: mediaType || "IMAGE",
        category: category || "FARM",
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