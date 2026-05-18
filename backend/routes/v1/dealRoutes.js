import { Router } from 'express';

import { dealController } from '../../controllers/dealController.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/authorize.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { idParamSchema } from '../../validations/commonValidation.js';
import {
  createDealSchema,
  listDealsQuerySchema,
  updateDealSchema,
  updateDealStageSchema,
} from '../../validations/dealValidation.js';

export const dealRoutes = Router();

dealRoutes.use(authenticate);

dealRoutes.get(
  '/',
  validateRequest({ query: listDealsQuerySchema }),
  asyncHandler(dealController.list),
);

dealRoutes.get('/pipeline', asyncHandler(dealController.pipeline));

dealRoutes.post(
  '/',
  authorizeRoles('ADMIN', 'MANAGER', 'EMPLOYEE'),
  validateRequest({ body: createDealSchema }),
  asyncHandler(dealController.create),
);

dealRoutes.get(
  '/:id',
  validateRequest({ params: idParamSchema }),
  asyncHandler(dealController.getById),
);

dealRoutes.patch(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER', 'EMPLOYEE'),
  validateRequest({ params: idParamSchema, body: updateDealSchema }),
  asyncHandler(dealController.update),
);

dealRoutes.patch(
  '/:id/stage',
  authorizeRoles('ADMIN', 'MANAGER', 'EMPLOYEE'),
  validateRequest({ params: idParamSchema, body: updateDealStageSchema }),
  asyncHandler(dealController.updateStage),
);

dealRoutes.delete(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER'),
  validateRequest({ params: idParamSchema }),
  asyncHandler(dealController.remove),
);
