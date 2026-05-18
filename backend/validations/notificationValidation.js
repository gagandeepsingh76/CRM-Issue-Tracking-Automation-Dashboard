import { z } from 'zod';

import { paginationQuerySchema } from './commonValidation.js';

export const notificationQuerySchema = paginationQuerySchema.extend({
  isRead: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => {
      if (value === undefined) {
        return undefined;
      }

      return value === 'true';
    }),
  type: z.enum(['INFO', 'ALERT', 'REMINDER', 'SYSTEM']).optional(),
});
