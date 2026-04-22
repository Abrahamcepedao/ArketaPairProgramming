"use client";

import { useState } from "react";
import type { ClassItem, MockUser } from "@/types";
import { bookClass, cancelBooking } from "@/lib/api";

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
  const spotsLeft = classInfo.capacity - classInfo.bookedUsers;

  async function handleBook() {
    setPending(true);
    onLocalUpdate({ ...classInfo, bookedUsers: classInfo.bookedUsers + 1 });
    try {
      await bookClass(classInfo.id);
    } catch (err) {
      console.error(err);
    } finally {
      setPending(false);
    }
  }

  async function handleCancel() {
    setPending(true);
    onLocalUpdate({ ...classInfo, bookedUsers: classInfo.bookedUsers - 1 });
    try {
      await cancelBooking(classInfo.id);
    } catch (err) {
      console.error(err);
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
        <div>
          {classInfo.bookedUsers} of {classInfo.capacity} booked
          {spotsLeft > 0 ? ` · ${spotsLeft} spots left` : ""}
        </div>
      </div>

      <div className="mt-1 flex gap-2">
        <button
          onClick={handleBook}
          disabled={pending}
          aria-label={`Book ${classInfo.name} as ${currentUser.name}`}
          className="rounded bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Book
        </button>
        <button
          onClick={handleCancel}
          disabled={pending}
          aria-label={`Cancel ${classInfo.name} as ${currentUser.name}`}
          className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
