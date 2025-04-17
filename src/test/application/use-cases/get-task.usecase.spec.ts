import { GetTaskUseCase } from '@application/use-cases/get-task.usecase';
import { TaskServicePort } from '@domain/services/task.service.port';
import { Task } from '@domain/models/task.model';
import { Filters, Order } from '@shared/utils/enums';

describe('GetTaskUseCase', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      name: 'Task 1',
      createdAt: new Date(),
      completed: false,
      detail: '',
    },
    {
      id: '2',
      name: 'Task 2',
      createdAt: new Date(),
      completed: true,
      detail: '',
    },
  ];

  const mockTaskService: TaskServicePort = {
    get: jest.fn(),
  } as any;

  let useCase: GetTaskUseCase;

  beforeEach(() => {
    useCase = new GetTaskUseCase(mockTaskService);
  });

  it('should return tasks using the provided filters and order', async () => {
    (mockTaskService.get as jest.Mock).mockResolvedValueOnce(mockTasks);
    const result = await useCase.execute(Filters.All, Order.Descending);
    expect(mockTaskService.get).toHaveBeenCalledWith(
      Filters.All,
      Order.Descending
    );
    expect(result).toEqual(mockTasks);
  });

  it('should return an empty array if no tasks are found', async () => {
    (mockTaskService.get as jest.Mock).mockResolvedValueOnce([]);
    const result = await useCase.execute(Filters.Pending, Order.Ascending);
    expect(result).toHaveLength(0);
  });

  it('should throw if get fails', async () => {
    (mockTaskService.get as jest.Mock).mockRejectedValueOnce(
      new Error('Get failed')
    );
    await expect(useCase.execute()).rejects.toThrow('Get failed');
  });
});
