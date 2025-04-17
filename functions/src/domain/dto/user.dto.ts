import { User } from '../models/user.model';

export interface UserDto extends User {
  token: string;
  expiresAt: Date;
}
