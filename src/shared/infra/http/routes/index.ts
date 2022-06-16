import { Router } from 'express';

import { authenticateRoutes } from '@shared/infra/http/routes/authenticate.routes';
import { categoriesRoutes } from '@shared/infra/http/routes/categories.routes';
import { specificationsRoutes } from '@shared/infra/http/routes/specification.routes';
import { usersRoutes } from '@shared/infra/http/routes/user.routes';

const router = Router();

router.use('/categories', categoriesRoutes);
router.use('/specifications', specificationsRoutes);
router.use('/users', usersRoutes);
router.use('/sessions', authenticateRoutes);

export { router };
