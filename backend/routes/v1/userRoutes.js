import { Router } from 'express';

import { userController } from '../../controllers/userController.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { listUsersQuerySchema } from '../../validations/userValidation.js';

export const userRoutes = Router();

userRoutes.use(authenticate);

userRoutes.get(
  '/',
  validateRequest({ query: listUsersQuerySchema }),
  asyncHandler(userController.list),
);
