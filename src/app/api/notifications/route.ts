import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/notifications
export async function GET(request: Request) {
  try {
    // ---------------------------------------
    // Authentication
    // ---------------------------------------

    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const limit = 20;
    const skip = (page - 1) * limit;

    const notifications = await prisma.notification.findMany({
      skip,
      take: limit + 1,
      orderBy: {
        createdAt: "desc",
      },
    });

    const hasMore = notifications.length > limit;

    const paginatedNotifications = notifications.slice(0, limit);

    const unreadCount = await prisma.notification.count({
      where: {
        isRead: false,
      },
    });

    return NextResponse.json({
      notifications: paginatedNotifications,
      unreadCount,
      hasMore,
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
export async function PATCH(request: Request) {
  try {
    // ---------------------------------------
    // Authentication
    // ---------------------------------------

    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { scope } = body;

    if (scope === "displayed") {
      // Get the latest 20 notifications overall
      const notifications = await prisma.notification.findMany({
        select: {
          id: true,
          isRead: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      });

      // Only select unread notifications from those 20
      const unreadIds = notifications
        .filter((notification) => !notification.isRead)
        .map((notification) => notification.id);

      if (unreadIds.length > 0) {
        await prisma.notification.updateMany({
          where: {
            id: {
              in: unreadIds,
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
        markedAsRead: unreadIds.length,
      });
    }

    if (scope === "all") {
      const result = await prisma.notification.updateMany({
        where: {
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

      return NextResponse.json({
        success: true,
        markedAsRead: result.count,
      });
    }

    return NextResponse.json(
      { error: "Invalid notification scope" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Failed to update notifications:", error);

    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}