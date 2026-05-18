import { app } from './app.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { prisma } from '../config/prisma.js';

const server = app.listen(env.port, () => {
  logger.info(`API server running on port ${env.port}`);
  logger.info(`Health check: http://localhost:${env.port}/health`);
});

const shutdown = async (signal) => {
  logger.info(`${signal} received. Closing API server...`);

  server.close(async () => {
    await prisma.$disconnect();
    logger.info('API server closed cleanly.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
