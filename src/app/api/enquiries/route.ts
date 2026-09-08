import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enquirySchema } from "@/validations/enquiry";
import { createNotification } from "@/lib/notifications";

// POST /api/enquiries
export async function POST(request: Request) {
  try {
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    // Validate request data
    const validation = enquirySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const {
      customerName,
      phone,
      email,
      productId,
      quantity,
      deliveryAddress,
      preferredDate,
      message,
    } = validation.data;

    // Validate preferred date
    const parsedDate = new Date(preferredDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid preferred date" },
        { status: 400 },
      );
    }

    // Check that the product exists and is active
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        isActive: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check product availability
    if (product.availability === "OUT_OF_STOCK") {
      return NextResponse.json(
        { error: "This product is currently out of stock" },
        { status: 400 },
      );
    }

    // Create enquiry
    const enquiry = await prisma.enquiry.create({
      data: {
        customerName,
        phone,
        email: email || null,
        productId,
        quantity,
        deliveryAddress,
        preferredDate: parsedDate,
        message: message || null,
      },
      include: {
        product: true,
      },
    });

    try {
      await createNotification({
        title: "New Customer Enquiry",
        message: `${enquiry.customerName} submitted an enquiry for ${enquiry.product.name}.`,
        type: "ENQUIRY",
      });
    } catch (error) {
      console.error("Failed to create enquiry notification:", error);
    }

    return NextResponse.json(enquiry, { status: 201 });
  } catch (error) {
    console.error("Failed to create enquiry:", error);

    return NextResponse.json(
      { error: "Failed to create enquiry" },
      { status: 500 },
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
      { status: 500 },
    );
  }
}
