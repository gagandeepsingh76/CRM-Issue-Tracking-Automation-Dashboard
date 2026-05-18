import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const password = await bcrypt.hash('Password@123', 12);

const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

const resetData = async () => {
  await prisma.notification.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
};

const seedUsers = async () => {
  const admin = await prisma.user.create({
    data: {
      name: 'Avery Admin',
      email: 'admin@crm.local',
      password,
      role: 'ADMIN',
      phone: '+1-202-555-0100',
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: 'Maya Manager',
      email: 'manager@crm.local',
      password,
      role: 'MANAGER',
      phone: '+1-202-555-0110',
    },
  });

  const employee = await prisma.user.create({
    data: {
      name: 'Ethan Employee',
      email: 'employee@crm.local',
      password,
      role: 'EMPLOYEE',
      phone: '+1-202-555-0120',
    },
  });

  return { admin, manager, employee };
};

const main = async () => {
  await resetData();

  const { admin, manager, employee } = await seedUsers();

  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Northstar Retail Group',
        email: 'ops@northstar.example',
        phone: '+1-415-555-0182',
        company: 'Northstar Retail Group',
        industry: 'Retail',
        website: 'https://northstar.example',
        source: 'Referral',
        annualValue: 125000,
        assignedToId: manager.id,
        createdById: admin.id,
        notes: 'Enterprise retail account expanding support operations.',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'BluePeak Logistics',
        email: 'hello@bluepeak.example',
        phone: '+1-312-555-0194',
        company: 'BluePeak Logistics',
        industry: 'Logistics',
        website: 'https://bluepeak.example',
        source: 'Website',
        annualValue: 84000,
        assignedToId: employee.id,
        createdById: manager.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'BrightPath Health',
        email: 'it@brightpath.example',
        phone: '+1-617-555-0173',
        company: 'BrightPath Health',
        industry: 'Healthcare',
        source: 'Conference',
        annualValue: 210000,
        assignedToId: manager.id,
        createdById: admin.id,
      },
    }),
  ]);

  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        firstName: 'Sophia',
        lastName: 'Reed',
        email: 'sophia.reed@apex.example',
        phone: '+1-646-555-0132',
        company: 'Apex Analytics',
        source: 'LinkedIn',
        status: 'QUALIFIED',
        score: 82,
        estimatedValue: 48000,
        assignedToId: employee.id,
        createdById: manager.id,
        notes: 'Interested in analytics dashboard rollout for a 25-person team.',
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Daniel',
        lastName: 'Cho',
        email: 'daniel.cho@orbit.example',
        company: 'Orbit Systems',
        source: 'Product Demo',
        status: 'CONTACTED',
        score: 64,
        estimatedValue: 32000,
        assignedToId: manager.id,
        createdById: admin.id,
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Priya',
        lastName: 'Nair',
        email: 'priya.nair@northstar.example',
        company: 'Northstar Retail Group',
        source: 'Existing Customer',
        status: 'CONVERTED',
        score: 91,
        estimatedValue: 76000,
        convertedAt: daysFromNow(-12),
        customerId: customers[0].id,
        assignedToId: manager.id,
        createdById: admin.id,
      },
    }),
  ]);

  const deals = await Promise.all([
    prisma.deal.create({
      data: {
        title: 'Northstar Support Automation',
        value: 76000,
        stage: 'NEGOTIATION',
        probability: 75,
        expectedCloseDate: daysFromNow(21),
        customerId: customers[0].id,
        leadId: leads[2].id,
        assignedToId: manager.id,
        createdById: admin.id,
      },
    }),
    prisma.deal.create({
      data: {
        title: 'BluePeak CRM Modernization',
        value: 54000,
        stage: 'PROPOSAL',
        probability: 55,
        expectedCloseDate: daysFromNow(35),
        customerId: customers[1].id,
        assignedToId: employee.id,
        createdById: manager.id,
      },
    }),
    prisma.deal.create({
      data: {
        title: 'BrightPath Compliance Workspace',
        value: 118000,
        stage: 'WON',
        probability: 100,
        expectedCloseDate: daysFromNow(-6),
        closedAt: daysFromNow(-4),
        customerId: customers[2].id,
        assignedToId: manager.id,
        createdById: admin.id,
      },
    }),
  ]);

  const tickets = await Promise.all([
    prisma.ticket.create({
      data: {
        subject: 'Dashboard export timing out',
        description: 'CSV export fails for reports with more than 10k rows.',
        status: 'OPEN',
        priority: 'HIGH',
        requesterName: 'Priya Nair',
        requesterEmail: 'priya.nair@northstar.example',
        customerId: customers[0].id,
        assignedToId: employee.id,
        createdById: manager.id,
      },
    }),
    prisma.ticket.create({
      data: {
        subject: 'Invoice contact update',
        description: 'Billing contact changed for Q3 invoices.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        requesterName: 'Jordan Miles',
        requesterEmail: 'finance@bluepeak.example',
        customerId: customers[1].id,
        assignedToId: employee.id,
        createdById: manager.id,
      },
    }),
    prisma.ticket.create({
      data: {
        subject: 'SSO rollout confirmation',
        description: 'Confirm final SSO settings before go-live.',
        status: 'RESOLVED',
        priority: 'LOW',
        requesterName: 'Elena Brooks',
        requesterEmail: 'it@brightpath.example',
        customerId: customers[2].id,
        assignedToId: manager.id,
        createdById: admin.id,
      },
    }),
  ]);

  await Promise.all([
    prisma.activity.create({
      data: {
        type: 'MEETING',
        title: 'Northstar renewal negotiation',
        description: 'Review procurement questions and contract timeline.',
        dueDate: daysFromNow(3),
        customerId: customers[0].id,
        dealId: deals[0].id,
        assignedToId: manager.id,
        createdById: admin.id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'CALL',
        title: 'Follow up with Apex Analytics',
        dueDate: daysFromNow(2),
        leadId: leads[0].id,
        assignedToId: employee.id,
        createdById: manager.id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'TASK',
        title: 'Investigate export timeout',
        description: 'Review ticket logs and confirm reproducible case.',
        ticketId: tickets[0].id,
        assignedToId: employee.id,
        createdById: manager.id,
      },
    }),
  ]);

  await Promise.all([
    prisma.notification.create({
      data: {
        title: 'New high-priority ticket',
        message: 'Northstar Retail Group opened a high-priority export issue.',
        type: 'ALERT',
        userId: employee.id,
      },
    }),
    prisma.notification.create({
      data: {
        title: 'Deal moved to negotiation',
        message: 'Northstar Support Automation is now in negotiation.',
        type: 'INFO',
        userId: manager.id,
      },
    }),
    prisma.notification.create({
      data: {
        title: 'Seed data ready',
        message: 'Admin, manager, and employee demo accounts were created.',
        type: 'SYSTEM',
        userId: admin.id,
      },
    }),
  ]);

  console.log('Seed complete. Demo password for all users: Password@123');
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
