import { Response } from '../../domain/models/response.model';
import { Task } from '../../domain/models/task.model';
import { TaskRepositoryPort } from '../../domain/ports/task.repository.port';

export class DeleteTasksUseCase {
  constructor(private readonly taskRepo: TaskRepositoryPort) {}

  async execute(userId: string, taskId: string): Promise<Response<Task>> {
    return await this.taskRepo.delete(userId, taskId);
  }
}
