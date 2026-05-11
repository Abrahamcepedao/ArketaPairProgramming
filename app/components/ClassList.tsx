"use client";

import type { ClassItem, MockUser } from "@/types";
import ClassCard from "./ClassCard";
import UserSwitcher from "./UserSwitcher";

type Props = {
  classes: ClassItem[];
  loading: boolean;
  currentUser: MockUser;
  onUserChange: (user: MockUser) => void;
  onLocalUpdate: (updated: ClassItem) => void;
};

export default function ClassList({ classes, loading, currentUser, onUserChange, onLocalUpdate }: Props) {
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
        <UserSwitcher currentUser={currentUser} onChange={onUserChange} />
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
              onLocalUpdate={onLocalUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
