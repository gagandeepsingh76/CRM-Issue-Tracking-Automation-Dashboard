import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const requiredCorsOrigins = [
  'https://crm-issue-tracking-automation-dashb.vercel.app',
];

const splitList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const uniqueList = (items) => [...new Set(items)];

const configuredCorsOrigins = splitList(process.env.CORS_ORIGIN);

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: toNumber(process.env.PORT, 5000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret:
    process.env.JWT_SECRET ??
    'local-development-secret-change-before-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  bcryptSaltRounds: toNumber(process.env.BCRYPT_SALT_ROUNDS, 12),
  corsOrigins: uniqueList([...requiredCorsOrigins, ...configuredCorsOrigins]),
  trustProxy: process.env.TRUST_PROXY === 'true',
  rateLimitWindowMs: toNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  rateLimitMax: toNumber(process.env.RATE_LIMIT_MAX, 300),
  logLevel: process.env.LOG_LEVEL ?? 'info',
});

if (env.nodeEnv === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required in production.');
}

if (env.nodeEnv === 'production' && !env.databaseUrl) {
  throw new Error('DATABASE_URL is required in production.');
}
