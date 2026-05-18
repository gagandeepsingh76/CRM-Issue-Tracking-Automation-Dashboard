import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';

import { corsMiddleware } from '../config/cors.js';
import { env } from '../config/env.js';
import { healthController } from '../controllers/healthController.js';
import { apiRoutes } from '../routes/index.js';
import { apiRateLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { notFoundHandler } from '../middleware/notFoundHandler.js';
import { requestLogger } from '../middleware/requestLogger.js';
import { sanitizeRequest } from '../middleware/requestSanitizer.js';

export const app = express();

app.disable('x-powered-by');
app.set('trust proxy', env.trustProxy);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);
app.use(compression());
app.use(corsMiddleware);
if (env.nodeEnv !== 'test') {
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
}
app.use(requestLogger);
app.use(apiRateLimiter);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeRequest);

app.get('/health', asyncHandler(healthController.ready));
app.get('/ready', asyncHandler(healthController.ready));
app.get('/live', healthController.live);

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
