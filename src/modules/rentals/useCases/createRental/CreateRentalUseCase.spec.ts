import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { CreateRentalUseCase } from '@modules/rentals/useCases/createRental/CreateRentalUseCase';
import { AppError } from '@shared/errors/AppError';

let rentalsRepositoryInMemory: IRentalsRepository;
let createRentalUseCase: CreateRentalUseCase;

describe('Create rental', () => {
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory);
  });

  it('should be able to create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: '54321',
      expected_return_date: new Date(),
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if there is another one open to the same user', async () => {
    await createRentalUseCase.execute({
      user_id: '12345',
      car_id: '54321',
      expected_return_date: new Date(),
    });

    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: '54322',
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental if there is another one open to the same car', async () => {
    await createRentalUseCase.execute({
      user_id: '12345',
      car_id: '54321',
      expected_return_date: new Date(),
    });

    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '12344',
        car_id: '54321',
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
