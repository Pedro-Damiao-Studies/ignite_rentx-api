import { container } from 'tsyringe';
import 'dotenv/config';

import { LocalStorageProvider } from '@shared/container/providers/StorageProvider/implementations/LocalStorageProvider';
import { S3StorageProvider } from '@shared/container/providers/StorageProvider/implementations/S3StorageProvider';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider';

const diskStorage = {
  local: LocalStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>('StorageProvider', diskStorage[process.env.STORAGE_PROVIDER]);
