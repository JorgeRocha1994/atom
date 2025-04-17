import { Injectable } from '@angular/core';
import { UserToken } from '@domain/models/user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  private token: string | null = null;
  private refreshTimeout: any = null;

  constructor(private router: Router) {
    this.setTokenFromStorage();
  }

  private setTokenFromStorage() {
    const email = localStorage.getItem('email');
    const id = localStorage.getItem('user_id');
    const token = localStorage.getItem('auth_token');
    const expiresAtRaw = localStorage.getItem('auth_expires_at');

    if (email && id && token && expiresAtRaw) {
      const expiresAt = new Date(expiresAtRaw);

      if (expiresAt.getTime() > Date.now()) {
        this.setToken({ id, email, token, expiresAt } as UserToken);
      } else {
        this.clear();
      }
    }
  }

  setToken(user: UserToken) {
    this.token = user.token;
    localStorage.setItem('user_id', user.id);
    localStorage.setItem('email', user.email);
    localStorage.setItem('auth_token', user.token);
    localStorage.setItem('auth_expires_at', user.expiresAt.toISOString());
  }

  scheduleRefresh(expiresAt: Date, callback: () => void) {
    if (this.refreshTimeout) clearTimeout(this.refreshTimeout);

    // refreshInMs = 30 seconds before the token actually expires
    const refreshInMs = expiresAt.getTime() - Date.now() - 30 * 1000;

    this.refreshTimeout = setTimeout(callback, refreshInMs);
  }

  getToken(): string | null {
    return this.token;
  }

  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  clear() {
    this.token = null;
    clearTimeout(this.refreshTimeout);
    localStorage.removeItem('user_id');
    localStorage.removeItem('email');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_expires_at');
    location.reload();
  }
}
