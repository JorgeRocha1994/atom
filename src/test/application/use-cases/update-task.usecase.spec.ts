import { UpdateTaskUseCase } from '@application/use-cases/update-task.usecase';
import { Task } from '@domain/models/task.model';
import { TaskServicePort } from '@domain/services/task.service.port';

describe('UpdateTaskUseCase', () => {
  const mockTask: Task = {
    id: '1',
    name: 'Updated Task',
    createdAt: new Date(),
    completed: false,
    detail: 'New detail',
  };

  const mockTaskService: TaskServicePort = {
    update: jest.fn(),
  } as any;

  let useCase: UpdateTaskUseCase;

  beforeEach(() => {
    useCase = new UpdateTaskUseCase(mockTaskService);
  });

  it('should return the result from taskService.update', async () => {
    (mockTaskService.update as jest.Mock).mockResolvedValueOnce(mockTask);
    const result = await useCase.execute(mockTask);
    expect(mockTaskService.update).toHaveBeenCalledWith(mockTask);
    expect(result).toEqual(mockTask);
  });

  it('should return null when update returns null', async () => {
    (mockTaskService.update as jest.Mock).mockResolvedValueOnce(null);
    const result = await useCase.execute(mockTask);
    expect(result).toBeNull();
  });

  it('should throw if taskService.update fails', async () => {
    (mockTaskService.update as jest.Mock).mockRejectedValueOnce(
      new Error('Failed')
    );
    await expect(useCase.execute(mockTask)).rejects.toThrow('Failed');
  });
});
