import { rename, stat, unlink } from 'fs/promises';
import { resolve } from 'path';

import upload from '@config/upload';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider';

class LocalStorageProvider implements IStorageProvider {
  async save(file: string, folder: string): Promise<string> {
    rename(resolve(upload.TMP_FOLDER, file), resolve(`${upload.TMP_FOLDER}/${folder}`, file));

    return file;
  }
  async delete(file: string, folder: string): Promise<void> {
    const filename = resolve(`${upload.TMP_FOLDER}/${folder}`, file);

    try {
      await stat(filename);
    } catch {
      return;
    }

    await unlink(filename);
  }
}

export { LocalStorageProvider };
