import { Task } from '@domain/models/task.model';
import { TaskServicePort } from '@domain/services/task.service.port';

export class CreateTaskUseCase {
  constructor(private readonly taskService: TaskServicePort) {}

  async execute(task: Partial<Task>): Promise<Task | null> {
    return await this.taskService.create(task);
  }
}
