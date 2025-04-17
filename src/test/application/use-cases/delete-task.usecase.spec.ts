import { DeleteTaskUseCase } from '@application/use-cases/delete-task.usecase';
import { TaskServicePort } from '@domain/services/task.service.port';
import { Task } from '@domain/models/task.model';

describe('DeleteTaskUseCase', () => {
  const mockTask: Task = {
    id: '1',
    name: 'Task 1',
    createdAt: new Date(),
    completed: false,
    detail: '',
  };

  const mockTaskService: TaskServicePort = {
    delete: jest.fn(),
  } as any;

  let useCase: DeleteTaskUseCase;

  beforeEach(() => {
    useCase = new DeleteTaskUseCase(mockTaskService);
  });

  it('should return the deleted task', async () => {
    (mockTaskService.delete as jest.Mock).mockResolvedValueOnce(mockTask);
    const result = await useCase.execute('1');
    expect(mockTaskService.delete).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockTask);
  });

  it('should return null if task is not found', async () => {
    (mockTaskService.delete as jest.Mock).mockResolvedValueOnce(null);
    const result = await useCase.execute('1');
    expect(result).toBeNull();
  });

  it('should throw if delete fails', async () => {
    (mockTaskService.delete as jest.Mock).mockRejectedValueOnce(
      new Error('Delete error')
    );
    await expect(useCase.execute('1')).rejects.toThrow('Delete error');
  });
});
