import { FirestoreUserRepository } from '../../../src/infrastructure/firestore/user.firestore.repository';
import { HttpStatus } from '../../../src/shared/utils/enums';
import { User } from '../../../src/domain/models/user.model';

jest.mock('../../../src/shared/utils/jwt', () => ({
  generateToken: jest.fn(() => 'token123'),
}));

jest.mock('../../../src/shared/utils/environment', () => ({
  getEnvironment: jest.fn(() => 'test'),
  getJwtExpiresAt: jest.fn(() => 60),
}));

describe('FirestoreUserRepository', () => {
  let repo: FirestoreUserRepository;
  let firestoreMock: any;
  let docMock: any;

  const user: User = {
    id: '1',
    email: 'test@example.com',
    createdAt: new Date(),
  };

  beforeEach(() => {
    docMock = {
      get: jest.fn(),
      set: jest.fn(),
    };

    firestoreMock = {
      collection: jest.fn(() => ({
        doc: jest.fn(() => docMock),
      })),
    };

    repo = new FirestoreUserRepository(firestoreMock);
  });

  describe('get()', () => {
    it('should return user with token if found', async () => {
      docMock.get.mockResolvedValueOnce({
        exists: true,
        data: () => user,
      });

      const response = await repo.get(user.id);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.data?.token).toBe('token123');
      expect(response.data?.email).toBe(user.email);
    });

    it('should return NOT_FOUND if user does not exist', async () => {
      docMock.get.mockResolvedValueOnce({ exists: false });

      const response = await repo.get('notfound');

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.message).toBe('User not found');
    });

    it('should return error if user data is null', async () => {
      docMock.get.mockResolvedValueOnce({ exists: true, data: () => null });

      const response = await repo.get('invalid');

      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.message).toBe('User data is null');
    });

    it('should return error if get throws', async () => {
      docMock.get.mockRejectedValueOnce(new Error('Firestore error'));

      const response = await repo.get('1');

      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.message).toBe('Error fetching user');
      expect(response.error).toBe('Firestore error');
    });
  });

  describe('create()', () => {
    it('should create a new user if not exists', async () => {
      docMock.get.mockResolvedValueOnce({ exists: false });

      const response = await repo.create(user);

      expect(docMock.set).toHaveBeenCalledWith(user);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.data?.token).toBe('token123');
    });

    it('should return existing user if already exists', async () => {
      docMock.get.mockResolvedValueOnce({
        exists: true,
        data: () => user,
      });

      const response = await repo.create(user);

      expect(docMock.set).not.toHaveBeenCalled();
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.data?.email).toBe(user.email);
    });

    it('should return error if create throws', async () => {
      docMock.get.mockRejectedValueOnce(new Error('Create error'));

      const response = await repo.create(user);

      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.message).toBe('Error creating user');
      expect(response.error).toBe('Create error');
    });
  });
});
