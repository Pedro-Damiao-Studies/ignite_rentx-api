import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import { CreateUserController } from '@modules/accounts/useCases/CreateUser/CreateUserController';
import { UpdateUserAvatarController } from '@modules/accounts/useCases/UpdateUserAvatar/UpdateUserAvatarController';
import { ensureAdmin } from '@shared/infra/http/middlewares/ensureAdmin';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';

const usersRoutes = Router();

const uploadAvatar = multer(uploadConfig);

const createUserController = new CreateUserController();
const updateUserAvatarController = new UpdateUserAvatarController();

usersRoutes.post('/', ensureAuthenticated, ensureAdmin, createUserController.handle);

usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  ensureAdmin,
  uploadAvatar.single('avatar'),
  updateUserAvatarController.handle
);

export { usersRoutes };
