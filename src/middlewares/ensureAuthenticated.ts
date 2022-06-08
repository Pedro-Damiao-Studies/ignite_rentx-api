import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { UsersRepository } from '../modules/accounts/repositories/implementations/UsersRepository';

interface IPayload {
  sub: string;
}

function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error('Token not provided');
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: userId } = verify(token, 'my-secret-key') as IPayload;

    const usersRepository = new UsersRepository();
    const user = usersRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }
  } catch (error) {
    throw new Error(error?.message);
  }

  return next();
}

export { ensureAuthenticated };
