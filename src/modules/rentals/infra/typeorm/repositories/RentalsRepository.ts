import { getRepository, Repository } from 'typeorm';

import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async findOpenRentalsByCar(car_id: string): Promise<Rental> {
    return this.repository.findOne({ car_id });
  }
  async findOpenRentalsByUser(user_id: string): Promise<Rental> {
    return this.repository.findOne({ user_id });
  }
  async create({ car_id, expected_end_date, user_id }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      car_id,
      expected_end_date,
      user_id,
    });

    this.repository.save(rental);

    return rental;
  }

  findById(id: string): Promise<Rental> {
    return this.repository.findOne(id);
  }
}

export { RentalsRepository };
