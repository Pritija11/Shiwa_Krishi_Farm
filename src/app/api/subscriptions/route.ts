import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { subscriptionSchema } from "@/validations/subscription";
import { calculateEndDate } from "@/lib/subscription-duration";
import {
  checkPublicFormRateLimit,
  getClientIpFromRequest,
} from "@/lib/public-form-rate-limit";

// POST /api/subscriptions
export async function POST(request: Request) {
  try {
    const ip = getClientIpFromRequest(request);
    const rateLimit = checkPublicFormRateLimit(`${ip}:subscription`, {
      max: 5,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many requests submitted. Please try again in ${rateLimit.retryAfterMinutes} minute(s).`,
        },
        { status: 429 },
      );
    }

    const body = await request.json();

    const result = subscriptionSchema.safeParse({
      ...body,
      quantity:
        typeof body.quantity === "string"
          ? Number(body.quantity)
          : body.quantity,
    });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      return NextResponse.json(
        {
          error: "Validation failed",
          fields: errors,
        },
        { status: 400 },
      );
    }

    const {
      customerName,
      phone,
      email,
      deliveryAddress,
      productId,
      quantity,
      frequency,
      deliveryDays,
      startDate,
      duration,
      message,
    } = result.data;

    // The chosen product is re-verified against the DB rather than trusted
    // outright: it must still be an active Dairy-category product at the
    // moment of submission, regardless of what the client claims.
    const milkProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        isActive: true,
        category: {
          name: "Dairy",
        },
      },
    });

    if (!milkProduct) {
      return NextResponse.json(
        {
          error: "Validation failed",
          fields: {
            productId: ["Selected product is not currently available"],
          },
        },
        { status: 400 },
      );
    }

    // Daily deliveries have no specific days; clear any stray values so the
    // stored data always reflects what the frequency actually means.
    const resolvedDeliveryDays =
      frequency === "DAILY" ? [] : deliveryDays;

    const startDateObj = new Date(startDate);
    const endDate = calculateEndDate(startDateObj, duration);

    const subscription = await prisma.milkSubscription.create({
      data: {
        customerName,
        phone,
        email: email ?? null,
        deliveryAddress,
        productId: milkProduct.id,
        quantity,
        unit: "LITRE",
        frequency,
        deliveryDays: resolvedDeliveryDays,
        startDate: startDateObj,
        duration,
        endDate,
        message: message ?? null,
      },
    });

    try {
      await createNotification({
        title: "New Milk Subscription",
        message: `${subscription.customerName} requested a ${subscription.frequency.toLowerCase()} milk subscription.`,
        type: "MILK_SUBSCRIPTION",
      });
    } catch (error) {
      console.error("Failed to create milk subscription notification:", error);
    }

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error("Failed to create milk subscription:", error);

    return NextResponse.json(
      { error: "Failed to create milk subscription" },
      { status: 500 },
    );
  }
}
