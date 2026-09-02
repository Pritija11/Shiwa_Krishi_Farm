"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const statusOrder = {
  NEW: 0,
  READ: 1,
  RESOLVED: 2,
} as const;

type ContactMessageStatus = keyof typeof statusOrder;

export async function updateContactMessageStatus(
  id: string,
  newStatus: ContactMessageStatus
) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!session.user.role || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const contactMessage = await prisma.contactMessage.findUnique({
    where: {
      id,
    },
    select: {
      status: true,
    },
  });

  if (!contactMessage) {
    throw new Error("Contact message not found");
  }

  const currentStatus = contactMessage.status as ContactMessageStatus;

  if (statusOrder[newStatus] !== statusOrder[currentStatus] + 1) {
    throw new Error("Invalid status transition");
  }

  await prisma.contactMessage.update({
    where: {
      id,
    },
    data: {
      status: newStatus,
    },
  });

  revalidatePath("/admin/contact-messages");
  revalidatePath(`/admin/contact-messages/${id}`);
}