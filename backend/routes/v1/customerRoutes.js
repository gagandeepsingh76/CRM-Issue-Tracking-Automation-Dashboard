import { Router } from 'express';

import { customerController } from '../../controllers/customerController.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/authorize.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { idParamSchema } from '../../validations/commonValidation.js';
import {
  createCustomerSchema,
  listCustomersQuerySchema,
  updateCustomerSchema,
} from '../../validations/customerValidation.js';

export const customerRoutes = Router();

customerRoutes.use(authenticate);

customerRoutes.get(
  '/',
  validateRequest({ query: listCustomersQuerySchema }),
  asyncHandler(customerController.list),
);

customerRoutes.post(
  '/',
  authorizeRoles('ADMIN', 'MANAGER', 'EMPLOYEE'),
  validateRequest({ body: createCustomerSchema }),
  asyncHandler(customerController.create),
);

customerRoutes.get(
  '/:id',
  validateRequest({ params: idParamSchema }),
  asyncHandler(customerController.getById),
);

customerRoutes.patch(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER', 'EMPLOYEE'),
  validateRequest({ params: idParamSchema, body: updateCustomerSchema }),
  asyncHandler(customerController.update),
);

customerRoutes.delete(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER'),
  validateRequest({ params: idParamSchema }),
  asyncHandler(customerController.remove),
);
