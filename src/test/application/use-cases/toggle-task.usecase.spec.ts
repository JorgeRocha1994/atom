import { ToggleTaskUseCase } from '@application/use-cases/toggle-task.usecase';
import { TaskServicePort } from '@domain/services/task.service.port';
import { Task } from '@domain/models/task.model';

describe('ToggleTaskUseCase', () => {
  const mockTask: Task = {
    id: '1',
    name: 'Task 1',
    createdAt: new Date(),
    completed: true,
    detail: '',
  };

  const mockTaskService: TaskServicePort = {
    toggle: jest.fn(),
  } as any;

  let useCase: ToggleTaskUseCase;

  beforeEach(() => {
    useCase = new ToggleTaskUseCase(mockTaskService);
  });

  it('should return the toggled task', async () => {
    (mockTaskService.toggle as jest.Mock).mockResolvedValueOnce(mockTask);
    const result = await useCase.execute('1');
    expect(mockTaskService.toggle).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockTask);
  });

  it('should return null if toggle returns null', async () => {
    (mockTaskService.toggle as jest.Mock).mockResolvedValueOnce(null);
    const result = await useCase.execute('1');
    expect(result).toBeNull();
  });

  it('should throw if toggle fails', async () => {
    (mockTaskService.toggle as jest.Mock).mockRejectedValueOnce(
      new Error('Toggle error')
    );
    await expect(useCase.execute('1')).rejects.toThrow('Toggle error');
  });
});
