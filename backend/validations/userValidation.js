import { z } from 'zod';

export const listUsersQuerySchema = z.object({
  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']).optional(),
  search: z.string().trim().optional(),
});
