import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(128),
  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']),
  phone: z.string().trim().max(40).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1),
});
