import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { CreateRentalUseCase } from '@modules/rentals/useCases/createRental/CreateRentalUseCase';

let rentalsRepositoryInMemory: IRentalsRepository;
let createRentalUseCase: CreateRentalUseCase;

describe('Create rental', () => {
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory);
  });

  it('should be able to create a new rental', async () => {
    await createRentalUseCase.execute({
      user_id: '12345',
      car_id: '54321',
      expected_return_date: new Date(),
    });
  });
});
