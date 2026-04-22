"use client";

import { useState } from "react";
import type { ClassItem, MockUser } from "@/types";
import { bookClass, cancelBooking } from "@/lib/api";
import { getBookedCount } from "@/types";
import { isInPast, isFull, isUserBooked } from "@/lib/validation";
import { useToast } from "./ToastProvider";

type Props = {
  classInfo: ClassItem;
  currentUser: MockUser;
  onLocalUpdate: (updated: ClassItem) => void;
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

function getStatusBadge(cls: ClassItem, userId: string): { label: string; color: string; icon: string } | null {
  if (isInPast(cls)) {
    return { label: "Past", color: "bg-zinc-300 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-200", icon: "⏰" };
  }
  if (isUserBooked(cls, userId)) {
    return { label: "You're booked", color: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100", icon: "✓" };
  }
  if (isFull(cls)) {
    return { label: "Full", color: "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100", icon: "×" };
  }
  return { label: "Available", color: "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100", icon: "✨" };
}

export default function ClassCard({ classInfo, currentUser, onLocalUpdate }: Props) {
  const [pending, setPending] = useState(false);
  const { addToast } = useToast();
  const bookedCount = getBookedCount(classInfo);
  const spotsLeft = classInfo.capacity - bookedCount;

  const isInPastClass = isInPast(classInfo);
  const isUserBookedClass = isUserBooked(classInfo, currentUser.id);
  const isFullClass = isFull(classInfo);
  const status = getStatusBadge(classInfo, currentUser.id);
  const canBook = !isInPastClass && !isUserBookedClass && !isFullClass;

  async function handleBook() {
    setPending(true);
    try {
      const updated = await bookClass(classInfo.id, currentUser.id);
      onLocalUpdate(updated);
      addToast("Successfully booked!", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Booking failed";
      addToast(message, "error");
    } finally {
      setPending(false);
    }
  }

  async function handleCancel() {
    setPending(true);
    try {
      const updated = await cancelBooking(classInfo.id, currentUser.id);
      onLocalUpdate(updated);
      addToast("Booking cancelled!", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Cancel failed";
      addToast(message, "error");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={`flex flex-col gap-3 rounded-lg border p-4 ${
      isInPastClass ? "border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800" : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {classInfo.name}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            with {classInfo.instructor}
          </p>
        </div>
        {status && (
          <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${status.color}`}>
            <span>{status.icon}</span>
            <span>{status.label}</span>
          </div>
        )}
      </div>

      <div className="text-sm text-zinc-700 dark:text-zinc-300">
        <div className={isInPastClass ? "line-through text-zinc-500 dark:text-zinc-400" : ""}>
          {formatWhen(classInfo.datetime)}
        </div>
        <div className="mt-1">
          <div className="flex items-center justify-between">
            <span>{bookedCount} of {classInfo.capacity} booked</span>
            {spotsLeft > 0 && !isInPastClass && (
              <span className="text-xs font-medium text-green-700 dark:text-green-300">{spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left</span>
            )}
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
            <div
              className={`h-full transition-all ${
                isFullClass ? "bg-red-500" : "bg-green-500"
              }`}
              style={{ width: `${Math.min((bookedCount / classInfo.capacity) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-2 flex gap-2">
        {isUserBookedClass ? (
          <button
            onClick={handleCancel}
            disabled={pending}
            aria-label={`Cancel ${classInfo.name}`}
            className="flex-1 rounded border border-orange-300 bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-900 hover:bg-orange-100 disabled:opacity-50 dark:border-orange-700 dark:bg-orange-900 dark:text-orange-100 dark:hover:bg-orange-800"
          >
            Cancel Booking
          </button>
        ) : (
          <button
            onClick={handleBook}
            disabled={pending || !canBook}
            aria-label={`Book ${classInfo.name} as ${currentUser.name}`}
            className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              canBook
                ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                : "bg-zinc-200 text-zinc-500 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-400"
            } disabled:opacity-50`}
          >
            Book
          </button>
        )}
      </div>

      {!canBook && !isUserBookedClass && (
        <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
          {isInPastClass && "This class has already occurred"}
          {isFullClass && "This class is full"}
        </div>
      )}
    </div>
  );
}
