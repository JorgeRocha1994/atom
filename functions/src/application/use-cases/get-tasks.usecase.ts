import { Response } from '../../domain/models/response.model';
import { Task } from '../../domain/models/task.model';
import { TaskRepositoryPort } from '../../domain/ports/task.repository.port';
import { Filters, Order } from '../../shared/utils/enums';

export class GetTasksUseCase {
  constructor(private readonly taskRepo: TaskRepositoryPort) {}

  async execute(userId: string, filters?: Filters, order?: Order): Promise<Response<Task[]>> {
    return await this.taskRepo.get(userId, filters, order);
  }
}
