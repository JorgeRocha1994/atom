import request from 'supertest';
import express, { Express } from 'express';
import { userRouter } from '../../../src/interface/routes/user.router';
import { FirestoreUserRepository } from '../../../src/infrastructure/firestore/user.firestore.repository';
import { HttpStatus } from '../../../src/shared/utils/enums';

jest.mock('../../../src/infrastructure/firestore/user.firestore.repository');

jest.mock('../../../src/shared/utils/encrypt', () => ({
  hashEmail: jest.fn(() => 'hash-user-id'),
}));

describe('userRouter', () => {
  let app: Express;
  let createUserMock: jest.Mock;
  let getUserMock: jest.Mock;

  beforeEach(() => {
    createUserMock = jest.fn();
    getUserMock = jest.fn();

    (FirestoreUserRepository as jest.Mock).mockImplementation(() => ({
      create: createUserMock,
      get: getUserMock,
    }));

    app = express();
    app.use(express.json());
    app.use('/users', userRouter({} as any));
  });

  describe('GET /users', () => {
    it('should return user if found', async () => {
      getUserMock.mockResolvedValueOnce({
        status: HttpStatus.OK,
        data: { email: 'test@example.com' },
      });

      const res = await request(app).get('/users').query({ email: 'test@example.com' });

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body.data.email).toBe('test@example.com');
    });

    it('should return 400 if email is missing', async () => {
      const res = await request(app).get('/users');
      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body.error).toBe('Email is required');
    });

    it('should return 500 if an error occurs', async () => {
      getUserMock.mockRejectedValueOnce(new Error('DB error'));
      const res = await request(app).get('/users').query({ email: 'fail@example.com' });
      expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.error).toBe('Failed to get user');
    });
  });

  describe('POST /users', () => {
    it('should create user successfully', async () => {
      createUserMock.mockResolvedValueOnce({
        status: HttpStatus.OK,
        data: { email: 'test@example.com' },
      });

      const res = await request(app).post('/users').send({ email: 'test@example.com' });
      expect(createUserMock).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com' })
      );
      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body.data.email).toBe('test@example.com');
    });

    it('should return 400 if email is missing', async () => {
      const res = await request(app).post('/users').send({});
      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body.error).toBe('Email is required');
    });

    it('should return 500 if creation fails', async () => {
      createUserMock.mockRejectedValueOnce(new Error('DB error'));
      const res = await request(app).post('/users').send({ email: 'fail@example.com' });
      expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.error).toBe('Failed to create user');
    });
  });
});
