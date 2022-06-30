import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';

interface IRentalsRepository {
  findOpenRentalsByCar(car_id: string): Promise<Rental>;
  findOpenRentalsByUser(user_id: string): Promise<Rental>;
}

export { IRentalsRepository };
