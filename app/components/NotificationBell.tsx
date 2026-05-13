"use client";

import { useEffect, useState } from "react";
import type { Notification } from "@/types";
import { fetchNotifications } from "@/lib/api";

type Props = {
  userId: string;
};

export default function NotificationBell({ userId }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications(userId);
        setNotifications(data);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 -mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <div className="absolute right-0 top-8 z-10 w-72 rounded-lg border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          {notifications.length === 0 ? (
            <p className="text-sm text-zinc-500">No notifications</p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className="rounded bg-amber-50 p-2 text-sm dark:bg-amber-900/20"
                >
                  {n.type === "promoted" && (
                    <>
                      <p className="font-medium text-amber-900 dark:text-amber-100">
                        🎉 Promoted!
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-200">
                        You're now booked for {n.className}
                      </p>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
