import { SignInUserUseCase } from '@application/use-cases/sign-in-user.usecase';
import { UserServicePort } from '@domain/services/user.service.port';
import { UserToken } from '@domain/models/user.model';

describe('SignInUserUseCase', () => {
  const mockUser: UserToken = {
    id: '1',
    email: 'test@example.com',
    token: 'abc123',
    createdAt: new Date(),
    expiresAt: new Date(),
  };

  const mockAuthService: UserServicePort = {
    signIn: jest.fn(),
  } as any;

  let useCase: SignInUserUseCase;

  beforeEach(() => {
    useCase = new SignInUserUseCase(mockAuthService);
  });

  it('should return a user token when sign in succeeds', async () => {
    (mockAuthService.signIn as jest.Mock).mockResolvedValueOnce(mockUser);
    const result = await useCase.execute('test@example.com');
    expect(mockAuthService.signIn).toHaveBeenCalledWith('test@example.com');
    expect(result).toEqual(mockUser);
  });

  it('should return null when sign in fails', async () => {
    (mockAuthService.signIn as jest.Mock).mockResolvedValueOnce(null);
    const result = await useCase.execute('fail@example.com');
    expect(result).toBeNull();
  });

  it('should throw if sign in throws an error', async () => {
    (mockAuthService.signIn as jest.Mock).mockRejectedValueOnce(
      new Error('Sign in failed')
    );
    await expect(useCase.execute('error@example.com')).rejects.toThrow(
      'Sign in failed'
    );
  });
});
