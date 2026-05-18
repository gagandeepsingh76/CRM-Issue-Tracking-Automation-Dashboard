import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().min(1, 'Resource id is required.'),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().trim().optional(),
});

export const optionalId = z.string().min(1).optional().nullable();

export const dateInput = z
  .union([z.string().datetime(), z.date()])
  .optional()
  .nullable()
  .transform((value) => (value ? new Date(value) : null));
