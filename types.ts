export type ClassItem = {
  id: string;
  name: string;
  instructor: string;
  datetime: string;
  capacity: number;
  bookedUserIds: string[];
};

export type MockUser = {
  id: string;
  name: string;
};
