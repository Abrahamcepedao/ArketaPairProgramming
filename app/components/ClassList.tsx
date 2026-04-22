"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ClassItem, MockUser } from "@/types";
import { fetchClasses, fetchCurrentUser, updateCurrentUser } from "@/lib/api";
import { MOCK_USERS } from "@/lib/users";
import ClassCard from "./ClassCard";
import UserSwitcher from "./UserSwitcher";

export default function ClassList() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [currentUser, setCurrentUserState] = useState<MockUser>(MOCK_USERS[0]);
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
      setCurrentUserState(user);
    } catch (err) {
      console.error("Failed to load classes", err);
    } finally {
      setLoading(false);
    }
  }

  function handleLocalUpdate(updated: ClassItem) {
    setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }

  async function handleUserChange(user: MockUser) {
    setCurrentUserState(user);
    await updateCurrentUser(user.id);
  }

  if (!currentUser) {
    return <p className="p-6 text-zinc-600">Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Arketa Booking
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Book your next class.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <UserSwitcher currentUser={currentUser} onChange={handleUserChange} />
          <Link
            href="/my-bookings"
            className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            My Bookings
          </Link>
        </div>
      </header>

      {loading ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading classes…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => (
            <ClassCard
              key={c.id}
              classInfo={c}
              currentUser={currentUser}
              onLocalUpdate={handleLocalUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
