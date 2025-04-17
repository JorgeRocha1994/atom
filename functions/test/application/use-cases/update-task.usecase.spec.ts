import { UpdateTasksUseCase } from '../../../src/application/use-cases/update-task.usecase';
import { TaskRepositoryPort } from '../../../src/domain/ports/task.repository.port';
import { Task } from '../../../src/domain/models/task.model';
import { HttpStatus } from '../../../src/shared/utils/enums';

describe('UpdateTasksUseCase', () => {
  let useCase: UpdateTasksUseCase;
  let mockRepo: jest.Mocked<TaskRepositoryPort>;

  const mockTask: Task = {
    id: '1',
    name: 'Task 1',
    createdAt: new Date().toISOString(),
    completed: false,
    detail: 'New Detail',
  };

  const userId = 'user-1';

  beforeEach(() => {
    mockRepo = {
      update: jest.fn(),
    } as any;

    useCase = new UpdateTasksUseCase(mockRepo);
  });

  it('should update task using repository', async () => {
    mockRepo.update.mockResolvedValueOnce({
      status: HttpStatus.OK,
      message: 'Task updated successfully',
      data: { ...mockTask, name: 'Updated' },
    });

    const result = await useCase.execute(userId, mockTask);
    expect(mockRepo.update).toHaveBeenCalledWith(userId, mockTask);
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data?.name).toBe('Updated');
  });

  it('should return error if repository fails', async () => {
    mockRepo.update.mockRejectedValueOnce(new Error('Update failed'));
    await expect(useCase.execute(userId, mockTask)).rejects.toThrow('Update failed');
  });
});
