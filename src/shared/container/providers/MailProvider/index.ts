import { container } from 'tsyringe';
import 'dotenv/config';

import { IMailProvider } from '@shared/container/providers/MailProvider/IEmailProvider';
import { EtherealMailProvider } from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';
import { SESMailProvider } from '@shared/container/providers/MailProvider/implementations/SESMailProvider';

const mailProvider = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>('MailProvider', mailProvider[process.env.MAIL_PROVIDER]);
