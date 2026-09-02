import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/validations/product";

// GET /api/products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = productSchema.safeParse({
      ...body,
      price:
        typeof body.price === "string"
          ? Number(body.price)
          : body.price,
    });

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
      name,
      description,
      price,
      unit,
      availability,
      imageUrl,
      categoryId,
    } = result.data;

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          error: "Validation failed",
          fields: {
            categoryId: ["Selected category does not exist"],
          },
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        unit,
        availability,
        imageUrl: imageUrl || null,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}