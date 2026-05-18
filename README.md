# CRM Suite

Production-ready CRM SaaS dashboard with a React/Vite frontend, Express API, Prisma ORM, PostgreSQL, JWT authentication, role-based routing, analytics, notifications, and CRUD workflows for customers, leads, deals, and tickets.

## Stack

- Frontend: React 18, Vite, Tailwind CSS, Zustand, Axios, Chart.js
- Backend: Node.js, Express, Prisma, PostgreSQL, JWT, Zod
- Testing: Vitest, Testing Library, Node test runner, Supertest
- Deployment: Vercel frontend, Railway or Render backend, Neon PostgreSQL

## Local Setup

```sh
npm install
npm --prefix backend install
```

Create environment files from the examples:

```sh
copy .env.example .env
copy backend\.env.example backend\.env
```

Start PostgreSQL with Docker from the backend folder or use an existing local Postgres instance:

```sh
cd backend
docker compose up -d
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Start the apps:

```sh
npm run backend:dev
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API base: `http://localhost:5000/api/v1`
- API docs: `http://localhost:5000/api/docs`
- Health: `http://localhost:5000/health`

Demo credentials after local seed:

- `admin@crm.local` / `Password@123`
- `manager@crm.local` / `Password@123`
- `employee@crm.local` / `Password@123`

## Quality Checks

```sh
npm run lint
npm run test
npm run build
npm --prefix backend run lint
npm --prefix backend run prisma:validate
npm --prefix backend test
```

Backend integration tests require a reachable PostgreSQL database and valid `DATABASE_URL`/`DIRECT_URL`.

## Production Features

- Route-level lazy loading and Suspense fallbacks
- Production bundle chunking for React, charts, and app code
- Persisted JWT auth with auto-refresh and logout on `401`
- Dark mode with system-aware initial preference
- Dynamic page titles and meta descriptions
- Accessible skip links, modal semantics, focus states, and responsive module layouts
- Helmet, compression, rate limiting, CORS allow-list, request sanitization, request IDs, and structured error logs
- Readiness/liveness endpoints and OpenAPI documentation structure
- GitHub Actions quality gate for frontend, backend, Prisma, and integration tests

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the Vercel, Railway/Render, and Neon production flow.
