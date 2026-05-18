import { Router } from 'express';

import { analyticsController } from '../../controllers/analyticsController.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/authorize.js';

export const analyticsRoutes = Router();

analyticsRoutes.use(authenticate);
analyticsRoutes.use(authorizeRoles('ADMIN', 'MANAGER'));

analyticsRoutes.get('/summary', asyncHandler(analyticsController.summary));
analyticsRoutes.get('/pipeline', asyncHandler(analyticsController.pipeline));
analyticsRoutes.get('/tickets', asyncHandler(analyticsController.tickets));
