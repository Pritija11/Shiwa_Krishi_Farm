"use client";

import { useEffect, useState } from "react";

type NotificationType =
  | "ENQUIRY"
  | "MILK_SUBSCRIPTION"
  | "CONTACT_MESSAGE";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  const fetchNotifications = async (pageNumber: number) => {
    try {
      const response = await fetch(
        `/api/notifications?page=${pageNumber}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();

      if (pageNumber === 1) {
        setNotifications(data.notifications);
      } else {
        setNotifications((currentNotifications) => [
          ...currentNotifications,
          ...data.notifications,
        ]);
      }

      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);

      await fetchNotifications(1);

      setIsLoading(false);
    };

    loadNotifications();
  }, []);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) {
      return;
    }

    const nextPage = page + 1;

    setIsLoadingMore(true);

    await fetchNotifications(nextPage);

    setPage(nextPage);
    setIsLoadingMore(false);
  };

  const handleMarkAllAsRead = async () => {
    if (isMarkingAllRead) {
      return;
    }

    setIsMarkingAllRead(true);

    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scope: "all",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      setPage(1);
      await fetchNotifications(1);
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const handleNotificationClick = (type: NotificationType) => {
    switch (type) {
      case "ENQUIRY":
        window.location.href = "/admin/enquiries";
        break;

      case "CONTACT_MESSAGE":
        window.location.href = "/admin/contact-messages";
        break;

      case "MILK_SUBSCRIPTION":
        window.location.href = "/admin/subscriptions";
        break;
    }
  };

  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.isRead
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-green-900/50">
            Admin
          </p>

          <h1 className="mt-1 font-[family-name:var(--font-dm-serif)] text-3xl text-green-950">
            Notifications
          </h1>

          <p className="mt-2 text-sm text-green-900/60">
            View and manage your notifications.
          </p>
        </div>

        {hasUnreadNotifications && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAllRead}
            className="rounded-xl border border-green-900/10 px-4 py-2.5 text-xs font-semibold text-green-900 transition hover:bg-green-900/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isMarkingAllRead
              ? "Marking as read..."
              : "Mark all as read"}
          </button>
        )}
      </div>

      {/* Notifications */}
      {isLoading ? (
        <div className="rounded-2xl border border-green-900/10 bg-[#F8F5ED] px-6 py-12 text-center">
          <p className="text-sm text-green-900/60">
            Loading notifications...
          </p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-green-900/10 bg-[#F8F5ED] px-6 py-12 text-center">
          <p className="text-sm text-green-900/60">
            You&apos;re all caught up! ✨
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() =>
                handleNotificationClick(notification.type)
              }
              className={`w-full rounded-2xl border border-green-900/10 bg-[#F8F5ED] p-5 text-left transition hover:border-green-900/20 hover:bg-white ${
                !notification.isRead
                  ? "border-l-4 border-l-green-700"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-green-700" />
                    )}

                    <h2 className="text-sm font-semibold text-green-950">
                      {notification.title}
                    </h2>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-green-900/60">
                    {notification.message}
                  </p>
                </div>

                <p className="shrink-0 text-xs text-green-900/40">
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </p>
              </div>
            </button>
          ))}

          {/* Load More */}
          {hasMore && (
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="rounded-xl border border-green-900/10 px-5 py-3 text-xs font-semibold text-green-900 transition hover:bg-green-900/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}