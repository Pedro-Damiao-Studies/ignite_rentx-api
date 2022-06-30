import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

class CreateRentalUseCase {
  constructor(private rentalsRepository: IRentalsRepository) {}

  async execute({ user_id, car_id, expected_return_date }: IRequest): Promise<void> {
    const openRentalsToCar = await this.rentalsRepository.findOpenRentalsByCar(car_id);

    if (openRentalsToCar) {
      throw new AppError('Car is unavailable');
    }

    const openRentalsToUser = await this.rentalsRepository.findOpenRentalsByUser(user_id);

    if (openRentalsToUser) {
      throw new AppError('User already have an open rental');
    }
  }
}

export { CreateRentalUseCase };
