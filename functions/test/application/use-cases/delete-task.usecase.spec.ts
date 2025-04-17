import { DeleteTasksUseCase } from '../../../src/application/use-cases/delete-task.usecase';
import { TaskRepositoryPort } from '../../../src/domain/ports/task.repository.port';
import { Task } from '../../../src/domain/models/task.model';
import { HttpStatus } from '../../../src/shared/utils/enums';

describe('DeleteTasksUseCase', () => {
  let useCase: DeleteTasksUseCase;
  let mockRepo: jest.Mocked<TaskRepositoryPort>;

  const userId = 'user-1';
  const taskId = '1';

  const mockTask: Task = {
    id: taskId,
    name: 'Sample task',
    createdAt: new Date().toISOString(),
    completed: false,
    detail: '',
  };

  beforeEach(() => {
    mockRepo = {
      delete: jest.fn(),
    } as any;

    useCase = new DeleteTasksUseCase(mockRepo);
  });

  it('should delete the task using the repository', async () => {
    mockRepo.delete.mockResolvedValueOnce({
      status: HttpStatus.OK,
      message: 'Task deleted',
      data: mockTask,
    });

    const result = await useCase.execute(userId, taskId);

    expect(mockRepo.delete).toHaveBeenCalledWith(userId, taskId);
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data?.id).toBe(taskId);
  });

  it('should throw if repository throws', async () => {
    mockRepo.delete.mockRejectedValueOnce(new Error('Delete failed'));
    await expect(useCase.execute(userId, taskId)).rejects.toThrow('Delete failed');
  });
});
