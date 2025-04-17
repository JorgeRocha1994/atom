import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { UserToken } from '@domain/models/user.model';
import { Response } from '@domain/models/response.model';
import { UserServicePort } from '@domain/services/user.service.port';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@shared/utils/router';

@Injectable({
  providedIn: 'root',
})
export class UserRepository implements UserServicePort {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  async signIn(email: string): Promise<UserToken | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<Response<UserToken>>(
          `${this.baseUrl}/${API_ENDPOINTS.user.signIn(email)}`
        )
      );

      if (!response.data) {
        throw new Error(response.message || 'User not obtained');
      }

      return { ...response.data, expiresAt: new Date(response.data.expiresAt) };
    } catch (e: any) {
      if (e.status === 404) {
        return null;
      }

      throw new Error(e?.error?.message || 'Failed to get user');
    }
  }

  async signUp(email: string): Promise<UserToken | null> {
    try {
      const response = await firstValueFrom(
        this.http.post<Response<UserToken>>(
          `${this.baseUrl}/${API_ENDPOINTS.user.signUp}`,
          { email }
        )
      );

      if (!response.data) {
        throw new Error(response.message || 'User not created');
      }

      return { ...response.data, expiresAt: new Date(response.data.expiresAt) };
    } catch (e: any) {
      throw new Error(e?.error?.message || 'Failed to create user');
    }
  }
}
