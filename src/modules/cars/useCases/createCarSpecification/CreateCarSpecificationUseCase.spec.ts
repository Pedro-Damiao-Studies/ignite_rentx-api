import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import { ISpecificationsRepository } from '@modules/cars/repositories/ISpecificationsRepository';
import { CreateCarSpecificationUseCase } from '@modules/cars/useCases/createCarSpecification/CreateCarSpecificationUseCase';
import { AppError } from '@shared/errors/AppError';

let specificationsRepositoryInMemory: ISpecificationsRepository;
let carsRepositoryInMemory: ICarsRepository;
let createCarSpecificationUseCase: CreateCarSpecificationUseCase;

describe('Create car specification', () => {
  beforeEach(() => {
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
  });

  it('should be able to add a new specification to a car ', async () => {
    const createdCar = await carsRepositoryInMemory.create({
      name: 'Siena',
      description: 'Carro Sedan',
      daily_rate: 90,
      license_plate: 'AAA-1A11',
      fine_amount: 20,
      brand: 'FIAT',
      category_id: '1',
    });

    const createdSpecification = await specificationsRepositoryInMemory.create({
      name: 'Sedan',
      description: 'Carro Sedan',
    });

    const car_id = createdCar.id;
    const specifications_id = [createdSpecification.id];

    const specificationsCar = await createCarSpecificationUseCase.execute({ car_id, specifications_id });

    expect(specificationsCar).toHaveProperty('specifications');

    expect(specificationsCar.specifications.length).toBe(1);

    expect(specificationsCar.specifications[0]).toBe(createdSpecification);
  });

  it('should not be able to add a new specification to a nonexistent car ', async () => {
    const car_id = '1234';
    const specifications_id = ['4321'];

    await expect(createCarSpecificationUseCase.execute({ car_id, specifications_id })).rejects.toEqual(
      new AppError('Car does not exists')
    );
  });
});
