import { randomBytes } from 'crypto';
import multer from 'multer';
import { resolve } from 'path';

const TMP_FOLDER = resolve(__dirname, '..', '..', 'tmp');

export default {
  TMP_FOLDER,
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename: (request, file, callback) => {
      const fileHash = randomBytes(16).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;
      return callback(null, fileName);
    },
  }),
};
