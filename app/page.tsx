"use client";

import { useEffect, useState } from "react";
import type { ClassItem, MockUser } from "@/types";
import { fetchClasses } from "@/lib/api";
import { MOCK_USERS } from "@/lib/users";
import ClassList from "./components/ClassList";
import MyBookings from "./components/MyBookings";

export default function Home() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [currentUser, setCurrentUser] = useState<MockUser>(MOCK_USERS[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses()
      .then(setClasses)
      .catch((err) => console.error("Failed to load classes", err))
      .finally(() => setLoading(false));
  }, []);

  function handleLocalUpdate(updated: ClassItem) {
    setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }

  return (
    <main className="mx-auto w-full max-w-5xl">
      <ClassList
        classes={classes}
        loading={loading}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        onLocalUpdate={handleLocalUpdate}
      />
      <MyBookings
        classes={classes}
        currentUser={currentUser}
        onClassUpdate={handleLocalUpdate}
      />
    </main>
  );
}