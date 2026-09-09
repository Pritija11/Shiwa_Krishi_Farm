import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { s3 } from "@/lib/s3";
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

// DELETE /api/gallery/[id]
export async function DELETE(
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

    if (existingItem.isActive) {
      return NextResponse.json(
        {
          error:
            "Only archived gallery items can be deleted. Archive it first.",
        },
        { status: 409 }
      );
    }

    await prisma.galleryItem.delete({
      where: {
        id,
      },
    });

    if (!existingItem.mediaUrl.startsWith("/")) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: existingItem.mediaUrl,
          })
        );
      } catch (error) {
        console.error(
          "Failed to delete gallery media from S3:",
          error
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete gallery item:", error);

    return NextResponse.json(
      { error: "Failed to delete gallery item" },
      { status: 500 }
    );
  }
}