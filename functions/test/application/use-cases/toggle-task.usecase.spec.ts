import { ToggleTasksUseCase } from '../../../src/application/use-cases/toggle-task.usecase';
import { TaskRepositoryPort } from '../../../src/domain/ports/task.repository.port';
import { Task } from '../../../src/domain/models/task.model';
import { HttpStatus } from '../../../src/shared/utils/enums';

describe('ToggleTasksUseCase', () => {
  let useCase: ToggleTasksUseCase;
  let mockRepo: jest.Mocked<TaskRepositoryPort>;

  const userId = 'user-1';
  const taskId = '1';

  const task: Task = {
    id: taskId,
    name: 'Task 1',
    createdAt: new Date().toISOString(),
    completed: false,
    detail: '',
  };

  beforeEach(() => {
    mockRepo = {
      toggle: jest.fn(),
    } as any;

    useCase = new ToggleTasksUseCase(mockRepo);
  });

  it('should toggle the task using repository', async () => {
    mockRepo.toggle.mockResolvedValueOnce({
      status: HttpStatus.OK,
      message: 'Task toggled successfully',
      data: { ...task, completed: true },
    });

    const result = await useCase.execute(userId, taskId);

    expect(mockRepo.toggle).toHaveBeenCalledWith(userId, taskId);
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data?.completed).toBe(true);
  });

  it('should throw if repository throws', async () => {
    mockRepo.toggle.mockRejectedValueOnce(new Error('Toggle failed'));
    await expect(useCase.execute(userId, taskId)).rejects.toThrow('Toggle failed');
  });
});
