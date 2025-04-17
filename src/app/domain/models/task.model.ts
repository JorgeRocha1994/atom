export interface Task {
  id: string;
  name: string;
  detail?: string | null;
  completed?: boolean;
  createdAt: Date;
  updatedAt?: Date | null;
  completedAt?: Date | null;
  deletedAt?: Date | null;
}
