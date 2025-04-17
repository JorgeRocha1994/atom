import { Injectable } from '@angular/core';
import { CreateTaskUseCase } from '../use-cases/create-task.usecase';
import { GetTaskUseCase } from '../use-cases/get-task.usecase';
import { DeleteTaskUseCase } from '../use-cases/delete-task.usecase';
import { ToggleTaskUseCase } from '../use-cases/toggle-task.usecase';
import { UpdateTaskUseCase } from '../use-cases/update-task.usecase';
import { Task } from '@domain/models/task.model';
import { Filters, Order } from '@shared/utils/enums';

@Injectable({ providedIn: 'root' })
export class TaskUseFacade {
  constructor(
    private createTask: CreateTaskUseCase,
    private getTasks: GetTaskUseCase,
    private deleteTask: DeleteTaskUseCase,
    private toggleTask: ToggleTaskUseCase,
    private updateTask: UpdateTaskUseCase
  ) {}

  create(task: Partial<Task>): Promise<Task | null> {
    return this.createTask.execute(task);
  }

  get(filter?: Filters, order?: Order): Promise<Task[]> {
    return this.getTasks.execute(filter, order);
  }

  delete(id: string): Promise<Task | null> {
    return this.deleteTask.execute(id);
  }

  toggle(id: string): Promise<Task | null> {
    return this.toggleTask.execute(id);
  }

  update(task: Task): Promise<Task | null> {
    return this.updateTask.execute(task);
  }
}
