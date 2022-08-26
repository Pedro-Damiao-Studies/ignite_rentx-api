import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { AuthenticateUserUseCase } from '@modules/accounts/useCases/AuthenticateUser/AuthenticateUserUseCase';
import { CreateUserUseCase } from '@modules/accounts/useCases/CreateUser/CreateUserUseCase';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { AppError } from '@shared/errors/AppError';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: IUsersTokensRepository;
let dateProvider: IDateProvider;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate user', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayJsDateProvider();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('Should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      name: 'User Test',
      email: 'user@test.com',
      password: '123456',
      driver_license: '123456789',
    };

    await createUserUseCase.execute(user);

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(authenticatedUser).toHaveProperty('token');
  });

  it('Should not be able to authenticate an nonexistent user', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'noexistent@test.com',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate an user with invalid password', async () => {
    const user: ICreateUserDTO = {
      name: 'User Test',
      email: 'user@test.com',
      password: '123456',
      driver_license: '123456789',
    };

    await createUserUseCase.execute(user);

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: '1234567',
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
