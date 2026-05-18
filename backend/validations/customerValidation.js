import { z } from 'zod';

import { optionalId, paginationQuerySchema } from './commonValidation.js';

export const customerStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']);

export const listCustomersQuerySchema = paginationQuerySchema.extend({
  status: customerStatusSchema.optional(),
  assignedToId: z.string().min(1).optional(),
});

export const createCustomerSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().toLowerCase().optional(),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(160).optional(),
  industry: z.string().trim().max(120).optional(),
  website: z.string().trim().url().optional(),
  source: z.string().trim().max(120).optional(),
  status: customerStatusSchema.optional(),
  annualValue: z.coerce.number().nonnegative().optional(),
  notes: z.string().trim().max(4000).optional(),
  assignedToId: optionalId,
});

export const updateCustomerSchema = createCustomerSchema.partial();
