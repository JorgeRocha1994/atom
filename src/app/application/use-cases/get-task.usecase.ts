import { Filters, Order } from '@shared/utils/enums';
import { TaskServicePort } from '@domain/services/task.service.port';
import { Task } from '@domain/models/task.model';

export class GetTaskUseCase {
  constructor(private readonly taskService: TaskServicePort) {}

  async execute(filter?: Filters, order?: Order): Promise<Task[]> {
    return await this.taskService.get(filter, order);
  }
}
