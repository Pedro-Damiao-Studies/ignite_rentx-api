import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SendForgotPasswordMailUseCase } from '@modules/accounts/useCases/SendForgotPasswordMail/SendForgotPasswordMailUseCase';

class SendForgotPasswordMailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPasswordMailUseCase = container.resolve(SendForgotPasswordMailUseCase);

    await sendForgotPasswordMailUseCase.execute(email);

    return response.status(201).send();
  }
}

export { SendForgotPasswordMailController };
