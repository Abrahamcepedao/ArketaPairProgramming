"use client";

import { useState } from "react";
import type { ClassItem, MockUser } from "@/types";
import { bookClass, cancelBooking, joinWaitlist, leaveWaitlist } from "@/lib/api";

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

export default function ClassCard({ classInfo, currentUser, onLocalUpdate }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const spotsLeft = classInfo.capacity - classInfo.currentUsers.length;
  const isBooked = classInfo.currentUsers.includes(currentUser.id);
  const isWaitlisted = classInfo.waitlist.includes(currentUser.id);
  const isFull = spotsLeft <= 0;

  async function handleBook() {
    setPending(true);
    setError(null);
    try {
      const updated = await bookClass(classInfo.id, currentUser.id);
      onLocalUpdate(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setPending(false);
    }
  }

  async function handleCancel() {
    setPending(true);
    setError(null);
    try {
      const updated = await cancelBooking(classInfo.id, currentUser.id);
      onLocalUpdate(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cancel failed");
    } finally {
      setPending(false);
    }
  }

  async function handleJoinWaitlist() {
    setPending(true);
    setError(null);
    try {
      const updated = await joinWaitlist(classInfo.id, currentUser.id);
      onLocalUpdate(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Join waitlist failed");
    } finally {
      setPending(false);
    }
  }

  async function handleLeaveWaitlist() {
    setPending(true);
    setError(null);
    try {
      const updated = await leaveWaitlist(classInfo.id, currentUser.id);
      onLocalUpdate(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Leave waitlist failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {classInfo.name}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          with {classInfo.instructor}
        </p>
      </div>

      <div className="text-sm text-zinc-700 dark:text-zinc-300">
        <div>{formatWhen(classInfo.datetime)}</div>
        <div className="flex items-center justify-between">
          <div>
            {classInfo.currentUsers.length} of {classInfo.capacity} booked
            {spotsLeft > 0 ? ` · ${spotsLeft} spots left` : ""}
          </div>
          {classInfo.waitlist.length > 0 && (
            <div className="text-xs text-amber-600 dark:text-amber-400">
              {classInfo.waitlist.length} waiting
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="mt-1 flex gap-2">
        {isBooked ? (
          <button
            onClick={handleCancel}
            disabled={pending}
            className="rounded border border-green-300 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-900 hover:bg-green-100 disabled:opacity-50 dark:border-green-700 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800"
          >
            ✓ Booked
          </button>
        ) : isFull ? (
          isWaitlisted ? (
            <button
              onClick={handleLeaveWaitlist}
              disabled={pending}
              className="rounded border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-100 disabled:opacity-50 dark:border-amber-700 dark:bg-amber-900 dark:text-amber-100 dark:hover:bg-amber-800"
            >
              Leave Waitlist
            </button>
          ) : (
            <button
              onClick={handleJoinWaitlist}
              disabled={pending}
              className="rounded border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-100 disabled:opacity-50 dark:border-amber-700 dark:bg-amber-900 dark:text-amber-100 dark:hover:bg-amber-800"
            >
              Join Waitlist
            </button>
          )
        ) : (
          <button
            onClick={handleBook}
            disabled={pending}
            className="rounded bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Book
          </button>
        )}
      </div>
    </div>
  );
}
