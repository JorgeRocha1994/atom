import { CreateUserUseCase } from '../../../src/application/use-cases/create-user.usecase';
import { UserRepositoryPort } from '../../../src/domain/ports/user.repository.port';
import { HttpStatus } from '../../../src/shared/utils/enums';
import { hashEmail } from '../../../src/shared/utils/encrypt';
import { UserDto } from '../../../src/domain/dto/user.dto';

jest.mock('../../../src/shared/utils/encrypt', () => ({
  hashEmail: jest.fn(() => 'hash-id'),
}));

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepo: jest.Mocked<UserRepositoryPort>;

  const email = 'test@example.com';

  const mockResponse = {
    status: HttpStatus.CREATED,
    message: 'User created',
    data: {
      id: 'hash-id',
      email,
      token: 'abc123',
      expiresAt: new Date(),
      createdAt: new Date(),
    } as UserDto,
  };

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
    } as any;

    useCase = new CreateUserUseCase(mockRepo);
  });

  it('should create a user with hashed email', async () => {
    mockRepo.create.mockResolvedValueOnce(mockResponse);

    const result = await useCase.execute(email);

    expect(hashEmail).toHaveBeenCalledWith(email);
    expect(mockRepo.create).toHaveBeenCalledWith({
      id: 'hash-id',
      email,
      createdAt: expect.any(Date),
    });

    expect(result.status).toBe(HttpStatus.CREATED);
    expect(result.data?.email).toBe(email);
  });

  it('should throw if repository fails', async () => {
    mockRepo.create.mockRejectedValueOnce(new Error('Create failed'));
    await expect(useCase.execute(email)).rejects.toThrow('Create failed');
  });
});
