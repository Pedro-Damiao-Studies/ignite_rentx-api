import dayjs from 'dayjs';

import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { CreateRentalUseCase } from '@modules/rentals/useCases/createRental/CreateRentalUseCase';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { AppError } from '@shared/errors/AppError';

let rentalsRepositoryInMemory: IRentalsRepository;
let createRentalUseCase: CreateRentalUseCase;
let todayPlus24Hours: Date;
let dateProvider: IDateProvider;

describe('Create rental', () => {
  beforeEach(() => {
    dateProvider = new DayJsDateProvider();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory, dateProvider);
    todayPlus24Hours = dayjs().add(1, 'day').toDate();
  });

  it('should be able to create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: '54321',
      expected_end_date: todayPlus24Hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if there is another one open to the same user', async () => {
    await createRentalUseCase.execute({
      user_id: '12345',
      car_id: '54321',
      expected_end_date: todayPlus24Hours,
    });

    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: '54322',
        expected_end_date: todayPlus24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental if there is another one open to the same car', async () => {
    await createRentalUseCase.execute({
      user_id: '12345',
      car_id: '54321',
      expected_end_date: todayPlus24Hours,
    });

    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '12344',
        car_id: '54321',
        expected_end_date: todayPlus24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental with less than 24 hours', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '12344',
        car_id: '54321',
        expected_end_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
