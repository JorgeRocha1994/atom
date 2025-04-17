import { CreateTasksUseCase } from '../../../src/application/use-cases/create-task.usecase';
import { TaskRepositoryPort } from '../../../src/domain/ports/task.repository.port';
import { Task } from '../../../src/domain/models/task.model';
import { HttpStatus } from '../../../src/shared/utils/enums';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'uuid'),
}));

describe('CreateTasksUseCase', () => {
  let useCase: CreateTasksUseCase;
  let mockRepo: jest.Mocked<TaskRepositoryPort>;

  const userId = 'user-1';

  const baseTask: Task = {
    id: '',
    name: 'Task 1',
    createdAt: '',
    completed: false,
    detail: 'Detail',
    deletedAt: null,
    updatedAt: null,
    completedAt: null,
  };

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
    } as any;

    useCase = new CreateTasksUseCase(mockRepo);
  });

  it('should populate fields and create task', async () => {
    const expectedTask = {
      id: 'uuid',
      name: 'Task 1',
      detail: 'Detail',
      completed: false,
      createdAt: expect.any(String),
      deletedAt: null,
      updatedAt: null,
      completedAt: null,
    };

    mockRepo.create.mockResolvedValueOnce({
      status: HttpStatus.CREATED,
      message: 'Task created successfully',
      data: expectedTask as any,
    });

    const inputTask: Task = {
      id: '',
      name: 'Task 1',
      detail: 'Detail',
      createdAt: null,
      completed: false,
      deletedAt: null,
      updatedAt: null,
      completedAt: null,
    };

    const result = await useCase.execute(userId, inputTask);
    expect(uuidv4).toHaveBeenCalled();
    expect(mockRepo.create).toHaveBeenCalledWith(userId, expectedTask);
    expect(result.status).toBe(HttpStatus.CREATED);
    expect(result.data?.id).toBe('uuid');
  });

  it('should throw if repository fails', async () => {
    mockRepo.create.mockRejectedValueOnce(new Error('Create failed'));
    await expect(useCase.execute(userId, { ...baseTask })).rejects.toThrow('Create failed');
  });
});
