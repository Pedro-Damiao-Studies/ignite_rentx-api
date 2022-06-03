import { parse } from 'csv-parse';
import { Express } from 'express';
import fs from 'fs';

class ImportCategoriesUseCase {
  execute(file: Express.Multer.File) {
    const stream = fs.createReadStream(file.path);

    const parseFile = parse();

    stream.pipe(parseFile);

    parseFile.on('data', async (data) => {
      console.log(data);
    });
  }
}

export { ImportCategoriesUseCase };
