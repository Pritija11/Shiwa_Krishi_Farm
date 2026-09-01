"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const validTransitions = {
  PENDING: ["ACTIVE", "CANCELLED"],
  ACTIVE: ["PAUSED", "CANCELLED"],
  PAUSED: ["ACTIVE", "CANCELLED"],
  CANCELLED: [],
} as const;

type SubscriptionStatus =
  | "PENDING"
  | "ACTIVE"
  | "PAUSED"
  | "CANCELLED";

export async function updateSubscriptionStatus(
  subscriptionId: string,
  newStatus: SubscriptionStatus
) {
  // 1. Check authentication
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: "Unauthorized.",
    };
  }

  // 2. Check authorization
  if (session.user.role !== "ADMIN") {
    return {
      success: false,
      error: "You are not authorized to perform this action.",
    };
  }

  // 3. Validate subscription ID
  if (!subscriptionId) {
    return {
      success: false,
      error: "Subscription ID is required.",
    };
  }

  // 4. Find the subscription
  const subscription = await prisma.milkSubscription.findUnique({
    where: {
      id: subscriptionId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!subscription) {
    return {
      success: false,
      error: "Subscription not found.",
    };
  }

  // 5. Get current status
  const currentStatus = subscription.status as SubscriptionStatus;

  // 6. Check whether this status change is allowed
  const allowedStatuses = validTransitions[currentStatus];

  if (!allowedStatuses.includes(newStatus as never)) {
    return {
      success: false,
      error: `Cannot change subscription from ${currentStatus} to ${newStatus}.`,
    };
  }

  // 7. Update database
  await prisma.milkSubscription.update({
    where: {
      id: subscriptionId,
    },
    data: {
      status: newStatus,
    },
  });

  // 8. Refresh affected pages
  revalidatePath(`/admin/subscriptions/${subscriptionId}`);
  revalidatePath("/admin/subscriptions");

  return {
    success: true,
  };
}