import { User } from '../../domain/models/user.model';
import { UserDto } from '../../domain/dto/user.dto';
import { Response } from '../../domain/models/response.model';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { hashEmail } from '../../shared/utils/encrypt';

export class CreateUserUseCase {
  constructor(private readonly taskRepo: UserRepositoryPort) {}

  async execute(email: string): Promise<Response<UserDto>> {
    const userData: User = {
      id: hashEmail(email),
      email,
      createdAt: new Date(),
    };

    return await this.taskRepo.create(userData);
  }
}
