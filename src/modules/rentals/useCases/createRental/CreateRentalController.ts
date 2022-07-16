import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateRentalUseCase } from '@modules/rentals/useCases/createRental/CreateRentalUseCase';

class CreateRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { expected_end_date, car_id } = request.body;
    const { id: user_id } = request.user;

    const createRentalUseCase = container.resolve(CreateRentalUseCase);

    const rental = await createRentalUseCase.execute({
      car_id,
      expected_end_date,
      user_id,
    });

    return response.status(201).json(rental);
  }
}

export { CreateRentalController };
