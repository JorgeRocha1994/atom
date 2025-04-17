import { Injectable } from '@angular/core';
import { SignInUserUseCase } from '../use-cases/sign-in-user.usecase';
import { SignUpUserUseCase } from '../use-cases/sign-up-user.usecase';
import { UserToken } from '@domain/models/user.model';
import { AuthTokenService } from '@core/services/auth-token.service';

@Injectable({ providedIn: 'root' })
export class UserUseFacade {
  constructor(
    private signIn: SignInUserUseCase,
    private signUp: SignUpUserUseCase,
    private auth: AuthTokenService
  ) {}

  async create(email: string): Promise<UserToken | null> {
    const user = await this.signUp.execute(email);
    if (user) {
      this.auth.setToken(user);
      this.auth.scheduleRefresh(user.expiresAt, () => this.refreshToken());
    }
    return user;
  }

  async get(email: string): Promise<UserToken | null> {
    const user = await this.signIn.execute(email);
    if (user) {
      this.auth.setToken(user);
      this.auth.scheduleRefresh(user.expiresAt, () => this.refreshToken());
    }
    return user;
  }

  private async refreshToken() {
    try {
      console.log('[Auth] scheduleRefresh', new Date().toISOString());

      const email = this.auth.getEmail();
      if (!email) {
        console.error(
          '[Auth] Refresh failed: The user email was not obtained correctly'
        );
        this.auth.clear();
        return;
      }

      const userRefreshed = await this.get(email);
      if (!userRefreshed) {
        console.error(
          '[Auth] Refresh failed: Unable to obtain user information'
        );
        this.auth.clear();
        return;
      }
    } catch (e: any) {
      console.error('[Auth] Refresh failed', e.message);
      this.auth.clear();
    }
  }
}
