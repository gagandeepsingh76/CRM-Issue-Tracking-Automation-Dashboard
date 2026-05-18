import { Router } from 'express';

import { analyticsRoutes } from './analyticsRoutes.js';
import { authRoutes } from './authRoutes.js';
import { customerRoutes } from './customerRoutes.js';
import { dealRoutes } from './dealRoutes.js';
import { healthController } from '../../controllers/healthController.js';
import { leadRoutes } from './leadRoutes.js';
import { notificationRoutes } from './notificationRoutes.js';
import { ticketRoutes } from './ticketRoutes.js';
import { userRoutes } from './userRoutes.js';

export const v1Routes = Router();

v1Routes.get('/health', healthController.apiHealth);
v1Routes.use('/auth', authRoutes);
v1Routes.use('/customers', customerRoutes);
v1Routes.use('/leads', leadRoutes);
v1Routes.use('/deals', dealRoutes);
v1Routes.use('/tickets', ticketRoutes);
v1Routes.use('/analytics', analyticsRoutes);
v1Routes.use('/notifications', notificationRoutes);
v1Routes.use('/users', userRoutes);
