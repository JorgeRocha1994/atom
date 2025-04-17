import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { Firestore } from 'firebase-admin/firestore';
import { User } from '../../domain/models/user.model';
import { UserDto } from '../../domain/dto/user.dto';
import { Response } from '../../domain/models/response.model';
import { HttpStatus } from '../../shared/utils/enums';
import { generateToken } from '../../shared/utils/jwt';
import { getEnvironment, getJwtExpiresAt } from '../../shared/utils/environment';

export class FirestoreUserRepository implements UserRepositoryPort {
  private readonly collection;
  private readonly environment: string;
  private readonly expiresInMinutes: number;

  constructor(firestore: Firestore) {
    this.environment = getEnvironment();
    this.expiresInMinutes = getJwtExpiresAt();
    this.collection = firestore.collection(`${this.environment}_users`);
  }

  private generateToken(id: string, email: string): { token: string; expiresAt: Date } {
    const token = generateToken({ id, email });
    const expiresAt = new Date(Date.now() + this.expiresInMinutes * 60 * 1000);
    return { token, expiresAt };
  }

  async get(id: string): Promise<Response<UserDto>> {
    try {
      const doc = await this.collection.doc(id).get();

      if (!doc.exists) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'User not found',
        };
      }

      const data = doc.data();
      if (!data) {
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'User data is null',
        };
      }

      const { token, expiresAt } = this.generateToken(data.id, data.email);

      return {
        status: HttpStatus.OK,
        message: 'User found',
        data: { ...data, token, expiresAt: expiresAt } as UserDto,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error fetching user',
        error: error.message,
      };
    }
  }

  async create(user: User): Promise<Response<UserDto>> {
    try {
      const docRef = this.collection.doc(user.id);
      const doc = await docRef.get();

      const { token, expiresAt } = this.generateToken(user.id, user.email);

      if (doc.exists) {
        return {
          status: HttpStatus.OK,
          message: 'User obtained successfully',
          data: {
            ...doc.data(),
            token,
            expiresAt,
          } as UserDto,
        };
      }

      await docRef.set(user);
      return {
        status: HttpStatus.CREATED,
        message: 'User created successfully',
        data: { ...user, token, expiresAt: expiresAt },
      };
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error creating user',
        error: error.message,
      };
    }
  }
}
