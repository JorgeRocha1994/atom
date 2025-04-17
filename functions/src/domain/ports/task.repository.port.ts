import { Task } from '../models/task.model';
import { Filters, Order } from '../../shared/utils/enums';
import { Response } from '../models/response.model';

export interface TaskRepositoryPort {
  get(userId: string, filter?: Filters, order?: Order): Promise<Response<Task[]>>;
  create(userId: string, task: Task): Promise<Response<Task>>;
  update(userId: string, task: Task): Promise<Response<Task>>;
  delete(userId: string, taskId: string): Promise<Response<Task>>;
  toggle(userId: string, taskId: string): Promise<Response<Task>>;
}
