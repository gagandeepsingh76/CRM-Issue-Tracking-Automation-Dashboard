import assert from 'node:assert/strict';
import test from 'node:test';

import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ??=
  'postgresql://postgres:postgres@localhost:5432/crm_dashboard?schema=public';
process.env.DIRECT_URL ??= process.env.DATABASE_URL;
process.env.JWT_SECRET ??= 'test-secret-change-before-production';
process.env.CORS_ORIGIN ??= 'http://localhost:5173';
process.env.LOG_LEVEL ??= 'error';

const prisma = new PrismaClient();
const password = 'Password@123';
const testEmail = `api.integration.${Date.now()}@example.com`;
let app;
let token;
let customerId;
let leadId;
let dealId;
let ticketId;

test.before(async () => {
  ({ app } = await import('../src/app.js'));

  await prisma.user.upsert({
    where: { email: testEmail },
    update: {
      password: await bcrypt.hash(password, 4),
      role: 'ADMIN',
      status: 'ACTIVE',
      deletedAt: null,
    },
    create: {
      name: 'API Integration Admin',
      email: testEmail,
      password: await bcrypt.hash(password, 4),
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
});

test.after(async () => {
  await prisma.ticket.deleteMany({ where: { id: ticketId } });
  await prisma.deal.deleteMany({ where: { id: dealId } });
  await prisma.lead.deleteMany({ where: { id: leadId } });
  await prisma.customer.deleteMany({ where: { id: customerId } });
  await prisma.user.deleteMany({ where: { email: testEmail } });
  await prisma.$disconnect();
});

test('authenticates and returns a profile', async () => {
  const login = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: testEmail, password })
    .expect(200);

  assert.equal(login.body.success, true);
  assert.equal(login.body.data.user.email, testEmail);
  assert.ok(login.body.data.token);
  token = login.body.data.token;

  const profile = await request(app)
    .get('/api/v1/auth/me')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  assert.equal(profile.body.data.role, 'ADMIN');
});

test('rejects invalid credentials', async () => {
  await request(app)
    .post('/api/v1/auth/login')
    .send({ email: testEmail, password: 'wrong-password' })
    .expect(401);
});

test('supports core CRM CRUD and workflow endpoints', async () => {
  const customer = await request(app)
    .post('/api/v1/customers')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Integration Customer',
      email: `customer.${testEmail}`,
      company: 'Integration Co',
      annualValue: 10000,
    })
    .expect(201);

  customerId = customer.body.data.id;
  assert.equal(customer.body.data.name, 'Integration Customer');

  const customerList = await request(app)
    .get('/api/v1/customers')
    .query({ search: 'Integration Customer' })
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  assert.ok(customerList.body.data.length >= 1);

  const lead = await request(app)
    .post('/api/v1/leads')
    .set('Authorization', `Bearer ${token}`)
    .send({
      firstName: 'Integration',
      lastName: 'Lead',
      email: `lead.${testEmail}`,
      company: 'Integration Co',
      customerId,
    })
    .expect(201);

  leadId = lead.body.data.id;

  const leadStatus = await request(app)
    .patch(`/api/v1/leads/${leadId}/status`)
    .set('Authorization', `Bearer ${token}`)
    .send({ status: 'CONTACTED' })
    .expect(200);

  assert.equal(leadStatus.body.data.status, 'CONTACTED');

  const deal = await request(app)
    .post('/api/v1/deals')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Integration Deal',
      value: 25000,
      customerId,
      leadId,
    })
    .expect(201);

  dealId = deal.body.data.id;

  const dealStage = await request(app)
    .patch(`/api/v1/deals/${dealId}/stage`)
    .set('Authorization', `Bearer ${token}`)
    .send({ stage: 'PROPOSAL', probability: 50 })
    .expect(200);

  assert.equal(dealStage.body.data.stage, 'PROPOSAL');

  const ticket = await request(app)
    .post('/api/v1/tickets')
    .set('Authorization', `Bearer ${token}`)
    .send({
      subject: 'Integration Ticket',
      description: 'Smoke-test ticket.',
      customerId,
    })
    .expect(201);

  ticketId = ticket.body.data.id;

  const ticketPriority = await request(app)
    .patch(`/api/v1/tickets/${ticketId}/priority`)
    .set('Authorization', `Bearer ${token}`)
    .send({ priority: 'HIGH' })
    .expect(200);

  assert.equal(ticketPriority.body.data.priority, 'HIGH');

  await request(app)
    .get('/api/v1/analytics/summary')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
});
