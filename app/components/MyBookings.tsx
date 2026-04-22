"use client";

import type { ClassItem, MockUser } from "@/types";
import { cancelBooking } from "@/lib/api";
import { useToast } from "./ToastProvider";
import { useState } from "react";

type Props = {
  classes: ClassItem[];
  currentUser: MockUser;
  onBookingChange: () => void;
};

function formatWhen(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function MyBookings({ classes, currentUser, onBookingChange }: Props) {
  const [pending, setPending] = useState<string | null>(null);
  const { addToast } = useToast();

  const myBookings = classes.filter((cls) => cls.bookedUsers.includes(currentUser.id));

  async function handleCancel(classId: string) {
    setPending(classId);
    try {
      await cancelBooking(classId, currentUser.id);
      addToast("Booking cancelled!", "success");
      onBookingChange();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Cancel failed";
      addToast(message, "error");
    } finally {
      setPending(null);
    }
  }

  if (myBookings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No bookings yet. Book a class to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {myBookings.map((cls) => (
        <div
          key={cls.id}
          className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900"
        >
          <div>
            <h4 className="font-semibold text-green-900 dark:text-green-100">
              {cls.name}
            </h4>
            <p className="text-sm text-green-800 dark:text-green-200">
              with {cls.instructor}
            </p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              {formatWhen(cls.datetime)}
            </p>
          </div>
          <button
            onClick={() => handleCancel(cls.id)}
            disabled={pending === cls.id}
            className="rounded bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-700"
          >
            {pending === cls.id ? "..." : "Cancel"}
          </button>
        </div>
      ))}
    </div>
  );
}
