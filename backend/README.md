# CRM Backend

Production-style Node.js, Express, Prisma, and PostgreSQL API for the CRM dashboard.

## Stack

- Node.js 20+
- Express.js
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcrypt password hashing
- Zod request validation

## Setup

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Update `DATABASE_URL` in `.env` with your PostgreSQL connection string.

4. Generate Prisma Client and run the initial migration:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

5. Seed demo CRM data:

```bash
npm run prisma:seed
```

Demo users are created with password `Password@123`:

- `admin@crm.local` / `ADMIN`
- `manager@crm.local` / `MANAGER`
- `employee@crm.local` / `EMPLOYEE`

6. Start the API:

```bash
npm run dev
```

Health check:

```text
GET http://localhost:5000/health
```

## API Base

```text
/api/v1
```

## Auth Flow

1. `POST /api/v1/auth/register` creates an employee account, hashes the password with bcrypt, and returns a JWT.
2. `POST /api/v1/auth/login` verifies credentials and returns a JWT.
3. Protected routes require `Authorization: Bearer <token>`.
4. `authenticate` verifies the JWT, loads the active user, and attaches `req.user`.
5. `authorizeRoles` checks route-level permissions for admin, manager, and employee access.

## Main Endpoints

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### Customers

- `GET /api/v1/customers`
- `POST /api/v1/customers`
- `GET /api/v1/customers/:id`
- `PATCH /api/v1/customers/:id`
- `DELETE /api/v1/customers/:id`

### Leads

- `GET /api/v1/leads`
- `POST /api/v1/leads`
- `GET /api/v1/leads/:id`
- `PATCH /api/v1/leads/:id`
- `PATCH /api/v1/leads/:id/status`
- `DELETE /api/v1/leads/:id`

### Deals

- `GET /api/v1/deals`
- `GET /api/v1/deals/pipeline`
- `POST /api/v1/deals`
- `GET /api/v1/deals/:id`
- `PATCH /api/v1/deals/:id`
- `PATCH /api/v1/deals/:id/stage`
- `DELETE /api/v1/deals/:id`

### Tickets

- `GET /api/v1/tickets`
- `POST /api/v1/tickets`
- `GET /api/v1/tickets/:id`
- `PATCH /api/v1/tickets/:id`
- `PATCH /api/v1/tickets/:id/priority`
- `DELETE /api/v1/tickets/:id`

### Analytics

- `GET /api/v1/analytics/summary`
- `GET /api/v1/analytics/pipeline`
- `GET /api/v1/analytics/tickets`

## Response Format

Success:

```json
{
  "success": true,
  "message": "Customers loaded successfully.",
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 20,
    "totalPages": 0
  }
}
```

Error:

```json
{
  "success": false,
  "message": "Request validation failed.",
  "errors": []
}
```

## Frontend Integration Plan

The current frontend mock auth remains untouched. In the next phase, the frontend can switch service-by-service by pointing Axios to `VITE_API_BASE_URL=http://localhost:5000/api/v1`, then replacing mock auth/data calls with these REST endpoints.
