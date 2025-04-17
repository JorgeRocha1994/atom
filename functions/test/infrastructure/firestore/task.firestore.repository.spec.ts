import { FirestoreTaskRepository } from '../../../src/infrastructure/firestore/task.firestore.repository';
import { Filters, HttpStatus, Order } from '../../../src/shared/utils/enums';

jest.mock('../../../src/shared/utils/environment', () => ({
  getEnvironment: jest.fn(() => 'test'),
}));

describe('FirestoreTaskRepository', () => {
  let repo: FirestoreTaskRepository;
  let mockFirestore: any;
  let mockCollection: any;
  let mockDoc: any;
  const userId = 'user-1';

  const task = {
    id: 't1',
    name: 'Task 1',
    createdAt: new Date().toISOString(),
    detail: '',
    completed: false,
  };

  beforeEach(() => {
    mockDoc = {
      get: jest.fn(),
      set: jest.fn(),
    };

    mockCollection = {
      doc: jest.fn(() => mockDoc),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn(),
    };

    mockFirestore = {
      collection: jest.fn(() => mockCollection),
    };

    repo = new FirestoreTaskRepository(mockFirestore);
  });

  describe('get()', () => {
    it('should return tasks when found', async () => {
      mockCollection.get.mockResolvedValueOnce({
        empty: false,
        docs: [
          {
            id: 't1',
            data: () => ({ ...task }),
          },
        ],
      });

      const result = await repo.get(userId, Filters.All, Order.Ascending);

      expect(result.status).toBe(HttpStatus.OK);
      expect(result.data?.length).toBe(1);
    });

    it('should return NO_CONTENT if no tasks found', async () => {
      mockCollection.get.mockResolvedValueOnce({ empty: true });

      const result = await repo.get(userId);

      expect(result.status).toBe(HttpStatus.NO_CONTENT);
      expect(result.message).toBe('No tasks found');
    });
  });

  describe('create()', () => {
    it('should create task if not exists', async () => {
      mockCollection.get.mockResolvedValueOnce({ empty: true });

      const result = await repo.create(userId, task);

      expect(mockDoc.set).toHaveBeenCalledWith(task);
      expect(result.status).toBe(HttpStatus.CREATED);
    });

    it('should return conflict if task already exists', async () => {
      mockCollection.get.mockResolvedValueOnce({ empty: false });

      const result = await repo.create(userId, task);

      expect(result.status).toBe(HttpStatus.CONFLICT);
      expect(result.message).toContain('already exists');
    });
  });

  describe('update()', () => {
    it('should update task if valid', async () => {
      const existingData = { ...task };

      mockCollection.get.mockResolvedValueOnce({ empty: true }).mockResolvedValueOnce({});

      mockDoc.get.mockResolvedValueOnce({
        exists: true,
        data: () => existingData,
      });

      const result = await repo.update(userId, { ...task, name: 'Updated Task' });

      expect(result.status).toBe(HttpStatus.OK);
      expect(result.data?.name).toBe('Updated Task');
    });

    it('should return NOT_FOUND if task does not exist', async () => {
      mockCollection.get.mockResolvedValueOnce({ empty: true }).mockResolvedValueOnce({});

      mockDoc.get.mockResolvedValueOnce({ exists: false });

      const result = await repo.update(userId, task);

      expect(result.status).toBe(HttpStatus.NOT_FOUND);
    });

    it('should return conflict if another task with same name exists', async () => {
      mockCollection.get.mockResolvedValueOnce({
        empty: false,
        docs: [{ data: () => ({ ...task, id: 'other-task' }) }],
      });

      const result = await repo.update(userId, task);

      expect(result.status).toBe(HttpStatus.CONFLICT);
    });
  });

  describe('toggle()', () => {
    it('should toggle task completed state', async () => {
      mockDoc.get.mockResolvedValueOnce({
        exists: true,
        data: () => task,
      });

      const result = await repo.toggle(userId, task.id);

      expect(result.status).toBe(HttpStatus.OK);
      expect(result.data?.completed).toBe(true);
      expect(mockDoc.set).toHaveBeenCalled();
    });

    it('should return NOT_FOUND if task not found', async () => {
      mockDoc.get.mockResolvedValueOnce({ exists: false });

      const result = await repo.toggle(userId, task.id);

      expect(result.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('delete()', () => {
    it('should mark task as deleted', async () => {
      mockDoc.get.mockResolvedValueOnce({
        exists: true,
        data: () => task,
      });

      const result = await repo.delete(userId, task.id);

      expect(result.status).toBe(HttpStatus.OK);
      expect(result.data?.deletedAt).toBeDefined();
      expect(mockDoc.set).toHaveBeenCalled();
    });

    it('should return NOT_FOUND if task does not exist', async () => {
      mockDoc.get.mockResolvedValueOnce({ exists: false });

      const result = await repo.delete(userId, task.id);

      expect(result.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
