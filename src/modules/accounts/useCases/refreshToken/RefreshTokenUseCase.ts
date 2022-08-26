import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('DateProvider')
    private dateProvider: IDateProvider,
    @inject('UsersTokensRepository')
    private usersTokenRepository: IUsersTokensRepository
  ) {}

  async execute(token: string): Promise<ITokenResponse> {
    const { sub: user_id, email: user_email } = verify(token, auth.secret_refresh_token) as IPayload;

    const userToken = await this.usersTokenRepository.findByUserIdAndRefreshToken(user_id, token);

    if (!userToken) {
      throw new AppError('Refresh Token does not exists!');
    }

    await this.usersTokenRepository.deleteById(userToken.id);

    const refresh_token = sign({ email: user_email }, auth.secret_refresh_token, {
      subject: user_id,
      expiresIn: auth.expires_in_refresh_token,
    });

    const expires_date = this.dateProvider.addDays(auth.expires_in_refresh_token_days);

    await this.usersTokenRepository.create({
      user_id,
      expires_date,
      refresh_token,
    });

    const newToken = sign({}, auth.secret_token, {
      subject: user_id,
      expiresIn: auth.expires_in_token,
    });

    return {
      token: newToken,
      refresh_token,
    };
  }
}

export { RefreshTokenUseCase };
