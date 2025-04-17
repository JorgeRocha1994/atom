import { TestBed } from '@angular/core/testing';
import { TaskRepository } from '@infrastructure/repository/task.repository';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Task } from '@domain/models/task.model';
import { Filters, Order } from '@shared/utils/enums';
import { AuthTokenService } from '@core/services/auth-token.service';
import { Response } from '@domain/models/response.model';

describe('TaskRepository', () => {
  let repo: TaskRepository;
  let http: jest.Mocked<HttpClient>;

  const mockAuth = {
    getUserId: jest.fn(() => 'user-123'),
  };

  const mockTask: Task = {
    id: '1',
    name: 'Task 1',
    createdAt: new Date(),
    completed: false,
    detail: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskRepository,
        { provide: AuthTokenService, useValue: mockAuth },
        {
          provide: HttpClient,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
            patch: jest.fn(),
          },
        },
      ],
    });

    repo = TestBed.inject(TaskRepository);
    http = TestBed.inject(HttpClient) as jest.Mocked<HttpClient>;
  });

  it('should fetch tasks successfully', async () => {
    http.get.mockReturnValueOnce(of({ data: [mockTask] } as Response<Task[]>));
    const result = await repo.get(Filters.All, Order.Ascending);
    expect(result).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: '1' })])
    );
  });

  it('should return an empty list when no tasks are found', async () => {
    http.get.mockReturnValueOnce(of({ data: [] }));
    const result = await repo.get(Filters.Completed, Order.Descending);
    expect(result).toHaveLength(0);
  });

  it('should throw if fetching tasks fails', async () => {
    http.get.mockReturnValueOnce(
      throwError(() => ({ error: { message: 'API failed' } }))
    );
    await expect(repo.get(Filters.All, Order.Ascending)).rejects.toThrow(
      'API failed'
    );
  });

  it('should create a task successfully', async () => {
    http.post.mockReturnValueOnce(of({ data: mockTask }));
    const result = await repo.create({ name: 'New Task' });
    expect(result?.id).toBe('1');
  });

  it('should throw if task creation fails', async () => {
    http.post.mockReturnValueOnce(
      throwError(() => ({ error: { message: 'Error creating' } }))
    );
    await expect(repo.create({ name: 'Fail' })).rejects.toThrow(
      'Error creating'
    );
  });

  it('should update a task successfully', async () => {
    http.put.mockReturnValueOnce(of({ data: mockTask }));
    const result = await repo.update(mockTask);
    expect(result?.id).toBe('1');
  });

  it('should throw if updating a task without ID', async () => {
    const task = { ...mockTask, id: '' };
    await expect(repo.update(task)).rejects.toThrow('Failed to update task');
  });

  it('should throw if updating task fails', async () => {
    http.put.mockReturnValueOnce(
      throwError(() => ({ error: { message: 'Update failed' } }))
    );
    await expect(repo.update(mockTask)).rejects.toThrow('Update failed');
  });

  it('should delete a task successfully', async () => {
    http.delete.mockReturnValueOnce(of({ data: mockTask }));
    const result = await repo.delete('1');
    expect(result?.id).toBe('1');
  });

  it('should throw if deleting a task fails', async () => {
    http.delete.mockReturnValueOnce(
      throwError(() => ({ error: { message: 'Delete failed' } }))
    );
    await expect(repo.delete('fail-id')).rejects.toThrow('Delete failed');
  });

  it('should toggle task completion status', async () => {
    http.patch.mockReturnValueOnce(
      of({ data: { ...mockTask, completed: true } })
    );
    const result = await repo.toggle('1');
    expect(result?.completed).toBe(true);
  });

  it('should throw if toggle fails', async () => {
    http.patch.mockReturnValueOnce(
      throwError(() => ({ error: { message: 'Toggle failed' } }))
    );
    await expect(repo.toggle('1')).rejects.toThrow('Toggle failed');
  });
});
