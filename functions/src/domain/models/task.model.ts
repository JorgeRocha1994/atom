export interface Task {
  id: string;
  name: string;
  detail?: string | null;
  completed: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  completedAt?: string | null;
  deletedAt?: string | null;
}
