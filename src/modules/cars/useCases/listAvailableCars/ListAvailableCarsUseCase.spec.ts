import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { ListCarsUseCase } from '@modules/cars/useCases/listAvailableCars/ListAvailableCarsUseCase';

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listCarsUseCase: ListCarsUseCase;

describe('List Cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listCarsUseCase = new ListCarsUseCase(carsRepositoryInMemory);
  });

  it('should be able to list all available cars', async () => {
    const createdCar = await carsRepositoryInMemory.create({
      name: 'Siena',
      description: 'Carro Sedan',
      daily_rate: 90,
      license_plate: 'AAA-1A11',
      fine_amount: 20,
      brand: 'FIAT',
      category_id: '1',
    });

    const cars = await listCarsUseCase.execute({});

    expect(cars).toEqual([createdCar]);
  });

  it('should be able to list all available cars by name', async () => {
    await carsRepositoryInMemory.create({
      name: 'Siena',
      description: 'Carro Sedan',
      daily_rate: 90,
      license_plate: 'AAA-1A11',
      fine_amount: 20,
      brand: 'FIAT',
      category_id: '1',
    });

    const secondCar = await carsRepositoryInMemory.create({
      name: 'Palio',
      description: 'Carro Hatch',
      daily_rate: 70,
      license_plate: 'BBB-1B11',
      fine_amount: 18,
      brand: 'FIAT',
      category_id: '2',
    });

    const cars = await listCarsUseCase.execute({ name: 'Palio' });

    expect(cars).toEqual([secondCar]);
  });

  it('should be able to list all available cars by brand', async () => {
    await carsRepositoryInMemory.create({
      name: 'Siena',
      description: 'Carro Sedan',
      daily_rate: 90,
      license_plate: 'AAA-1A11',
      fine_amount: 20,
      brand: 'FIAT',
      category_id: '1',
    });

    const secondCar = await carsRepositoryInMemory.create({
      name: 'A8',
      description: 'Carro Sedan',
      daily_rate: 170,
      license_plate: 'BBB-1B11',
      fine_amount: 80,
      brand: 'Audi',
      category_id: '1',
    });

    const cars = await listCarsUseCase.execute({ brand: 'Audi' });

    expect(cars).toEqual([secondCar]);
  });

  it('should be able to list all available cars by category id', async () => {
    await carsRepositoryInMemory.create({
      name: 'Siena',
      description: 'Carro Sedan',
      daily_rate: 90,
      license_plate: 'AAA-1A11',
      fine_amount: 20,
      brand: 'FIAT',
      category_id: '1',
    });

    const secondCar = await carsRepositoryInMemory.create({
      name: 'Palio',
      description: 'Carro Hatch',
      daily_rate: 70,
      license_plate: 'BBB-1B11',
      fine_amount: 18,
      brand: 'FIAT',
      category_id: '2',
    });

    const cars = await listCarsUseCase.execute({ category_id: '2' });

    expect(cars).toEqual([secondCar]);
  });
});
