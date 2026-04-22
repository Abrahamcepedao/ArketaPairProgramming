"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ClassItem, MockUser } from "@/types";
import { fetchClasses, fetchCurrentUser } from "@/lib/api";
import { MOCK_USERS } from "@/lib/users";
import { MyBookings } from "@/app/components/MyBookings";
import UserSwitcher from "@/app/components/UserSwitcher";

export default function MyBookingsPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [currentUser, setCurrentUser] = useState<MockUser>(MOCK_USERS[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  async function loadClasses() {
    try {
      setLoading(true);
      const data = await fetchClasses();
      setClasses(data);
      const user = await fetchCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error("Failed to load classes", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleBookingChange() {
    await loadClasses();
  }

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            My Bookings
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            View and manage your class bookings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <UserSwitcher currentUser={currentUser} onChange={setCurrentUser} />
          <Link
            href="/"
            className="rounded bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Browse Classes
          </Link>
        </div>
      </header>

      {loading ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading your bookings…</p>
      ) : (
        <MyBookings
          classes={classes}
          currentUser={currentUser}
          onBookingChange={handleBookingChange}
        />
      )}
    </div>
  );
}
