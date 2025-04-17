import { UserToken } from '@domain/models/user.model';

export interface UserServicePort {
  signIn(email: string): Promise<UserToken | null>;
  signUp(email: string): Promise<UserToken | null>;
}
