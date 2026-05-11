export type ClassItem = {
  id: string;
  name: string;
  instructor: string;
  datetime: string;
  capacity: number;
  bookedUsers: number;
  bookedUserIds: string[];
};

export type MockUser = {
  id: string;
  name: string;
};
