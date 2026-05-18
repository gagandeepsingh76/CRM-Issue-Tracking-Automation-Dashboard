import rateLimit from 'express-rate-limit';

import { env } from '../config/env.js';

export const apiRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.rateLimitMax,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: (req) => ['/health', '/live', '/ready'].includes(req.path),
  message: {
    success: false,
    message: 'Too many requests. Please retry shortly.',
  },
});
