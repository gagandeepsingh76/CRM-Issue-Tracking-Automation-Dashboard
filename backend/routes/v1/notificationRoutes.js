import { Router } from 'express';

import { notificationController } from '../../controllers/notificationController.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { idParamSchema } from '../../validations/commonValidation.js';
import { notificationQuerySchema } from '../../validations/notificationValidation.js';

export const notificationRoutes = Router();

notificationRoutes.use(authenticate);

notificationRoutes.get(
  '/',
  validateRequest({ query: notificationQuerySchema }),
  asyncHandler(notificationController.list),
);

notificationRoutes.patch(
  '/read-all',
  asyncHandler(notificationController.markAllRead),
);

notificationRoutes.patch(
  '/:id/read',
  validateRequest({ params: idParamSchema }),
  asyncHandler(notificationController.markRead),
);
