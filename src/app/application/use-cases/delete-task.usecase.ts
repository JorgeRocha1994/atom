import { Task } from '@domain/models/task.model';
import { TaskServicePort } from '@domain/services/task.service.port';

export class DeleteTaskUseCase {
  constructor(private readonly taskService: TaskServicePort) {}

  async execute(id: string): Promise<Task | null> {
    return await this.taskService.delete(id);
  }
}
