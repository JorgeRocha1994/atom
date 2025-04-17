import { AuthTokenService } from '@core/services/auth-token.service';
import { UserToken } from '@domain/models/user.model';
import { reloadPage } from '@shared/utils/navigation';

jest.mock('@shared/utils/navigation', () => ({
  reloadPage: jest.fn(),
}));

describe('AuthTokenService', () => {
  let service: AuthTokenService;

  const mockUser: UserToken = {
    id: '1',
    email: 'test@example.com',
    token: 'token123',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  };

  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
    service = new AuthTokenService();
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
    expect(reloadPage).toHaveBeenCalled();
  });

  it('should set token on init if localStorage is valid and not expired', () => {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    localStorage.setItem('user_id', 'u1');
    localStorage.setItem('email', 'test@example.com');
    localStorage.setItem('auth_token', 'valid-token');
    localStorage.setItem('auth_expires_at', expiresAt.toISOString());

    const instance = new AuthTokenService();
    expect(instance.getToken()).toBe('valid-token');
  });

  it('should clear token on init if expired', () => {
    const expiredAt = new Date(Date.now() - 1000);
    localStorage.setItem('user_id', 'u1');
    localStorage.setItem('email', 'test@example.com');
    localStorage.setItem('auth_token', 'expired-token');
    localStorage.setItem('auth_expires_at', expiredAt.toISOString());

    const instance = new AuthTokenService();
    expect(instance.getToken()).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});
