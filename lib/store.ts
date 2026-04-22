import type { ClassItem, MockUser } from "../types";
import { seedClasses } from "../data";
import { MOCK_USERS } from "./users";
import { promises as fs } from "fs";
import path from "path";

type Store = {
  classes: ClassItem[];
  currentUserId: string;
};

const globalForStore = globalThis as unknown as { __bookingStore?: Store };
const STORE_FILE = path.join(process.cwd(), ".booking-store.json");

async function loadStoreFromFile(): Promise<Store | null> {
  try {
    const data = await fs.readFile(STORE_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function saveStoreToFile(store: Store): Promise<void> {
  try {
    await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2));
  } catch (err) {
    console.error("Failed to save store to file:", err);
  }
}

function getStore(): Store {
  if (!globalForStore.__bookingStore) {
    globalForStore.__bookingStore = {
      classes: seedClasses(),
      currentUserId: MOCK_USERS[0].id
    };
  }
  return globalForStore.__bookingStore;
}

export async function initializeStore(): Promise<void> {
  const persistedStore = await loadStoreFromFile();
  if (persistedStore) {
    globalForStore.__bookingStore = persistedStore;
  } else {
    globalForStore.__bookingStore = {
      classes: seedClasses(),
      currentUserId: MOCK_USERS[0].id
    };
  }
}

export function getClasses(): ClassItem[] {
  return getStore().classes;
}

export function getCurrentUser(): MockUser | null {
  const store = getStore();
  return MOCK_USERS.find((u) => u.id === store.currentUserId) || null;
}

export async function setCurrentUser(user: MockUser): Promise<void> {
  const store = getStore();
  store.currentUserId = user.id;
  await saveStoreToFile(store);
}

export async function bookClass(classId: string, userId: string): Promise<ClassItem | null> {
  const store = getStore();
  const cls = store.classes.find((c) => c.id === classId);
  if (!cls) return null;

  cls.bookedUsers.push(userId);
  console.log("[book]", classId, "→", cls.bookedUsers.length, "of", cls.capacity);
  await saveStoreToFile(store);
  return cls;
}

export async function cancelBooking(classId: string, userId: string): Promise<ClassItem | null> {
  const store = getStore();
  const cls = store.classes.find((c) => c.id === classId);
  if (!cls) return null;

  cls.bookedUsers = cls.bookedUsers.filter((id) => id !== userId);
  console.log("[cancel]", classId, "→", cls.bookedUsers.length, "of", cls.capacity);
  await saveStoreToFile(store);
  return cls;
}
