import { Router } from 'express';

import { authenticateRoutes } from '@routes/authenticate.routes';
import { categoriesRoutes } from '@routes/categories.routes';
import { specificationsRoutes } from '@routes/specification.routes';
import { usersRoutes } from '@routes/user.routes';

const router = Router();

router.use('/categories', categoriesRoutes);
router.use('/specifications', specificationsRoutes);
router.use('/users', usersRoutes);
router.use('/sessions', authenticateRoutes);

export { router };
