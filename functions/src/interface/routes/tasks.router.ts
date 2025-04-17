import { Router } from 'express';
import { Firestore } from 'firebase-admin/firestore';
import {
  CreateTasksUseCase,
  GetTasksUseCase,
  UpdateTasksUseCase,
  DeleteTasksUseCase,
  ToggleTasksUseCase,
} from '../../application/use-cases';
import { validateUserId, validateTaskId, validateBody } from '../middlewares/request.middleware';
import { FirestoreTaskRepository } from '../../infrastructure/firestore/task.firestore.repository';
import { Filters, HttpStatus, Order } from '../../shared/utils/enums';
import { Task } from '../../domain/models/task.model';
import { authInterceptor } from '../middlewares/auth.middleware';

export function taskRouter(firestore: Firestore): Router {
  const router = Router();
  const authRepo = new FirestoreTaskRepository(firestore);
  const getTask = new GetTasksUseCase(authRepo);
  const createTask = new CreateTasksUseCase(authRepo);
  const updateTask = new UpdateTasksUseCase(authRepo);
  const deleteTask = new DeleteTasksUseCase(authRepo);
  const toggleTask = new ToggleTasksUseCase(authRepo);

  router.use(authInterceptor);

  router.post('/:userId', validateUserId, validateBody, async (req, res) => {
    try {
      const { userId } = req.params;
      const task = req.body as Partial<Task>;

      const response = await createTask.execute(userId, task as Task);
      res.status(response.status).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create task' });
    }
  });

  router.get('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const { filter, order } = req.query as { filter: Filters; order: Order };

      const response = await getTask.execute(userId, filter, order);
      res.status(response.status).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to get tasks' });
    }
  });

  router.put('/:userId/:taskId', validateUserId, validateTaskId, validateBody, async (req, res) => {
    try {
      const { userId, taskId } = req.params;
      const task = req.body as Partial<Task>;

      const response = await updateTask.execute(userId, {
        id: taskId,
        ...task,
      } as Task);
      res.status(response.status).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update task' });
    }
  });

  router.patch('/:userId/:taskId', validateUserId, validateTaskId, async (req, res) => {
    try {
      const { userId, taskId } = req.params;

      const response = await toggleTask.execute(userId, taskId);
      res.status(response.status).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update task' });
    }
  });

  router.delete('/:userId/:taskId', validateUserId, validateTaskId, async (req, res) => {
    try {
      const { userId, taskId } = req.params;

      const response = await deleteTask.execute(userId, taskId);
      res.status(response.status).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete task' });
    }
  });

  return router;
}
