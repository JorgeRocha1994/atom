import { Provider } from '@angular/core';
import { SignInUserUseCase } from '@application/use-cases/sign-in-user.usecase';
import { SignUpUserUseCase } from '@application/use-cases/sign-up-user.usecase';
import { UserRepository } from '@infrastructure/repository/user.repository';

export const UserProviders: Provider[] = [
  {
    provide: SignInUserUseCase,
    useFactory: (repo: UserRepository) => new SignInUserUseCase(repo),
    deps: [UserRepository],
  },
  {
    provide: SignUpUserUseCase,
    useFactory: (repo: UserRepository) => new SignUpUserUseCase(repo),
    deps: [UserRepository],
  },
  UserRepository,
];
