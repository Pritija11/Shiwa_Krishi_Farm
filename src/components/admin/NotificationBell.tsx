"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { NotificationType } from "@/generated/prisma/client";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();

      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBellClick = async () => {
    const willOpen = !isOpen;

    setIsOpen(willOpen);

    if (willOpen && unreadCount > 0) {
      try {
        const response = await fetch("/api/notifications", {
          method: "PATCH",
        });

        if (!response.ok) {
          throw new Error("Failed to mark notifications as read");
        }

        setNotifications((currentNotifications) =>
          currentNotifications.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        );

        setUnreadCount(0);
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Notification Bell */}
      <button
        type="button"
        aria-label="Notifications"
        onClick={handleBellClick}
        className="relative flex h-11 w-11 items-center justify-center rounded-xl text-green-950/70 transition hover:bg-green-950/5 hover:text-green-950"
      >
        <Bell size={20} strokeWidth={1.8} />

        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-2xl border border-green-900/10 bg-[#F8F5ED] shadow-xl">
          <div className="flex items-center justify-between border-b border-green-900/10 px-5 py-4">
            <h2 className="font-[family-name:var(--font-dm-serif)] text-xl text-green-950">
              Notifications
            </h2>

            {unreadCount > 0 && (
              <span className="text-xs text-green-900/50">
                {unreadCount} unread
              </span>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-green-900/60">
                You&apos;re all caught up! ✨
              </p>
            </div>
          ) : (
            <>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-b border-green-900/10 px-5 py-4 ${
                      !notification.isRead ? "bg-green-900/5" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      {!notification.isRead && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-700" />
                      )}

                      <div>
                        <p className="text-sm font-semibold text-green-950">
                          {notification.title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-green-900/60">
                          {notification.message}
                        </p>

                        <p className="mt-2 text-[10px] text-green-900/40">
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="w-full px-5 py-4 text-center text-xs font-semibold text-green-900 transition hover:bg-green-900/5"
              >
                View all notifications
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}