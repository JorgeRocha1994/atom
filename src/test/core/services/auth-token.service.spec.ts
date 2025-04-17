import { AuthTokenService } from '@core/services/auth-token.service';
import { Router } from '@angular/router';
import { UserToken } from '@domain/models/user.model';

describe('AuthTokenService', () => {
  let service: AuthTokenService;
  let mockRouter: jest.Mocked<Router>;

  const mockUser: UserToken = {
    id: '1',
    email: 'test@example.com',
    token: 'token123',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  };

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn(),
    } as any;

    localStorage.clear();
    jest.useFakeTimers();
    service = new AuthTokenService(mockRouter);
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should set and retrieve the token', () => {
    service.setToken(mockUser);

    expect(service.getToken()).toBe(mockUser.token);
    expect(localStorage.getItem('auth_token')).toBe(mockUser.token);
    expect(localStorage.getItem('email')).toBe(mockUser.email);
    expect(localStorage.getItem('user_id')).toBe(mockUser.id);
  });

  it('should return userId and email from localStorage', () => {
    service.setToken(mockUser);

    expect(service.getUserId()).toBe(mockUser.id);
    expect(service.getEmail()).toBe(mockUser.email);
  });

  it('should clear all stored data and navigate to root', () => {
    service.setToken(mockUser);

    service.clear();

    expect(service.getToken()).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set token on init if localStorage is valid and not expired', () => {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    localStorage.setItem('user_id', 'u1');
    localStorage.setItem('email', 'test@example.com');
    localStorage.setItem('auth_token', 'valid-token');
    localStorage.setItem('auth_expires_at', expiresAt.toISOString());

    const instance = new AuthTokenService(mockRouter);

    expect(instance.getToken()).toBe('valid-token');
  });

  it('should clear token on init if expired', () => {
    const expiredAt = new Date(Date.now() - 1000);
    localStorage.setItem('user_id', 'u1');
    localStorage.setItem('email', 'test@example.com');
    localStorage.setItem('auth_token', 'expired-token');
    localStorage.setItem('auth_expires_at', expiredAt.toISOString());

    const instance = new AuthTokenService(mockRouter);

    expect(instance.getToken()).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});
