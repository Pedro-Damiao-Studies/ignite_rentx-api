import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { CreateCarUseCase } from '@modules/cars/useCases/createCar/CreateCarUseCase';
import { AppError } from '@shared/errors/AppError';

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('Create Car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it('should be able to create a new car', async () => {
    const car = await createCarUseCase.execute({
      name: 'Name car',
      description: 'Description car',
      daily_rate: 100,
      license_plate: 'AAA1A45',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'category',
    });

    expect(car).toHaveProperty('id');
  });

  it('should not be able to create a car with already registered license plate', async () => {
    await createCarUseCase.execute({
      name: 'Car 1',
      description: 'Description car 1',
      daily_rate: 100,
      license_plate: 'AAA1A45',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'category',
    });

    await expect(
      createCarUseCase.execute({
        name: 'Car 2',
        description: 'Description car 2',
        daily_rate: 100,
        license_plate: 'AAA1A45',
        fine_amount: 60,
        brand: 'Brand',
        category_id: 'category',
      })
    ).rejects.toEqual(new AppError('Car already exists'));
  });

  it('should be able to create a car available by default', async () => {
    const car = await createCarUseCase.execute({
      name: 'Available Car',
      description: 'Description car',
      daily_rate: 100,
      license_plate: 'AAA1A45',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'category',
    });

    expect(car.available).toBe(true);
  });
});
