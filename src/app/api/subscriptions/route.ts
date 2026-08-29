import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/subscriptions
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerName,
      phone,
      email,
      deliveryAddress,
      quantity,
      frequency,
      startDate,
      message,
    } = body;

    if (
      !customerName ||
      !phone ||
      !deliveryAddress ||
      quantity === undefined ||
      !frequency ||
      !startDate
    ) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    if (!["DAILY", "WEEKLY"].includes(frequency)) {
      return NextResponse.json(
        { error: "Invalid subscription frequency" },
        { status: 400 }
      );
    }

    const subscription = await prisma.milkSubscription.create({
      data: {
        customerName,
        phone,
        email: email || null,
        deliveryAddress,
        quantity,
        unit: "LITRE",
        frequency,
        startDate: new Date(startDate),
        message: message || null,
      },
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error("Failed to create milk subscription:", error);

    return NextResponse.json(
      { error: "Failed to create milk subscription" },
      { status: 500 }
    );
  }
}

// GET /api/subscriptions
export async function GET() {
  try {
    const subscriptions = await prisma.milkSubscription.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Failed to fetch milk subscriptions:", error);

    return NextResponse.json(
      { error: "Failed to fetch milk subscriptions" },
      { status: 500 }
    );
  }
}