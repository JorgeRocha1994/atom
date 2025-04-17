import request from 'supertest';
import express, { Express } from 'express';
import { taskRouter } from '../../../src/interface/routes/tasks.router';
import { HttpStatus } from '../../../src/shared/utils/enums';
import { FirestoreTaskRepository } from '../../../src/infrastructure/firestore/task.firestore.repository';

jest.mock('../../../src/infrastructure/firestore/task.firestore.repository');
jest.mock('../../../src/interface/middlewares/auth.middleware', () => ({
  authInterceptor: (_req: any, _res: any, next: any) => next(),
}));

describe('taskRouter', () => {
  let app: Express;
  let mockCreate: jest.Mock;
  let mockGet: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockDelete: jest.Mock;
  let mockToggle: jest.Mock;

  const mockTask = {
    id: '1',
    name: 'Task 1',
    detail: 'Details',
    createdAt: new Date().toISOString(),
    completed: false,
  };

  beforeEach(() => {
    mockCreate = jest.fn();
    mockGet = jest.fn();
    mockUpdate = jest.fn();
    mockDelete = jest.fn();
    mockToggle = jest.fn();

    (FirestoreTaskRepository as jest.Mock).mockImplementation(() => ({
      create: mockCreate,
      get: mockGet,
      update: mockUpdate,
      delete: mockDelete,
      toggle: mockToggle,
    }));

    app = express();
    app.use(express.json());
    app.use('/tasks', taskRouter({} as any));
  });

  describe('POST /tasks/:userId', () => {
    it('should create a task', async () => {
      mockCreate.mockResolvedValueOnce({
        status: HttpStatus.OK,
        data: mockTask,
      });

      const res = await request(app)
        .post('/tasks/user-1')
        .send({ name: 'Task 1', detail: 'Details' });

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body.data.name).toBe('Task 1');
    });

    it('should return 500 if creation fails', async () => {
      mockCreate.mockRejectedValueOnce(new Error());
      const res = await request(app).post('/tasks/user-1').send({ name: 'Fail Task' });
      expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.error).toBe('Failed to create task');
    });
  });

  describe('GET /tasks/:userId', () => {
    it('should return task list', async () => {
      mockGet.mockResolvedValueOnce({
        status: HttpStatus.OK,
        data: [mockTask],
      });

      const res = await request(app)
        .get('/tasks/user-1')
        .query({ filter: 'All', order: 'Ascending' });
      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body.data).toHaveLength(1);
    });

    it('should return 500 on failure', async () => {
      mockGet.mockRejectedValueOnce(new Error());
      const res = await request(app)
        .get('/tasks/user-1')
        .query({ filter: 'All', order: 'Ascending' });
      expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.error).toBe('Failed to get tasks');
    });
  });

  describe('PUT /tasks/:userId/:taskId', () => {
    it('should update a task', async () => {
      mockUpdate.mockResolvedValueOnce({
        status: HttpStatus.OK,
        data: { ...mockTask, name: 'Updated Task' },
      });
      const res = await request(app).put('/tasks/user-1/1').send({ name: 'Updated Task' });
      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body.data.name).toBe('Updated Task');
    });

    it('should return 500 if update fails', async () => {
      mockUpdate.mockRejectedValueOnce(new Error());
      const res = await request(app).put('/tasks/user-1/1').send({ name: 'Bad Update' });
      expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.error).toBe('Failed to update task');
    });
  });

  describe('PATCH /tasks/:userId/:taskId', () => {
    it('should toggle task', async () => {
      mockToggle.mockResolvedValueOnce({
        status: HttpStatus.OK,
        data: { ...mockTask, completed: true },
      });
      const res = await request(app).patch('/tasks/user-1/1');
      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body.data.completed).toBe(true);
    });

    it('should return 500 if toggle fails', async () => {
      mockToggle.mockRejectedValueOnce(new Error());
      const res = await request(app).patch('/tasks/user-1/1');
      expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.error).toBe('Failed to update task');
    });
  });

  describe('DELETE /tasks/:userId/:taskId', () => {
    it('should delete task successfully', async () => {
      mockDelete.mockResolvedValueOnce({
        status: HttpStatus.OK,
        data: mockTask,
      });
      const res = await request(app).delete('/tasks/user-1/1');
      expect(res.status).toBe(HttpStatus.OK);
    });

    it('should return 500 if deletion fails', async () => {
      mockDelete.mockRejectedValueOnce(new Error());
      const res = await request(app).delete('/tasks/user-1/1');
      expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.error).toBe('Failed to delete task');
    });
  });
});
