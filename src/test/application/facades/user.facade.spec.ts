import { TestBed } from '@angular/core/testing';
import { UserUseFacade } from '@application/facades/user.facade';
import { SignInUserUseCase } from '@application/use-cases/sign-in-user.usecase';
import { SignUpUserUseCase } from '@application/use-cases/sign-up-user.usecase';
import { UserToken } from '@domain/models/user.model';
import { reloadPage } from '@shared/utils/navigation';

jest.mock('@shared/utils/navigation', () => ({
  reloadPage: jest.fn(),
}));

describe('UserUseFacade', () => {
  let facade: UserUseFacade;
  let mockSignIn: jest.Mocked<SignInUserUseCase>;
  let mockSignUp: jest.Mocked<SignUpUserUseCase>;

  const mockUser: UserToken = {
    id: '1',
    email: 'test@example.com',
    token: 'abc123',
    createdAt: new Date(),
    expiresAt: new Date(),
  };

  beforeEach(() => {
    mockSignIn = {
      execute: jest.fn(),
    } as any;

    mockSignUp = {
      execute: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        UserUseFacade,
        { provide: SignInUserUseCase, useValue: mockSignIn },
        { provide: SignUpUserUseCase, useValue: mockSignUp },
      ],
    });

    facade = TestBed.inject(UserUseFacade);
  });

  it('should create a user through signUp use case', async () => {
    mockSignUp.execute.mockResolvedValueOnce(mockUser);
    const result = await facade.create('test@example.com');
    expect(mockSignUp.execute).toHaveBeenCalledWith('test@example.com');
    expect(result).toEqual(mockUser);
  });

  it('should return null if signUp returns null', async () => {
    mockSignUp.execute.mockResolvedValueOnce(null);
    const result = await facade.create('fail@example.com');
    expect(result).toBeNull();
  });

  it('should retrieve a user through signIn use case', async () => {
    mockSignIn.execute.mockResolvedValueOnce(mockUser);
    const result = await facade.get('test@example.com');
    expect(mockSignIn.execute).toHaveBeenCalledWith('test@example.com');
    expect(result).toEqual(mockUser);
  });

  it('should return null if signIn returns null', async () => {
    mockSignIn.execute.mockResolvedValueOnce(null);
    const result = await facade.get('notfound@example.com');
    expect(result).toBeNull();
  });
});
