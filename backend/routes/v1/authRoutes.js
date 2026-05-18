import { Router } from 'express';

import { authController } from '../../controllers/authController.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { loginSchema, registerSchema } from '../../validations/authValidation.js';

export const authRoutes = Router();

authRoutes.post(
  '/register',
  validateRequest({ body: registerSchema }),
  asyncHandler(authController.register),
);

authRoutes.post(
  '/login',
  validateRequest({ body: loginSchema }),
  asyncHandler(authController.login),
);

authRoutes.get('/me', authenticate, asyncHandler(authController.me));
