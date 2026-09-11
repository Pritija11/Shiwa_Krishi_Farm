"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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