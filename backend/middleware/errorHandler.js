import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const mapPrismaError = (error) => {
  if (error.code === 'P2002') {
    return {
      statusCode: 409,
      message: `Unique constraint failed for ${error.meta?.target?.join(', ') ?? 'resource'}.`,
    };
  }

  if (error.code === 'P2025') {
    return {
      statusCode: 404,
      message: 'Requested resource was not found.',
    };
  }

  return {
    statusCode: 500,
    message: 'Database request failed.',
  };
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  let statusCode = error.statusCode ?? 500;
  let message = error.message ?? 'Internal server error';
  let details = error.details ?? null;

  if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Request validation failed.';
    details = error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = mapPrismaError(error);
    statusCode = mapped.statusCode;
    message = mapped.message;
  }

  logger.error(message, {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    details,
    stack: env.nodeEnv === 'production' ? undefined : error.stack,
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { errors: details } : {}),
    ...(env.nodeEnv === 'production' ? {} : { stack: error.stack }),
  });
};
