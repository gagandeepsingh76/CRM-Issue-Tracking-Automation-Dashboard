import { randomUUID } from 'node:crypto';

import { logger } from '../config/logger.js';

export const requestLogger = (req, res, next) => {
  const startedAt = Date.now();
  req.id = randomUUID();
  res.setHeader('X-Request-Id', req.id);

  res.on('finish', () => {
    logger.debug('HTTP request completed', {
      requestId: req.id,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
};
