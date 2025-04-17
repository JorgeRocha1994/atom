import { v4 as uuidv4 } from 'uuid';
import { Response } from '../../domain/models/response.model';
import { Task } from '../../domain/models/task.model';
import { TaskRepositoryPort } from '../../domain/ports/task.repository.port';

export class CreateTasksUseCase {
  constructor(private readonly taskRepo: TaskRepositoryPort) {}

  async execute(userId: string, task: Task): Promise<Response<Task>> {
    task.id = uuidv4();
    task.createdAt = new Date().toISOString();
    task.completed = false;
    task.deletedAt = null;
    task.updatedAt = null;
    task.completedAt = null;

    return await this.taskRepo.create(userId, task);
  }
}
