import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { AppError } from '@shared/errors/AppError';

dayjs.extend(utc);

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

class CreateRentalUseCase {
  constructor(private rentalsRepository: IRentalsRepository) {}

  async execute({ user_id, car_id, expected_return_date }: IRequest): Promise<Rental> {
    const MIN_RENTAL_TIME = 24;

    const openRentalsToCar = await this.rentalsRepository.findOpenRentalsByCar(car_id);

    if (openRentalsToCar) {
      throw new AppError('Car is unavailable');
    }

    const openRentalsToUser = await this.rentalsRepository.findOpenRentalsByUser(user_id);

    if (openRentalsToUser) {
      throw new AppError('User already have an open rental');
    }

    const expectedReturnDateFormatted = dayjs(expected_return_date).utc().local().format();
    const dateNow = dayjs().utc().local().format();

    const compare = dayjs(expectedReturnDateFormatted).diff(dateNow, 'hours');

    if (compare < MIN_RENTAL_TIME) {
      console.log('ops:', compare);
      throw new AppError('Invalid expected return time');
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
