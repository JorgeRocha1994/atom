import { Firestore } from 'firebase-admin/firestore';
import { TaskRepositoryPort } from '../../domain/ports/task.repository.port';
import { Task } from '../../domain/models/task.model';
import { HttpStatus, Filters, Order } from '../../shared/utils/enums';
import { Response } from '../../domain/models/response.model';
import { getEnvironment } from '../../shared/utils/environment';

export class FirestoreTaskRepository implements TaskRepositoryPort {
  private readonly environment: string;
  constructor(private firestore: Firestore) {
    this.environment = getEnvironment();
  }

  private collection(userId: string) {
    return this.firestore.collection(`${this.environment}_users/${userId}/tasks`);
  }

  async get(
    userId: string,
    filter: Filters = Filters.All,
    order: Order = Order.Descending
  ): Promise<Response<Task[]>> {
    const query = this.collection(userId).orderBy('createdAt', order);
    const snapshot = await query.get();

    if (snapshot.empty) {
      return {
        status: HttpStatus.NO_CONTENT,
        message: 'No tasks found',
      };
    }

    // We filter in code while tasks are few, avoiding a Firestore index.
    const tasks: Task[] = snapshot.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }) as Task)
      .filter((task) => !task.deletedAt)
      .filter((task) => {
        switch (filter) {
        case Filters.Completed:
          return task.completed;
        case Filters.Pending:
          return !task.completed;
        default:
          return true;
        }
      });

    return {
      status: tasks.length ? HttpStatus.OK : HttpStatus.NO_CONTENT,
      message: tasks.length ? 'Tasks retrieved successfully' : 'No tasks found',
      data: tasks,
    };
  }

  async create(userId: string, task: Task): Promise<Response<Task>> {
    const existing = await this.collection(userId)
      .where('deletedAt', '==', null)
      .where('completed', '==', false)
      .where('name', '==', task.name.trim())
      .limit(1)
      .get();

    if (!existing.empty) {
      return {
        status: HttpStatus.CONFLICT,
        message: 'A task with the same name already exists',
      };
    }

    const ref = this.collection(userId).doc(task.id);
    await ref.set(task);

    return {
      status: HttpStatus.CREATED,
      message: 'Task created successfully',
      data: task,
    };
  }

  async update(userId: string, task: Task): Promise<Response<Task>> {
    const existing = await this.collection(userId)
      .where('completed', '==', false)
      .where('name', '==', task.name.trim())
      .limit(1)
      .get();

    const existingData: Task | null = !existing.empty ? (existing.docs[0]?.data() as Task) : null;

    if (existingData && task.id !== existingData?.id && existingData.deletedAt == null) {
      // We validate in code while tasks are few, avoiding a Firestore index.
      return {
        status: HttpStatus.CONFLICT,
        message: 'An uncompleted task with the same name already exists.',
      };
    }

    const ref = this.collection(userId).doc(task.id);
    const doc = await ref.get();
    if (!doc.exists) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Task not found',
      };
    }

    const actualTask = doc.data() as Task;
    const updated: Task = {
      ...actualTask,
      name: task.name.trim(),
      detail: task.detail?.trim() || null,
      updatedAt: new Date().toISOString(),
    };

    await ref.set(updated);

    return {
      status: HttpStatus.OK,
      message: 'Task updated successfully',
      data: updated,
    };
  }

  async toggle(userId: string, taskId: string): Promise<Response<Task>> {
    const ref = this.collection(userId).doc(taskId);
    const doc = await ref.get();

    if (!doc.exists) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Task not found',
      };
    }

    const task = doc.data() as Task;
    const updated: Task = {
      ...task,
      completed: !task.completed,
      completedAt: task.completed ? null : new Date().toISOString(),
    };

    await ref.set(updated);

    return {
      status: HttpStatus.OK,
      message: 'Task toggled successfully',
      data: updated,
    };
  }

  async delete(userId: string, taskId: string): Promise<Response<Task>> {
    const ref = this.collection(userId).doc(taskId);
    const doc = await ref.get();

    if (!doc.exists) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Task not found',
      };
    }

    const task = doc.data() as Task;
    const deleted: Task = {
      ...task,
      deletedAt: new Date().toISOString(),
    };

    await ref.set(deleted);

    return {
      status: HttpStatus.OK,
      message: 'Task deleted successfully',
      data: deleted,
    };
  }
}
