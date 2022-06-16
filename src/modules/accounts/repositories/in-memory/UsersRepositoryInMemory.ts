import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { User } from '@modules/accounts/entities/User';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';

class UsersRepositoryInMemory implements IUsersRepository {
  users: User[];

  constructor() {
    this.users = [];
  }

  async create({ name, email, password, driver_license }: ICreateUserDTO): Promise<void> {
    const user = new User();

    Object.assign(user, { name, email, password, driver_license });

    this.users.push(user);
  }
  async findByEmail(email: string): Promise<User> {
    const user = this.users.find((user) => user.email === email);
    return user;
  }
  async findById(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id);
    return user;
  }
}

export { UsersRepositoryInMemory };
