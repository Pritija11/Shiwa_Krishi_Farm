import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/enquiries
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerName,
      phone,
      email,
      productId,
      quantity,
      deliveryAddress,
      preferredDate,
      message,
    } = body;

    // Validate required fields
    if (
      !customerName ||
      !phone ||
      !productId ||
      quantity === undefined ||
      !deliveryAddress ||
      !preferredDate
    ) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Check that the product exists and is available
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        isActive: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.availability === "OUT_OF_STOCK") {
      return NextResponse.json(
        { error: "This product is currently out of stock" },
        { status: 400 }
      );
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        customerName,
        phone,
        email: email || null,
        productId,
        quantity,
        deliveryAddress,
        preferredDate: new Date(preferredDate),
        message: message || null,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(enquiry, { status: 201 });
  } catch (error) {
    console.error("Failed to create enquiry:", error);

    return NextResponse.json(
      { error: "Failed to create enquiry" },
      { status: 500 }
    );
  }
}

// GET /api/enquiries
export async function GET() {
  try {
    const enquiries = await prisma.enquiry.findMany({
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(enquiries);
  } catch (error) {
    console.error("Failed to fetch enquiries:", error);

    return NextResponse.json(
      { error: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}