import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Task } from '@domain/models/task.model';
import { Response } from '@domain/models/response.model';
import { TaskServicePort } from '@domain/services/task.service.port';
import { Filters, Order } from '@shared/utils/enums';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@shared/utils/router';
import { AuthTokenService } from '@core/services/auth-token.service';

@Injectable({
  providedIn: 'root',
})
export class TaskRepository implements TaskServicePort {
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly userId: string;

  constructor(private http: HttpClient, private auth: AuthTokenService) {
    this.userId = this.auth.getUserId() ?? '';
  }

  async get(filters: Filters, order: Order): Promise<Task[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<Response<Task[]>>(
          `${this.baseUrl}/${API_ENDPOINTS.task.get(
            this.userId,
            filters,
            order
          )}`
        )
      );
      return response?.data ?? [];
    } catch (e: any) {
      throw new Error(e?.error?.message || 'Failed to get task');
    }
  }

  async create(task: Partial<Task>): Promise<Task | null> {
    try {
      const response = await firstValueFrom(
        this.http.post<Response<Task>>(
          `${this.baseUrl}/${API_ENDPOINTS.task.create(this.userId)}`,
          task
        )
      );

      if (!response.data) {
        throw new Error(response.message || 'Task not created');
      }

      return response.data;
    } catch (e: any) {
      throw new Error(e?.error?.message || 'Failed to create task');
    }
  }

  async update(task: Task): Promise<Task | null> {
    try {
      if (!task.id) {
        throw new Error('Complete task data were not obtained');
      }

      const response = await firstValueFrom(
        this.http.put<Response<Task>>(
          `${this.baseUrl}/${API_ENDPOINTS.task.update(this.userId, task.id)}`,
          task
        )
      );

      if (!response.data) {
        throw new Error(response.message || 'Task not updated');
      }

      return response.data ?? null;
    } catch (e: any) {
      throw new Error(e?.error?.message || 'Failed to update task');
    }
  }

  async delete(id: string): Promise<Task | null> {
    try {
      const response = await firstValueFrom(
        this.http.delete<Response<Task>>(
          `${this.baseUrl}/${API_ENDPOINTS.task.delete(this.userId, id)}`
        )
      );

      if (!response.data) {
        throw new Error(response.message || 'Task not deleted');
      }

      return response.data;
    } catch (e: any) {
      throw new Error(e?.error?.message || 'Failed to delete task');
    }
  }

  async toggle(id: string): Promise<Task | null> {
    try {
      const response = await firstValueFrom(
        this.http.patch<Response<Task>>(
          `${this.baseUrl}/${API_ENDPOINTS.task.toggle(this.userId, id)}`,
          {}
        )
      );

      if (!response.data) {
        throw new Error(response.message || 'Task not toggled');
      }

      return response.data ?? null;
    } catch (e: any) {
      throw new Error(e?.error?.message || 'Failed to toggle task');
    }
  }
}
