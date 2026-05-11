import type { ClassItem } from "../types";
import { seedClasses } from "../data";

type Store = {
  classes: ClassItem[];
};

const globalForStore = globalThis as unknown as { __bookingStore?: Store };

function getStore(): Store {
  if (!globalForStore.__bookingStore) {
    globalForStore.__bookingStore = { classes: seedClasses() };
  }
  return globalForStore.__bookingStore;
}

export function getClasses(): ClassItem[] {
  return getStore().classes;
}

export function bookClass(classId: string, userId: string): ClassItem | null {
  const store = getStore();
  const cls = store.classes.find((c) => c.id === classId);
  if (!cls) return null;

  if (cls.bookedUserIds.includes(userId)) return null;

  const classDate = new Date(cls.datetime);

  if (classDate.getTime() < Date.now()){
    return null;
  }

  cls.bookedUserIds.push(userId);
  cls.bookedUsers += 1;
  console.log("[book]", classId, "user:", userId, "→", cls.bookedUsers, "of", cls.capacity);
  return cls;
}

export function cancelBooking(classId: string, userId: string): ClassItem | null {
  const store = getStore();
  const cls = store.classes.find((c) => c.id === classId);
  if (!cls) return null;

  cls.bookedUserIds = cls.bookedUserIds.filter((id) => id !== userId);
  cls.bookedUsers -= 1;
  console.log("[cancel]", classId, "user:", userId, "→", cls.bookedUsers, "of", cls.capacity);
  return cls;
}
