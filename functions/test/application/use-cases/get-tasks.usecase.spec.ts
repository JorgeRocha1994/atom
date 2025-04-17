import { GetTasksUseCase } from '../../../src/application/use-cases/get-tasks.usecase';
import { TaskRepositoryPort } from '../../../src/domain/ports/task.repository.port';
import { Filters, HttpStatus, Order } from '../../../src/shared/utils/enums';
import { Task } from '../../../src/domain/models/task.model';

describe('GetTasksUseCase', () => {
  let useCase: GetTasksUseCase;
  let mockRepo: jest.Mocked<TaskRepositoryPort>;

  const userId = 'user-1';

  const mockTasks: Task[] = [
    {
      id: '1',
      name: 'Task 1',
      createdAt: new Date().toISOString(),
      completed: false,
      detail: '',
    },
  ];

  beforeEach(() => {
    mockRepo = {
      get: jest.fn(),
    } as any;

    useCase = new GetTasksUseCase(mockRepo);
  });

  it('should return tasks from repository', async () => {
    mockRepo.get.mockResolvedValueOnce({
      status: HttpStatus.OK,
      message: 'Tasks retrieved',
      data: mockTasks,
    });

    const result = await useCase.execute(userId, Filters.All, Order.Ascending);
    expect(mockRepo.get).toHaveBeenCalledWith(userId, Filters.All, Order.Ascending);
    expect(result.data).toEqual(mockTasks);
  });

  it('should throw if repository fails', async () => {
    mockRepo.get.mockRejectedValueOnce(new Error('Get failed'));
    await expect(useCase.execute(userId)).rejects.toThrow('Get failed');
  });
});
