import { NotificationType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type CreateNotificationInput = {
  title: string;
  message: string;
  type: NotificationType;
};

export async function createNotification({
  title,
  message,
  type,
}: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      title,
      message,
      type,
    },
  });
}