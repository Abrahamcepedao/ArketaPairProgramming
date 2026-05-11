"use client";

import type { ClassItem, MockUser } from "@/types";
import BookedClassRow from "./BookedClassItem";

type Props = {
  classes: ClassItem[];
  currentUser: MockUser;
  onClassUpdate: (updated: ClassItem) => void;
};

export default function MyBookings({ classes, currentUser, onClassUpdate }: Props) {
  const bookedClasses = classes.filter((c) => c.bookedUserIds.includes(currentUser.id));

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-10">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          My Bookings
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Classes booked by {currentUser.name}
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {bookedClasses.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">No bookings yet.</p>
        ) : (
          bookedClasses.map((c) => (
            <BookedClassRow
              key={c.id}
              classInfo={c}
              currentUser={currentUser}
              onClassUpdate={onClassUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
}
