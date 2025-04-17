import { GetUserUseCase } from '../../../src/application/use-cases/get-user.usecase';
import { UserRepositoryPort } from '../../../src/domain/ports/user.repository.port';
import { HttpStatus } from '../../../src/shared/utils/enums';
import { hashEmail } from '../../../src/shared/utils/encrypt';
import { UserDto } from '../../../src/domain/dto/user.dto';

jest.mock('../../../src/shared/utils/encrypt', () => ({
  hashEmail: jest.fn(() => 'hash-user-id'),
}));

describe('GetUserUseCase', () => {
  let useCase: GetUserUseCase;
  let mockRepo: jest.Mocked<UserRepositoryPort>;

  const mockResponse = {
    status: HttpStatus.OK,
    message: 'User found',
    data: {
      id: '1',
      email: 'test@example.com',
      token: 'token123',
      createdAt: new Date(),
      expiresAt: new Date(),
    } as UserDto,
  };

  beforeEach(() => {
    mockRepo = {
      get: jest.fn(),
    } as any;

    useCase = new GetUserUseCase(mockRepo);
  });

  it('should retrieve user by hashed email', async () => {
    mockRepo.get.mockResolvedValueOnce(mockResponse);

    const result = await useCase.execute('test@example.com');

    expect(hashEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockRepo.get).toHaveBeenCalledWith('hash-user-id');
    expect(result).toEqual(mockResponse);
  });

  it('should throw if repository throws', async () => {
    mockRepo.get.mockRejectedValueOnce(new Error('Get failed'));
    await expect(useCase.execute('fail@example.com')).rejects.toThrow('Get failed');
  });
});
