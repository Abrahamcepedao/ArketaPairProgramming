import type { ClassItem, Notification } from "../types";

export async function fetchClasses(): Promise<ClassItem[]> {
  const res = await fetch("/api/classes", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch classes");
  const data = await res.json();
  return data.classes;
}

export async function bookClass(classId: string, userId: string): Promise<ClassItem> {
  const res = await fetch("/api/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ classId, userId }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Booking failed");
  }
  const data = await res.json();
  return data.class;
}

export async function fetchMyBookings(userId: string): Promise<ClassItem[]> {
  const res = await fetch(`/api/my-bookings?userId=${encodeURIComponent(userId)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch bookings");
  const data = await res.json();
  return data.classes;
}

export async function cancelBooking(classId: string, userId: string): Promise<ClassItem> {
  const res = await fetch("/api/cancel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ classId, userId }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Cancel failed");
  }
  const data = await res.json();
  return data.class;
}

export async function joinWaitlist(classId: string, userId: string): Promise<ClassItem> {
  const res = await fetch("/api/waitlist/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ classId, userId }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Join waitlist failed");
  }
  const data = await res.json();
  return data.class;
}

export async function leaveWaitlist(classId: string, userId: string): Promise<ClassItem> {
  const res = await fetch("/api/waitlist/leave", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ classId, userId }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Leave waitlist failed");
  }
  const data = await res.json();
  return data.class;
}

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const res = await fetch(`/api/notifications?userId=${encodeURIComponent(userId)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch notifications");
  const data = await res.json();
  return data.notifications;
}

export async function fetchMyWaitlist(userId: string): Promise<ClassItem[]> {
  const res = await fetch(`/api/my-waitlist?userId=${encodeURIComponent(userId)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch waitlist");
  const data = await res.json();
  return data.classes;
}
