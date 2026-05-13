export type ClassItem = {
  id: string;
  name: string;
  instructor: string;
  datetime: string;
  capacity: number;
  currentUsers: string[];
  waitlist: string[];
};

export type MockUser = {
  id: string;
  name: string;
};

export type Notification = {
  id: string;
  userId: string;
  type: "promoted" | "available";
  classId: string;
  className: string;
  timestamp: number;
};
