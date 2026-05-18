# CRM Suite Production Deployment

This repository is production-ready for a split deployment:

- Frontend: Vercel static Vite app
- Backend: Railway or Render Node.js web service
- Database: Neon PostgreSQL

## Environment Matrix

Frontend production variables:

```sh
VITE_API_BASE_URL=https://your-backend-production-url.example.com/api/v1
VITE_APP_NAME="CRM Suite"
```

Backend production variables:

```sh
NODE_ENV=production
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@HOST-pooler.REGION.aws.neon.tech/DB?sslmode=require&schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@HOST.REGION.aws.neon.tech/DB?sslmode=require&schema=public"
JWT_SECRET="replace-with-at-least-32-random-bytes"
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
CORS_ORIGIN=https://your-frontend.vercel.app
TRUST_PROXY=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=300
LOG_LEVEL=info
```

Use the Neon pooled connection for `DATABASE_URL` and the direct connection for `DIRECT_URL` so application traffic and Prisma migrations use the right connection path.

## Frontend: Vercel

1. Import the GitHub repository into Vercel.
2. Use the Vite preset.
3. Keep these configured values from `vercel.json`:
   - Install command: `npm ci`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add the frontend environment variables above in Vercel Project Settings.
5. Deploy. The SPA rewrite in `vercel.json` keeps protected route deep links working.

## Backend: Railway

1. Create a Railway project from the same GitHub repository.
2. Use the root `railway.toml` config.
3. Add the backend production variables above.
4. Provision Neon separately, then set `DATABASE_URL` and `DIRECT_URL`.
5. Deploy. Railway will run Prisma generation at build time and migrations before app start.

## Backend Alternative: Render

Use `render.yaml` as the infrastructure blueprint. Set the same backend production variables in Render, keeping secrets marked as synced false.

## Database: Neon PostgreSQL

1. Create a Neon project and production branch.
2. Copy the pooled connection string into `DATABASE_URL`.
3. Copy the direct connection string into `DIRECT_URL`.
4. Run migrations through the backend deployment start command or manually:

```sh
npm --prefix backend run prisma:deploy
```

## Production Seed Strategy

Production seeding is opt-in and only creates or updates the first admin account. It never resets CRM data.

```sh
ALLOW_PRODUCTION_SEED=true \
SEED_ADMIN_EMAIL=admin@your-domain.example \
SEED_ADMIN_PASSWORD="temporary-strong-password" \
npm --prefix backend run prisma:seed:prod
```

Rotate the seeded admin password after first login.

## Health and API Docs

- Liveness: `GET /live`
- Readiness and DB check: `GET /health` or `GET /ready`
- API docs JSON: `GET /api/docs`
- Versioned API: `/api/v1`

## CI/CD

GitHub Actions runs:

- Frontend `npm ci`, lint, Vitest smoke tests, production build
- Backend `npm ci`, Prisma generate/validate/deploy, lint, API integration tests against Postgres

Required GitHub secrets are only needed if you later add deploy jobs. The current workflow is a quality gate and does not deploy automatically.

## Local Production Smoke Test

```sh
npm ci
npm --prefix backend ci
npm --prefix backend run prisma:deploy
npm --prefix backend run prisma:seed
npm run build
npm --prefix backend start
npm run preview:prod
```

Then verify:

- Frontend opens at the Vite preview URL.
- Backend health returns `healthy`.
- Login works with `admin@crm.local` / `Password@123` for local seeded data.
