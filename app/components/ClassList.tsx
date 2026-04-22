"use client";

import { useEffect, useState } from "react";
import type { ClassItem, MockUser } from "@/types";
import { fetchClasses } from "@/lib/api";
import { MOCK_USERS } from "@/lib/users";
import ClassCard from "./ClassCard";
import UserSwitcher from "./UserSwitcher";

export default function ClassList() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [currentUser, setCurrentUser] = useState<MockUser>(MOCK_USERS[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses()
      .then((data) => setClasses(data))
      .catch((err) => console.error("Failed to load classes", err))
      .finally(() => setLoading(false));
  }, []);

  function handleLocalUpdate(updated: ClassItem) {
    setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
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
        <UserSwitcher currentUser={currentUser} onChange={setCurrentUser} />
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
