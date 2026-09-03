import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/notifications
export async function GET() {
  try {
    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        take: 20,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.notification.count({
        where: {
          isRead: false,
        },
      }),
    ]);

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);

    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications
export async function PATCH() {
  try {
    // Get the latest 20 unread notifications
    const unreadNotifications = await prisma.notification.findMany({
      where: {
        isRead: false,
      },
      select: {
        id: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    const notificationIds = unreadNotifications.map(
      (notification) => notification.id
    );

    // Mark only those notifications as read
    if (notificationIds.length > 0) {
      await prisma.notification.updateMany({
        where: {
          id: {
            in: notificationIds,
          },
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      markedAsRead: notificationIds.length,
    });
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);

    return NextResponse.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 }
    );
  }
}