import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { SendForgotPasswordMailUseCase } from '@modules/accounts/useCases/SendForgotPasswordMail/SendForgotPasswordMailUseCase';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { IMailProvider } from '@shared/container/providers/MailProvider/IEmailProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '@shared/errors/AppError';

describe('Send Forgot Mail', () => {
  let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
  let usersRepository: IUsersRepository;
  let usersTokensRepository: IUsersTokensRepository;
  let dateProvider: IDateProvider;
  let mailProvider: IMailProvider;

  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    usersTokensRepository = new UsersTokensRepositoryInMemory();
    dateProvider = new DayJsDateProvider();
    mailProvider = new MailProviderInMemory();

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepository,
      usersTokensRepository,
      dateProvider,
      mailProvider
    );
  });

  it('should be able to send a forgot password mail to user', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    await usersRepository.create({
      driver_license: '000123',
      email: 'test@email.com',
      name: 'Test',
      password: '1234',
    });

    await sendForgotPasswordMailUseCase.execute('test@email.com');

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send an email if user does not exists', async () => {
    await expect(sendForgotPasswordMailUseCase.execute('test@email.com')).rejects.toEqual(
      new AppError('User does not exists')
    );
  });

  it('should be able to create an users token', async () => {
    const generateTokenMail = jest.spyOn(usersTokensRepository, 'create');

    await usersRepository.create({
      driver_license: '000123',
      email: 'test@email.com',
      name: 'Test',
      password: '1234',
    });

    await sendForgotPasswordMailUseCase.execute('test@email.com');

    expect(generateTokenMail).toHaveBeenCalled();
  });
});
