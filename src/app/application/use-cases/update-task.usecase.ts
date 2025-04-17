import { Task } from '@domain/models/task.model';
import { TaskServicePort } from '@domain/services/task.service.port';

export class UpdateTaskUseCase {
  constructor(private readonly taskService: TaskServicePort) {}

  async execute(task: Task): Promise<Task | null> {
    return await this.taskService.update(task);
  }
}
