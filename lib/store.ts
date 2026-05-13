import type { ClassItem, Notification } from "../types";
import { seedClasses } from "../data";

type Store = {
  classes: ClassItem[];
  notifications: Notification[];
};

const globalForStore = globalThis as unknown as { __bookingStore?: Store };

function getStore(): Store {
  if (!globalForStore.__bookingStore) {
    globalForStore.__bookingStore = {
      classes: seedClasses(),
      notifications: [],
    };
  }
  return globalForStore.__bookingStore;
}

class Mutex {
  private pending: Promise<void> = Promise.resolve();

  async lock<T>(fn: () => Promise<T> | T): Promise<T> {
    await this.pending;
    let resolve: () => void;
    const nextPending = new Promise<void>((r) => {
      resolve = r;
    });
    this.pending = nextPending;
    try {
      return await fn();
    } finally {
      resolve!();
    }
  }
}

const mutex = new Mutex();

export function getClasses(): ClassItem[] {
  return getStore().classes;
}

export function getBookingsByUser(userId: string): ClassItem[] {
  return getStore().classes.filter((c) => c.currentUsers.includes(userId));
}

export function getWaitlistByUser(userId: string): ClassItem[] {
  return getStore().classes.filter((c) => c.waitlist.includes(userId));
}

export function getNotifications(userId: string): Notification[] {
  return getStore().notifications.filter((n) => n.userId === userId);
}

function addNotification(userId: string, type: "promoted" | "available", classId: string): void {
  const cls = getStore().classes.find((c) => c.id === classId);
  if (!cls) return;

  const notification: Notification = {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    type,
    classId,
    className: cls.name,
    timestamp: Date.now(),
  };
  getStore().notifications.push(notification);
  console.log(`[notification] ${type} for ${userId}:`, cls.name);
}

export type BookResult =
  | { ok: true; class: ClassItem }
  | { ok: false; error: "not_found" | "already_booked" | "full" | "past" };

export async function bookClass(classId: string, userId: string): Promise<BookResult> {
  return mutex.lock(() => {
    const store = getStore();
    const cls = store.classes.find((c) => c.id === classId);
    if (!cls) return { ok: false, error: "not_found" };
    if (new Date(cls.datetime) < new Date()) return { ok: false, error: "past" };
    if (cls.currentUsers.includes(userId)) return { ok: false, error: "already_booked" };
    if (cls.currentUsers.length >= cls.capacity) return { ok: false, error: "full" };

    cls.currentUsers.push(userId);
    if (cls.waitlist.includes(userId)) {
      cls.waitlist.splice(cls.waitlist.indexOf(userId), 1);
    }
    console.log("[book]", classId, "user:", userId, "→", cls.currentUsers.length, "of", cls.capacity);
    return { ok: true, class: cls };
  });
}

export async function joinWaitlist(classId: string, userId: string): Promise<BookResult> {
  return mutex.lock(() => {
    const store = getStore();
    const cls = store.classes.find((c) => c.id === classId);
    if (!cls) return { ok: false, error: "not_found" };
    if (new Date(cls.datetime) < new Date()) return { ok: false, error: "past" };
    if (cls.currentUsers.includes(userId)) return { ok: false, error: "already_booked" };
    if (cls.waitlist.includes(userId)) return { ok: false, error: "already_booked" };

    cls.waitlist.push(userId);
    console.log("[waitlist]", classId, "user:", userId, "→ position", cls.waitlist.length);
    return { ok: true, class: cls };
  });
}

export async function leaveWaitlist(classId: string, userId: string): Promise<ClassItem | null> {
  return mutex.lock(() => {
    const store = getStore();
    const cls = store.classes.find((c) => c.id === classId);
    if (!cls) return null;

    const idx = cls.waitlist.indexOf(userId);
    if (idx === -1) return null;

    cls.waitlist.splice(idx, 1);
    console.log("[waitlist-leave]", classId, "user:", userId);
    return cls;
  });
}

export async function cancelBooking(classId: string, userId: string): Promise<ClassItem | null> {
  return mutex.lock(() => {
    const store = getStore();
    const cls = store.classes.find((c) => c.id === classId);
    if (!cls) return null;

    const idx = cls.currentUsers.indexOf(userId);
    if (idx === -1) return null;

    cls.currentUsers.splice(idx, 1);
    console.log("[cancel]", classId, "user:", userId, "→", cls.currentUsers.length, "of", cls.capacity);

    // Auto-promote from waitlist if there's someone waiting
    if (cls.waitlist.length > 0 && cls.currentUsers.length < cls.capacity) {
      const promotedUserId = cls.waitlist.shift()!;
      cls.currentUsers.push(promotedUserId);
      addNotification(promotedUserId, "promoted", classId);
      console.log("[promote]", classId, "promoted:", promotedUserId, "from waitlist");
    }

    return cls;
  });
}
