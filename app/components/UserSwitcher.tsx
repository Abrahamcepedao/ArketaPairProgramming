"use client";

import type { MockUser } from "@/types";
import { MOCK_USERS } from "@/lib/users";

type Props = {
  currentUser: MockUser;
  onChange: (user: MockUser) => void;
};

export default function UserSwitcher({ currentUser, onChange }: Props) {
  return (
    <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
      <span>Booking as</span>
      <select
        value={currentUser.id}
        onChange={(e) => {
          const next = MOCK_USERS.find((u) => u.id === e.target.value);
          if (next) onChange(next);
        }}
        className="rounded border border-zinc-300 bg-white px-2 py-1 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      >
        {MOCK_USERS.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
    </label>
  );
}
