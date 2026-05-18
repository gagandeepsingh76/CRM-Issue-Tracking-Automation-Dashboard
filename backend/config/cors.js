import cors from 'cors';

import { env } from './env.js';

const normalizeOrigin = (origin) => origin?.replace(/\/$/, '');

const allowedOrigins = new Set(env.corsOrigins.map(normalizeOrigin));
const allowAnyOrigin = allowedOrigins.has('*');

export const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowAnyOrigin || allowedOrigins.has(normalizeOrigin(origin))) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true,
  maxAge: 86400,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const corsMiddleware = cors(corsOptions);
