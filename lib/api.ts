import type { ClassItem, MockUser } from "../types";

export async function fetchClasses(): Promise<ClassItem[]> {
  const res = await fetch("/api/classes", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch classes");
  const data = await res.json();
  return data.classes;
}

export async function fetchCurrentUser(): Promise<MockUser> {
  const res = await fetch("/api/user");
  return res.json();
}

export async function updateCurrentUser(userId: string): Promise<MockUser> {
  const res = await fetch("/api/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return res.json();
}

export async function bookClass(classId: string, userId: string): Promise<ClassItem> {
  const res = await fetch("/api/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ classId, userId }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Booking failed");
  }
  const data = await res.json();
  return data.class;
}

export async function cancelBooking(classId: string, userId: string): Promise<ClassItem> {
  const res = await fetch("/api/cancel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ classId, userId }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Cancel failed");
  }
  const data = await res.json();
  return data.class;
}
