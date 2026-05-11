"use client";

import { useState } from "react";
import type { ClassItem, MockUser } from "@/types";
import { cancelBooking } from "@/lib/api";

type Props = {
  classInfo: ClassItem;
  currentUser: MockUser;
  onClassUpdate: (updated: ClassItem) => void;
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

export default function BookedClassRow({ classInfo, currentUser, onClassUpdate }: Props) {
  const [pending, setPending] = useState(false);

  async function handleCancel() {
    setPending(true);
    try {
      const updated = await cancelBooking(classInfo.id, currentUser.id);
      onClassUpdate(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {classInfo.name}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {classInfo.instructor} · {formatWhen(classInfo.datetime)}
        </span>
      </div>
      <button
        onClick={handleCancel}
        disabled={pending}
        aria-label={`Cancel ${classInfo.name} as ${currentUser.name}`}
        className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
      >
        Cancel
      </button>
    </div>
  );
}
