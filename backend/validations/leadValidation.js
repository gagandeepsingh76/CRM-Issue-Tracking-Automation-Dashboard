import { z } from 'zod';

import { optionalId, paginationQuerySchema } from './commonValidation.js';

export const leadStatusSchema = z.enum([
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'CONVERTED',
  'LOST',
]);

export const listLeadsQuerySchema = paginationQuerySchema.extend({
  status: leadStatusSchema.optional(),
  assignedToId: z.string().min(1).optional(),
  customerId: z.string().min(1).optional(),
});

export const createLeadSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().toLowerCase().optional(),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(160).optional(),
  source: z.string().trim().max(120).optional(),
  status: leadStatusSchema.optional(),
  score: z.coerce.number().int().min(0).max(100).optional(),
  estimatedValue: z.coerce.number().nonnegative().optional(),
  notes: z.string().trim().max(4000).optional(),
  customerId: optionalId,
  assignedToId: optionalId,
});

export const updateLeadSchema = createLeadSchema.partial();

export const updateLeadStatusSchema = z.object({
  status: leadStatusSchema,
});
