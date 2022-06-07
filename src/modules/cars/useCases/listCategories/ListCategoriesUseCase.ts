import { Category } from '../../entities/Category';
import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';

class ListCategoriesUseCase {
  private categoriesRepository: ICategoriesRepository;

  constructor(categoryRepository: ICategoriesRepository) {
    this.categoriesRepository = categoryRepository;
  }

  async execute(): Promise<Category[]> {
    const categories = await this.categoriesRepository.list();

    return categories;
  }
}

export { ListCategoriesUseCase };
