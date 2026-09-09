"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type EnquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus
) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.enquiry.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
}

export async function deleteEnquiry(id: string) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const enquiry = await prisma.enquiry.findUnique({
    where: {
      id,
    },
  });

  if (!enquiry) {
    throw new Error("Enquiry not found.");
  }

  if (enquiry.status !== "CANCELLED") {
    throw new Error(
      "Only cancelled enquiries can be deleted."
    );
  }

  await prisma.enquiry.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
}