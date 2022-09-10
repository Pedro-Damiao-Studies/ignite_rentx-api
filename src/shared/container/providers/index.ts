import { container } from 'tsyringe';

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { IMailProvider } from '@shared/container/providers/MailProvider/IEmailProvider';
import { EtherealMailProvider } from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';

container.registerSingleton<IMailProvider>('MailProvider', EtherealMailProvider);

container.registerSingleton<IDateProvider>('DateProvider', DayJsDateProvider);
