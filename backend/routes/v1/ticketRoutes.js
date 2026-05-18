import { Router } from 'express';

import { ticketController } from '../../controllers/ticketController.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/authorize.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { idParamSchema } from '../../validations/commonValidation.js';
import {
  createTicketSchema,
  listTicketsQuerySchema,
  updateTicketPrioritySchema,
  updateTicketSchema,
} from '../../validations/ticketValidation.js';

export const ticketRoutes = Router();

ticketRoutes.use(authenticate);

ticketRoutes.get(
  '/',
  validateRequest({ query: listTicketsQuerySchema }),
  asyncHandler(ticketController.list),
);

ticketRoutes.post(
  '/',
  authorizeRoles('ADMIN', 'MANAGER', 'EMPLOYEE'),
  validateRequest({ body: createTicketSchema }),
  asyncHandler(ticketController.create),
);

ticketRoutes.get(
  '/:id',
  validateRequest({ params: idParamSchema }),
  asyncHandler(ticketController.getById),
);

ticketRoutes.patch(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER', 'EMPLOYEE'),
  validateRequest({ params: idParamSchema, body: updateTicketSchema }),
  asyncHandler(ticketController.update),
);

ticketRoutes.patch(
  '/:id/priority',
  authorizeRoles('ADMIN', 'MANAGER', 'EMPLOYEE'),
  validateRequest({ params: idParamSchema, body: updateTicketPrioritySchema }),
  asyncHandler(ticketController.updatePriority),
);

ticketRoutes.delete(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER'),
  validateRequest({ params: idParamSchema }),
  asyncHandler(ticketController.remove),
);
