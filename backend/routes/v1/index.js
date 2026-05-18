import { Router } from 'express';

import { analyticsRoutes } from './analyticsRoutes.js';
import { authRoutes } from './authRoutes.js';
import { customerRoutes } from './customerRoutes.js';
import { dealRoutes } from './dealRoutes.js';
import { leadRoutes } from './leadRoutes.js';
import { ticketRoutes } from './ticketRoutes.js';

export const v1Routes = Router();

v1Routes.use('/auth', authRoutes);
v1Routes.use('/customers', customerRoutes);
v1Routes.use('/leads', leadRoutes);
v1Routes.use('/deals', dealRoutes);
v1Routes.use('/tickets', ticketRoutes);
v1Routes.use('/analytics', analyticsRoutes);
