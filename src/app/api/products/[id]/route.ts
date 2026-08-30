import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getS3Url } from "@/lib/s3-url";

// GET /api/products/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    let imagePreviewUrl = null;

    if (product.imageUrl) {
      imagePreviewUrl = await getS3Url(product.imageUrl);
    }

    return NextResponse.json({
      ...product,
      imagePreviewUrl,
    });
  } catch (error) {
    console.error("Failed to fetch product:", error);

    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const {
      name,
      description,
      price,
      unit,
      availability,
      imageUrl,
      categoryId,
      isActive,
    } = body;

    if (
      !name ||
      !description ||
      price === undefined ||
      !unit ||
      !categoryId
    ) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        price,
        unit,
        availability: availability ?? "IN_STOCK",
        imageUrl:
          imageUrl !== undefined
            ? imageUrl
            : existingProduct.imageUrl,
        categoryId,
        isActive: isActive ?? true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to update product:", error);

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}