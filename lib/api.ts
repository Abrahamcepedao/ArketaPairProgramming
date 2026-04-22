import type { ClassItem } from "../types";

export async function fetchClasses(): Promise<ClassItem[]> {
  const res = await fetch("/api/classes", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch classes");
  const data = await res.json();
  return data.classes;
}

export async function bookClass(classId: string): Promise<void> {
  try {
    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId }),
    });
    if (!res.ok) throw new Error("Booking failed");
  } catch (err) {
    console.error("bookClass error", err);
    throw err;
  }
}

export async function cancelBooking(classId: string): Promise<void> {
  try {
    const res = await fetch("/api/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId }),
    });
    if (!res.ok) throw new Error("Cancel failed");
  } catch (err) {
    console.error("cancelBooking error", err);
    throw err;
  }
}
