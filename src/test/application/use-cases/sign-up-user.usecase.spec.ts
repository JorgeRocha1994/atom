import { SignUpUserUseCase } from '@application/use-cases/sign-up-user.usecase';
import { UserServicePort } from '@domain/services/user.service.port';
import { UserToken } from '@domain/models/user.model';

describe('SignUpUserUseCase', () => {
  const mockUser: UserToken = {
    id: '1',
    email: 'test@example.com',
    token: 'abc123',
    createdAt: new Date(),
    expiresAt: new Date(),
  };

  const mockAuthService: UserServicePort = {
    signUp: jest.fn(),
  } as any;

  let useCase: SignUpUserUseCase;

  beforeEach(() => {
    useCase = new SignUpUserUseCase(mockAuthService);
  });

  it('should return a user token when sign up succeeds', async () => {
    (mockAuthService.signUp as jest.Mock).mockResolvedValueOnce(mockUser);
    const result = await useCase.execute('test@example.com');
    expect(mockAuthService.signUp).toHaveBeenCalledWith('test@example.com');
    expect(result).toEqual(mockUser);
  });

  it('should return null when sign up fails', async () => {
    (mockAuthService.signUp as jest.Mock).mockResolvedValueOnce(null);
    const result = await useCase.execute('fail@example.com');
    expect(result).toBeNull();
  });

  it('should throw if sign up throws an error', async () => {
    (mockAuthService.signUp as jest.Mock).mockRejectedValueOnce(
      new Error('Failed')
    );
    await expect(useCase.execute('error@example.com')).rejects.toThrow(
      'Failed'
    );
  });
});
