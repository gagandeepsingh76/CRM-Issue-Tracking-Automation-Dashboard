import { z } from 'zod';

import { dateInput, optionalId, paginationQuerySchema } from './commonValidation.js';

export const dealStageSchema = z.enum([
  'PROSPECTING',
  'QUALIFICATION',
  'PROPOSAL',
  'NEGOTIATION',
  'WON',
  'LOST',
]);

export const listDealsQuerySchema = paginationQuerySchema.extend({
  stage: dealStageSchema.optional(),
  assignedToId: z.string().min(1).optional(),
  customerId: z.string().min(1).optional(),
});

export const createDealSchema = z.object({
  title: z.string().trim().min(2).max(180),
  value: z.coerce.number().nonnegative(),
  stage: dealStageSchema.optional(),
  probability: z.coerce.number().int().min(0).max(100).optional(),
  expectedCloseDate: dateInput,
  notes: z.string().trim().max(4000).optional(),
  customerId: z.string().min(1),
  leadId: optionalId,
  assignedToId: optionalId,
});

export const updateDealSchema = createDealSchema.partial();

export const updateDealStageSchema = z.object({
  stage: dealStageSchema,
  probability: z.coerce.number().int().min(0).max(100).optional(),
});
