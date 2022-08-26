import dayjs from 'dayjs';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { CreateRentalUseCase } from '@modules/rentals/useCases/createRental/CreateRentalUseCase';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { AppError } from '@shared/errors/AppError';

let rentalsRepositoryInMemory: IRentalsRepository;
let carsRepositoryInMemory: ICarsRepository;
let createRentalUseCase: CreateRentalUseCase;
let todayPlus24Hours: Date;
let dateProvider: IDateProvider;

describe('Create rental', () => {
  beforeEach(() => {
    dateProvider = new DayJsDateProvider();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dateProvider,
      carsRepositoryInMemory
    );
    todayPlus24Hours = dayjs().add(1, 'day').toDate();
  });

  it('should be able to create a new rental', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car Test',
      description: 'Car for testing',
      daily_rate: 100,
      license_plate: 'BAE 1234',
      fine_amount: 10,
      brand: '1234',
      category_id: '1235',
    });

    const rental = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: car.id,
      expected_end_date: todayPlus24Hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if there is another one open to the same user', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car Test',
      description: 'Car for testing',
      daily_rate: 100,
      license_plate: 'BAE 1234',
      fine_amount: 10,
      brand: '1234',
      category_id: '1235',
    });

    await createRentalUseCase.execute({
      user_id: '12345',
      car_id: car.id,
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
    const car = await carsRepositoryInMemory.create({
      name: 'Car Test',
      description: 'Car for testing',
      daily_rate: 100,
      license_plate: 'BAE 1234',
      fine_amount: 10,
      brand: '1234',
      category_id: '1235',
    });

    await createRentalUseCase.execute({
      user_id: '12345',
      car_id: car.id,
      expected_end_date: todayPlus24Hours,
    });

    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '12344',
        car_id: car.id,
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
