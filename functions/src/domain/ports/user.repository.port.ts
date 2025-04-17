import { User } from '../models/user.model';
import { Response } from '../models/response.model';
import { UserDto } from '../dto/user.dto';

export interface UserRepositoryPort {
  create(user: User): Promise<Response<UserDto>>;
  get(id: string): Promise<Response<UserDto>>;
}
