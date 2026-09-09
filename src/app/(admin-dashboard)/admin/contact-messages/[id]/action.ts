"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  contactMessageStatusOrder,
  type ContactMessageStatus,
} from "@/lib/contact-message-status";

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

  if (
    contactMessageStatusOrder[newStatus] !==
    contactMessageStatusOrder[currentStatus] + 1
  ) {
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

export async function deleteContactMessage(id: string) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
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

  if (contactMessage.status !== "RESOLVED") {
    throw new Error(
      "Only resolved messages can be deleted."
    );
  }

  await prisma.contactMessage.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/contact-messages");
}
