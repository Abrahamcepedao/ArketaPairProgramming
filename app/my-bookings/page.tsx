"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ClassItem, MockUser } from "@/types";
import { fetchMyBookings, fetchMyWaitlist, cancelBooking, leaveWaitlist } from "@/lib/api";
import { MOCK_USERS } from "@/lib/users";
import UserSwitcher from "@/app/components/UserSwitcher";
import NotificationBell from "@/app/components/NotificationBell";

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

export default function MyBookingsPage() {
  const [currentUser, setCurrentUser] = useState<MockUser>(MOCK_USERS[0]);
  const [bookings, setBookings] = useState<ClassItem[]>([]);
  const [waitlist, setWaitlist] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchMyBookings(currentUser.id), fetchMyWaitlist(currentUser.id)])
      .then(([b, w]) => {
        setBookings(b);
        setWaitlist(w);
      })
      .catch(() => setError("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, [currentUser.id]);

  async function handleCancel(classId: string) {
    setPendingId(classId);
    setError(null);
    try {
      await cancelBooking(classId, currentUser.id);
      setBookings((prev) => prev.filter((c) => c.id !== classId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cancel failed");
    } finally {
      setPendingId(null);
    }
  }

  async function handleLeaveWaitlist(classId: string) {
    setPendingId(classId);
    setError(null);
    try {
      await leaveWaitlist(classId, currentUser.id);
      setWaitlist((prev) => prev.filter((c) => c.id !== classId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Leave waitlist failed");
    } finally {
      setPendingId(null);
    }
  }

  const hasContent = bookings.length > 0 || waitlist.length > 0;

  return (
    <main className="mx-auto w-full max-w-2xl p-6 sm:p-10">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              ← Back
            </Link>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              My Bookings
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell userId={currentUser.id} />
            <UserSwitcher currentUser={currentUser} onChange={setCurrentUser} />
          </div>
        </header>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {loading ? (
          <p className="text-sm text-zinc-500">Loading…</p>
        ) : !hasContent ? (
          <p className="text-sm text-zinc-500">
            {currentUser.name} has no bookings or waitlist entries.{" "}
            <Link href="/" className="underline hover:text-zinc-900 dark:hover:text-zinc-100">
              Browse classes
            </Link>
          </p>
        ) : (
          <div className="space-y-6">
            {/* Booked Classes */}
            {bookings.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Booked ({bookings.length})
                </h2>
                <ul className="flex flex-col gap-3">
                  {bookings.map((cls) => (
                    <li
                      key={cls.id}
                      className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"
                    >
                      <div>
                        <p className="font-medium text-green-900 dark:text-green-100">
                          ✓ {cls.name}
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {formatWhen(cls.datetime)} · with {cls.instructor}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCancel(cls.id)}
                        disabled={pendingId === cls.id}
                        className="rounded border border-green-300 bg-white px-3 py-1.5 text-sm font-medium text-green-900 hover:bg-green-100 disabled:opacity-50 dark:border-green-700 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800"
                      >
                        Cancel
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Waitlist */}
            {waitlist.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Waitlist ({waitlist.length})
                </h2>
                <ul className="flex flex-col gap-3">
                  {waitlist.map((cls) => {
                    const position = cls.waitlist.indexOf(currentUser.id) + 1;
                    return (
                      <li
                        key={cls.id}
                        className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20"
                      >
                        <div>
                          <p className="font-medium text-amber-900 dark:text-amber-100">
                            ⏳ {cls.name}
                          </p>
                          <p className="text-sm text-amber-700 dark:text-amber-300">
                            {formatWhen(cls.datetime)} · Position #{position} in waitlist
                          </p>
                        </div>
                        <button
                          onClick={() => handleLeaveWaitlist(cls.id)}
                          disabled={pendingId === cls.id}
                          className="rounded border border-amber-300 bg-white px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-100 disabled:opacity-50 dark:border-amber-700 dark:bg-amber-900 dark:text-amber-100 dark:hover:bg-amber-800"
                        >
                          Leave
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
