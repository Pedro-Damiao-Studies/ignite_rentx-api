import { Request, Response } from 'express';

import { ImportCategoriesUseCase } from './ImportCategoriesUseCase';

class ImportCategoriesController {
  private importCategoriesUseCase: ImportCategoriesUseCase;

  constructor(importCategoriesUseCase: ImportCategoriesUseCase) {
    this.importCategoriesUseCase = importCategoriesUseCase;
  }

  async handle(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    await this.importCategoriesUseCase.execute(file);

    return response.send();
  }
}

export { ImportCategoriesController };
