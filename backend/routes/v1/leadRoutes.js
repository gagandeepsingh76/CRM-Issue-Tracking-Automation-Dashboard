import { Router } from 'express';

import { leadController } from '../../controllers/leadController.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/authorize.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { idParamSchema } from '../../validations/commonValidation.js';
import {
  createLeadSchema,
  listLeadsQuerySchema,
  updateLeadSchema,
  updateLeadStatusSchema,
} from '../../validations/leadValidation.js';

export const leadRoutes = Router();

leadRoutes.use(authenticate);

leadRoutes.get(
  '/',
  validateRequest({ query: listLeadsQuerySchema }),
  asyncHandler(leadController.list),
);

leadRoutes.post(
  '/',
  authorizeRoles('ADMIN', 'MANAGER', 'EMPLOYEE'),
  validateRequest({ body: createLeadSchema }),
  asyncHandler(leadController.create),
);

leadRoutes.get(
  '/:id',
  validateRequest({ params: idParamSchema }),
  asyncHandler(leadController.getById),
);

leadRoutes.patch(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER', 'EMPLOYEE'),
  validateRequest({ params: idParamSchema, body: updateLeadSchema }),
  asyncHandler(leadController.update),
);

leadRoutes.patch(
  '/:id/status',
  authorizeRoles('ADMIN', 'MANAGER', 'EMPLOYEE'),
  validateRequest({ params: idParamSchema, body: updateLeadStatusSchema }),
  asyncHandler(leadController.updateStatus),
);

leadRoutes.delete(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER'),
  validateRequest({ params: idParamSchema }),
  asyncHandler(leadController.remove),
);
