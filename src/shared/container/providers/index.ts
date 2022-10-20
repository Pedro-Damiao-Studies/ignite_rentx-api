import { container } from 'tsyringe';

import 'dotenv/config';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { IMailProvider } from '@shared/container/providers/MailProvider/IEmailProvider';
import { EtherealMailProvider } from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';
import { LocalStorageProvider } from '@shared/container/providers/StorageProvider/implementations/LocalStorageProvider';
import { S3StorageProvider } from '@shared/container/providers/StorageProvider/implementations/S3StorageProvider';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider';

container.registerSingleton<IMailProvider>('MailProvider', EtherealMailProvider);

container.registerSingleton<IDateProvider>('DateProvider', DayJsDateProvider);

const diskStorage = {
  local: LocalStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>('StorageProvider', diskStorage[process.env.DISK]);
