import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { inject, injectable } from 'tsyringe';

import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

dayjs.extend(utc);

interface IRequest {
  user_id: string;
  car_id: string;
  expected_end_date: Date;
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute({ user_id, car_id, expected_end_date }: IRequest): Promise<Rental> {
    const MIN_RENTAL_TIME = 24;

    const openRentalsToCar = await this.rentalsRepository.findOpenRentalsByCar(car_id);

    if (openRentalsToCar) {
      throw new AppError('Car is unavailable');
    }

    const openRentalsToUser = await this.rentalsRepository.findOpenRentalsByUser(user_id);

    if (openRentalsToUser) {
      throw new AppError('User already have an open rental');
    }

    const compare = this.dateProvider.compareInHours(this.dateProvider.dateNow(), expected_end_date);

    if (compare < MIN_RENTAL_TIME) {
      throw new AppError('Invalid expected return time');
    }

    const rental = this.rentalsRepository.create({
      user_id,
      car_id,
      expected_end_date,
    });

    return rental;
  }
}

export { CreateRentalUseCase };
