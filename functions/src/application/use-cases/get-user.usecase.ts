import { Response } from '../../domain/models/response.model';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { hashEmail } from '../../shared/utils/encrypt';
import { UserDto } from '../../domain/dto/user.dto';

export class GetUserUseCase {
  constructor(private readonly taskRepo: UserRepositoryPort) {}

  async execute(email: string): Promise<Response<UserDto>> {
    const userId = hashEmail(email);
    return await this.taskRepo.get(userId);
  }
}
