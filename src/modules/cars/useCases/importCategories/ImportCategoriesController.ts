import { Request, Response } from 'express';

import { ImportCategoriesUseCase } from './ImportCategoriesUseCase';

class ImportCategoriesController {
  private importCategoriesUseCase: ImportCategoriesUseCase;

  constructor(importCategoriesUseCase: ImportCategoriesUseCase) {
    this.importCategoriesUseCase = importCategoriesUseCase;
  }

  handle(request: Request, response: Response) {
    const { file } = request;
    console.log(file);

    this.importCategoriesUseCase.execute(file);

    return response.send();
  }
}

export { ImportCategoriesController };
