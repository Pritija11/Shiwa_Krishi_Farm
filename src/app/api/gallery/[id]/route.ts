import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { gallerySchema } from "@/validations/gallery";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/gallery/[id]
export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const galleryItem = await prisma.galleryItem.findUnique({
      where: {
        id,
      },
    });

    if (!galleryItem) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error("Failed to fetch gallery item:", error);

    return NextResponse.json(
      { error: "Failed to fetch gallery item" },
      { status: 500 }
    );
  }
}

// PUT /api/gallery/[id]
export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const existingItem = await prisma.galleryItem.findUnique({
      where: {
        id,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

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

    const galleryItem = await prisma.galleryItem.update({
      where: {
        id,
      },
      data: {
        title,
        description: description || null,
        mediaUrl,
        mediaType,
        category,
        isActive,
      },
    });

    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error("Failed to update gallery item:", error);

    return NextResponse.json(
      { error: "Failed to update gallery item" },
      { status: 500 }
    );
  }
}

// PATCH /api/gallery/[id]
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const existingItem = await prisma.galleryItem.findUnique({
      where: {
        id,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (typeof body.isActive !== "boolean") {
      return NextResponse.json(
        { error: "isActive must be a boolean" },
        { status: 400 }
      );
    }

    const galleryItem = await prisma.galleryItem.update({
      where: {
        id,
      },
      data: {
        isActive: body.isActive,
      },
    });

    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error("Failed to update gallery status:", error);

    return NextResponse.json(
      { error: "Failed to update gallery status" },
      { status: 500 }
    );
  }
}