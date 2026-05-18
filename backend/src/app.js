import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { corsMiddleware } from '../config/cors.js';
import { env } from '../config/env.js';
import { apiRoutes } from '../routes/index.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { notFoundHandler } from '../middleware/notFoundHandler.js';
import { requestLogger } from '../middleware/requestLogger.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const app = express();

app.disable('x-powered-by');

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(requestLogger);

app.get('/health', (req, res) => {
  sendSuccess(res, {
    service: 'crm-dashboard-backend',
    status: 'healthy',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
