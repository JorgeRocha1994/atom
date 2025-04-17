import { CreateTaskUseCase } from '@application/use-cases/create-task.usecase';
import { TaskServicePort } from '@domain/services/task.service.port';
import { Task } from '@domain/models/task.model';

describe('CreateTaskUseCase', () => {
  const mockTask: Task = {
    id: '1',
    name: 'Task 1',
    createdAt: new Date(),
    completed: false,
    detail: 'Some detail',
  };

  const mockTaskService: TaskServicePort = {
    create: jest.fn(),
  } as any;

  let useCase: CreateTaskUseCase;

  beforeEach(() => {
    useCase = new CreateTaskUseCase(mockTaskService);
  });

  it('should build and create a new task with defaults', async () => {
    (mockTaskService.create as jest.Mock).mockResolvedValueOnce(mockTask);

    const input: Partial<Task> = {
      name: 'Task 1',
      detail: 'Some detail',
    };

    const result = await useCase.execute(input);

    expect(result).toEqual(mockTask);
    expect(mockTaskService.create).toHaveBeenCalledWith({
      name: 'Task 1',
      detail: 'Some detail',
    });
  });

  it('should return null when service returns null', async () => {
    (mockTaskService.create as jest.Mock).mockResolvedValueOnce(null);
    const result = await useCase.execute({ name: 'Empty Task' });
    expect(result).toBeNull();
  });

  it('should throw if creation fails', async () => {
    (mockTaskService.create as jest.Mock).mockRejectedValueOnce(
      new Error('Create error')
    );
    await expect(useCase.execute({ name: 'Fail' })).rejects.toThrow(
      'Create error'
    );
  });
});
