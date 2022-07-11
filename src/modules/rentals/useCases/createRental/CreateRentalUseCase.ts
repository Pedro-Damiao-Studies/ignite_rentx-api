import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

class CreateRentalUseCase {
  constructor(private rentalsRepository: IRentalsRepository) {}

  async execute({ user_id, car_id, expected_return_date }: IRequest): Promise<Rental> {
    const openRentalsToCar = await this.rentalsRepository.findOpenRentalsByCar(car_id);

    if (openRentalsToCar) {
      throw new AppError('Car is unavailable');
    }

    const openRentalsToUser = await this.rentalsRepository.findOpenRentalsByUser(user_id);

    if (openRentalsToUser) {
      throw new AppError('User already have an open rental');
    }

    const rental = this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    return rental;
  }
}

export { CreateRentalUseCase };
