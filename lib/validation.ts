import type { ClassItem } from "../types";

export function isInPast(cls: ClassItem): boolean {
  return new Date(cls.datetime).getTime() < Date.now();
}

export function isFull(cls: ClassItem): boolean {
  return cls.bookedUsers.length >= cls.capacity;
}

export function isUserBooked(cls: ClassItem, userId: string): boolean {
  return cls.bookedUsers.includes(userId);
}
