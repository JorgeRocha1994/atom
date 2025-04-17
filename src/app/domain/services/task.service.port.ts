import { Filters, Order } from '@shared/utils/enums';
import { Task } from '@domain/models/task.model';

export interface TaskServicePort {
  get(filters?: Filters, order?: Order): Promise<Task[]>;
  create(task: Partial<Task>): Promise<Task | null>;
  update(task: Task): Promise<Task | null>;
  delete(id: string): Promise<Task | null>;
  toggle(id: string): Promise<Task | null>;
}
