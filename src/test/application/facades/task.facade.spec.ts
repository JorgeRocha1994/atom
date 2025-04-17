import { TestBed } from '@angular/core/testing';
import { TaskUseFacade } from '@application/facades/task.facade';
import { CreateTaskUseCase } from '@application/use-cases/create-task.usecase';
import { GetTaskUseCase } from '@application/use-cases/get-task.usecase';
import { DeleteTaskUseCase } from '@application/use-cases/delete-task.usecase';
import { ToggleTaskUseCase } from '@application/use-cases/toggle-task.usecase';
import { UpdateTaskUseCase } from '@application/use-cases/update-task.usecase';
import { Task } from '@domain/models/task.model';
import { Filters, Order } from '@shared/utils/enums';

describe('TaskUseFacade', () => {
  let facade: TaskUseFacade;

  let mockCreate: jest.Mocked<CreateTaskUseCase>;
  let mockGet: jest.Mocked<GetTaskUseCase>;
  let mockDelete: jest.Mocked<DeleteTaskUseCase>;
  let mockToggle: jest.Mocked<ToggleTaskUseCase>;
  let mockUpdate: jest.Mocked<UpdateTaskUseCase>;

  const mockTask: Task = {
    id: '1',
    name: 'Task 1',
    createdAt: new Date(),
    completed: false,
    detail: '',
  };

  beforeEach(() => {
    mockCreate = { execute: jest.fn() } as any;
    mockGet = { execute: jest.fn() } as any;
    mockDelete = { execute: jest.fn() } as any;
    mockToggle = { execute: jest.fn() } as any;
    mockUpdate = { execute: jest.fn() } as any;

    TestBed.configureTestingModule({
      providers: [
        TaskUseFacade,
        { provide: CreateTaskUseCase, useValue: mockCreate },
        { provide: GetTaskUseCase, useValue: mockGet },
        { provide: DeleteTaskUseCase, useValue: mockDelete },
        { provide: ToggleTaskUseCase, useValue: mockToggle },
        { provide: UpdateTaskUseCase, useValue: mockUpdate },
      ],
    });

    facade = TestBed.inject(TaskUseFacade);
  });

  it('should create a new task', async () => {
    mockCreate.execute.mockResolvedValueOnce(mockTask);
    const result = await facade.create({ name: 'Task 1' });
    expect(mockCreate.execute).toHaveBeenCalledWith({ name: 'Task 1' });
    expect(result).toEqual(mockTask);
  });

  it('should get tasks with filters and order', async () => {
    mockGet.execute.mockResolvedValueOnce([mockTask]);
    const result = await facade.get(Filters.All, Order.Ascending);
    expect(mockGet.execute).toHaveBeenCalledWith(Filters.All, Order.Ascending);
    expect(result).toEqual([mockTask]);
  });

  it('should delete a task by ID', async () => {
    mockDelete.execute.mockResolvedValueOnce(mockTask);
    const result = await facade.delete('1');
    expect(mockDelete.execute).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockTask);
  });

  it('should toggle a task by ID', async () => {
    mockToggle.execute.mockResolvedValueOnce({ ...mockTask, completed: true });
    const result = await facade.toggle('1');
    expect(mockToggle.execute).toHaveBeenCalledWith('1');
    expect(result?.completed).toBe(true);
  });

  it('should update an existing task', async () => {
    const updated = { ...mockTask, name: 'Updated' };
    mockUpdate.execute.mockResolvedValueOnce(updated);
    const result = await facade.update(updated);
    expect(mockUpdate.execute).toHaveBeenCalledWith(updated);
    expect(result?.name).toBe('Updated');
  });
});
