import { z } from 'zod';

import { optionalId, paginationQuerySchema } from './commonValidation.js';

export const ticketStatusSchema = z.enum([
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
]);

export const prioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

export const listTicketsQuerySchema = paginationQuerySchema.extend({
  status: ticketStatusSchema.optional(),
  priority: prioritySchema.optional(),
  assignedToId: z.string().min(1).optional(),
  customerId: z.string().min(1).optional(),
});

export const createTicketSchema = z.object({
  subject: z.string().trim().min(2).max(180),
  description: z.string().trim().min(2).max(5000),
  status: ticketStatusSchema.optional(),
  priority: prioritySchema.optional(),
  requesterName: z.string().trim().max(120).optional(),
  requesterEmail: z.string().trim().email().toLowerCase().optional(),
  customerId: optionalId,
  assignedToId: optionalId,
});

export const updateTicketSchema = createTicketSchema.partial();

export const updateTicketPrioritySchema = z.object({
  priority: prioritySchema,
});
