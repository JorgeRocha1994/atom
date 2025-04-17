import { Response } from '../../domain/models/response.model';
import { Task } from '../../domain/models/task.model';
import { TaskRepositoryPort } from '../../domain/ports/task.repository.port';

export class UpdateTasksUseCase {
  constructor(private readonly taskRepo: TaskRepositoryPort) {}

  async execute(userId: string, task: Task): Promise<Response<Task>> {
    return await this.taskRepo.update(userId, task);
  }
}
