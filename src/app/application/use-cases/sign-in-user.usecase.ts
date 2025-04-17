import { UserServicePort } from '@domain/services/user.service.port';
import { UserToken } from '@domain/models/user.model';

export class SignInUserUseCase {
  constructor(private readonly authService: UserServicePort) {}

  async execute(email: string): Promise<UserToken | null> {
    return await this.authService.signIn(email);
  }
}
