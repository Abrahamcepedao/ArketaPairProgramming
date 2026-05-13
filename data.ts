import type { ClassItem } from "./types";

function atOffset(days: number, hours: number, minutes = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

export function seedClasses(): ClassItem[] {
  return [
    {
      id: "yoga-morning",
      name: "Morning Yoga Flow",
      instructor: "Priya Shah",
      datetime: atOffset(1, 9),
      capacity: 10,
      currentUsers: [],
      waitlist: [],
    },
    {
      id: "hiit-express",
      name: "HIIT Express 30",
      instructor: "Marcus Lee",
      datetime: atOffset(1, 18),
      capacity: 8,
      currentUsers: [],
      waitlist: [],
    },
    {
      id: "pilates-core",
      name: "Pilates Core",
      instructor: "Jenna Ortiz",
      datetime: atOffset(2, 12),
      capacity: 5,
      currentUsers: [],
      waitlist: [],
    },
    {
      id: "sunrise-flow",
      name: "Sunrise Flow",
      instructor: "Devon Park",
      datetime: atOffset(-1, 7),
      capacity: 10,
      currentUsers: [],
      waitlist: [],
    },
    {
      id: "spin-evening",
      name: "Evening Spin",
      instructor: "Rosa Martinez",
      datetime: atOffset(3, 19),
      capacity: 15,
      currentUsers: [],
      waitlist: [],
    },
  ];
}
