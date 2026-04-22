import type { ClassItem } from "../types";

export function isInPast(cls: ClassItem): boolean {
  return new Date(cls.datetime).getTime() < Date.now();
}

export function isFull(cls: ClassItem): boolean {
  return cls.bookedUsers >= cls.capacity;
}
