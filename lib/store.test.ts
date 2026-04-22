import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock file system for testing
vi.mock("fs", () => ({
  promises: {
    readFile: vi.fn().mockRejectedValue(new Error("ENOENT")),
    writeFile: vi.fn().mockResolvedValue(undefined),
  },
}));

let bookClass: typeof import("@/lib/store").bookClass;
let cancelBooking: typeof import("@/lib/store").cancelBooking;
let getClasses: typeof import("@/lib/store").getClasses;
let initializeStore: typeof import("@/lib/store").initializeStore;
let isUserBooked: typeof import("@/lib/validation").isUserBooked;
let isFull: typeof import("@/lib/validation").isFull;

beforeEach(async () => {
  vi.resetModules();

  const storeModule = await import("@/lib/store");
  const validationModule = await import("@/lib/validation");

  bookClass = storeModule.bookClass;
  cancelBooking = storeModule.cancelBooking;
  getClasses = storeModule.getClasses;
  initializeStore = storeModule.initializeStore;
  isUserBooked = validationModule.isUserBooked;
  isFull = validationModule.isFull;

  await initializeStore();
});

describe("Per-User Booking System", () => {
  describe("User can book a class", () => {
    it("should add user to bookedUsers when booking", async () => {
      const userId = "user_test_1";
      const classId = "yoga-morning";

      const updated = await bookClass(classId, userId);

      expect(updated).not.toBeNull();
      expect(updated?.bookedUsers).toContain(userId);
    });

    it("should increase booked count when user books", async () => {
      const userId = "user_test_2";
      const classId = "hiit-express";
      const classes = getClasses();
      const beforeCount = classes.find((c) => c.id === classId)?.bookedUsers.length ?? 0;

      await bookClass(classId, userId);

      const afterCount = getClasses().find((c) => c.id === classId)?.bookedUsers.length ?? 0;
      expect(afterCount).toBe(beforeCount + 1);
    });
  });

  describe("User cannot book the same class twice", () => {
    it("should detect when user is already booked", async () => {
      const userId = "user_test_3";
      const classId = "pilates-core";

      await bookClass(classId, userId);

      // already booked?
      const cls = getClasses().find((c) => c.id === classId);
      const isAlreadyBooked = isUserBooked(cls!, userId);

      expect(isAlreadyBooked).toBe(true);
    });

    it("should return true for isUserBooked when user has booked", async () => {
      const userId = "user_test_4";
      const classId = "spin-evening";

      await bookClass(classId, userId);

      const cls = getClasses().find((c) => c.id === classId);
      expect(isUserBooked(cls!, userId)).toBe(true);
    });
  });

  describe("User can cancel their booking", () => {
    it("should remove user from bookedUsers when canceling", async () => {
      const userId = "user_test_5";
      const classId = "yoga-morning";

      // Book first
      await bookClass(classId, userId);
      let cls = getClasses().find((c) => c.id === classId);
      expect(cls?.bookedUsers).toContain(userId);

      // Then cancel
      const cancelled = await cancelBooking(classId, userId);
      expect(cancelled?.bookedUsers).not.toContain(userId);
    });

    it("should decrease booked count when user cancels", async () => {
      const userId = "user_test_6";
      const classId = "sunrise-flow";

      // Book first
      await bookClass(classId, userId);
      const beforeCancelCount = getClasses()
        .find((c) => c.id === classId)
        ?.bookedUsers.length;

      // Then cancel
      await cancelBooking(classId, userId);
      const afterCancelCount = getClasses().find((c) => c.id === classId)?.bookedUsers.length;

      expect(afterCancelCount).toBe((beforeCancelCount ?? 0) - 1);
    });

    it("should not affect other users' bookings when one user cancels", async () => {
      const userId1 = "user_test_7";
      const userId2 = "user_test_8";
      const classId = "hiit-express";

      // Both users book
      await bookClass(classId, userId1);
      await bookClass(classId, userId2);

      // First user cancels
      await cancelBooking(classId, userId1);

      // Second user should still be booked
      const cls = getClasses().find((c) => c.id === classId);
      expect(cls?.bookedUsers).toContain(userId2);
      expect(cls?.bookedUsers).not.toContain(userId1);
    });
  });

  describe("Class capacity validation", () => {
    it("should track when class is at capacity", async () => {
      const classId = "pilates-core"; // capacity: 5
      const cls = getClasses().find((c) => c.id === classId);
      const currentBooked = cls?.bookedUsers.length ?? 0;
      const remainingSpots = (cls?.capacity ?? 0) - currentBooked;

      // Book remaining spots
      for (let i = 0; i < remainingSpots; i++) {
        await bookClass(classId, `user_capacity_${i}`);
      }

      const fullCls = getClasses().find((c) => c.id === classId);
      expect(isFull(fullCls!)).toBe(true);
    });
  });

  describe("Per-user booking isolation", () => {
    it("should isolate bookings by user", async () => {
      const userId1 = "user_test_9";
      const userId2 = "user_test_10";

      // User 1 books a class
      await bookClass("yoga-morning", userId1);
      // User 2 books a different class
      await bookClass("hiit-express", userId2);

      // Get user 1's classes
      const classes = getClasses();
      const user1Classes = classes.filter((cls) => cls.bookedUsers.includes(userId1));
      const user2Classes = classes.filter((cls) => cls.bookedUsers.includes(userId2));

      // Users should have different classes
      expect(user1Classes).not.toEqual(user2Classes);
      expect(user1Classes[0].id).not.toBe(user2Classes[0].id);
    });
  });

  describe("Multiple users in same class", () => {
    it("should support multiple users in same class", async () => {
      const classId = "spin-evening";
      const users = ["user_multi_1", "user_multi_2", "user_multi_3"];

      for (const userId of users) {
        await bookClass(classId, userId);
      }

      const cls = getClasses().find((c) => c.id === classId);

      for (const userId of users) {
        expect(cls?.bookedUsers).toContain(userId);
      }
    });
  });
});

