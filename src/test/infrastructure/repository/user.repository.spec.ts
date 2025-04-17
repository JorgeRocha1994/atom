import { TestBed } from '@angular/core/testing';
import { UserRepository } from '@infrastructure/repository/user.repository';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { UserToken } from '@domain/models/user.model';
import { Response } from '@domain/models/response.model';
import { HttpStatus } from '@shared/utils/enums';

describe('UserRepository', () => {
  let service: UserRepository;
  let httpClient: jest.Mocked<HttpClient>;

  const mockToken: UserToken = {
    id: '1',
    email: 'test@example.com',
    createdAt: new Date(),
    token: 'abc123',
    expiresAt: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserRepository,
        {
          provide: HttpClient,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
      ],
    });

    service = TestBed.inject(UserRepository);
    httpClient = TestBed.inject(HttpClient) as jest.Mocked<HttpClient>;
  });

  describe('signIn', () => {
    it('should return user token when response is successful', async () => {
      const res: Response<UserToken> = {
        status: HttpStatus.OK,
        data: mockToken,
        message: 'Success',
      };

      httpClient.get.mockReturnValueOnce(of(res));

      const result = await service.signIn(mockToken.email);

      expect(result).toEqual(
        expect.objectContaining({
          id: mockToken.id,
          email: mockToken.email,
          token: mockToken.token,
        })
      );

      expect(result?.expiresAt instanceof Date).toBe(true);
    });

    it('should return null when user is not found', async () => {
      httpClient.get.mockReturnValueOnce(
        throwError(() => ({ status: HttpStatus.NOT_FOUND }))
      );
      const result = await service.signIn('notfound@example.com');
      expect(result).toBeNull();
    });

    it('should throw if an unexpected error occurs', async () => {
      httpClient.get.mockReturnValueOnce(
        throwError(() => ({ error: { message: 'Unauthorized' } }))
      );
      await expect(service.signIn('bad@example.com')).rejects.toThrow(
        'Unauthorized'
      );
    });
  });

  describe('signUp', () => {
    it('should return user token when sign-up succeeds', async () => {
      const res: Response<UserToken> = {
        status: HttpStatus.OK,
        data: mockToken,
        message: 'Created',
      };

      httpClient.post.mockReturnValueOnce(of(res));
      const result = await service.signUp(mockToken.email);
      expect(result).toMatchObject({
        id: mockToken.id,
        email: mockToken.email,
        token: mockToken.token,
      });

      expect(result?.expiresAt instanceof Date).toBe(true);
    });

    it('should throw if response has no data', async () => {
      const res: Response<UserToken> = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null as any,
        message: '',
      };

      httpClient.post.mockReturnValueOnce(of(res));
      await expect(service.signUp(mockToken.email)).rejects.toThrow(
        'Failed to create user'
      );
    });

    it('should throw if sign-up request fails', async () => {
      httpClient.post.mockReturnValueOnce(
        throwError(() => ({ error: { message: 'Server error' } }))
      );
      await expect(service.signUp(mockToken.email)).rejects.toThrow(
        'Server error'
      );
    });
  });
});
