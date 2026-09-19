export type Label = {
  id: string;
  name: string;
  color: string;
};

export type Task = {
  id: string;
  title: string;
  notes?: string;
  labelIds: string[];
  done: boolean;
  createdAt: number;
  dueDate?: string; // ISO date string (yyyy-mm-dd), optional
};
