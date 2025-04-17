import { Provider } from '@angular/core';
import { GetTaskUseCase } from '@application/use-cases/get-task.usecase';
import { CreateTaskUseCase } from '@application/use-cases/create-task.usecase';
import { UpdateTaskUseCase } from '@application/use-cases/update-task.usecase';
import { DeleteTaskUseCase } from '@application/use-cases/delete-task.usecase';
import { ToggleTaskUseCase } from '@application/use-cases/toggle-task.usecase';
import { TaskRepository } from '@infrastructure/repository/task.repository';

export const TaskProviders: Provider[] = [
  {
    provide: GetTaskUseCase,
    useFactory: (repo: TaskRepository) => new GetTaskUseCase(repo),
    deps: [TaskRepository],
  },
  {
    provide: CreateTaskUseCase,
    useFactory: (repo: TaskRepository) => new CreateTaskUseCase(repo),
    deps: [TaskRepository],
  },
  {
    provide: UpdateTaskUseCase,
    useFactory: (repo: TaskRepository) => new UpdateTaskUseCase(repo),
    deps: [TaskRepository],
  },
  {
    provide: DeleteTaskUseCase,
    useFactory: (repo: TaskRepository) => new DeleteTaskUseCase(repo),
    deps: [TaskRepository],
  },
  {
    provide: ToggleTaskUseCase,
    useFactory: (repo: TaskRepository) => new ToggleTaskUseCase(repo),
    deps: [TaskRepository],
  },
  TaskRepository,
];
