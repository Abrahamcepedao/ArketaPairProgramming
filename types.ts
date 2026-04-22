export type ClassItem = {
  id: string;
  name: string;
  instructor: string;
  datetime: string;
  capacity: number;
  bookedUsers: string[];
};

export function getBookedCount(classItem: ClassItem): number {
  return classItem.bookedUsers.length;
}

export type MockUser = {
  id: string;
  name: string;
};
