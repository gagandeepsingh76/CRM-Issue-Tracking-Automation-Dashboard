import { prisma } from '../config/prisma.js';

const groupCount = async (model, by, where = {}) => {
  const rows = await prisma[model].groupBy({
    by: [by],
    where,
    _count: { _all: true },
  });

  return rows.map((row) => ({
    label: row[by],
    count: row._count._all,
  }));
};

export const analyticsService = {
  async dashboardSummary() {
    const [
      totalUsers,
      activeCustomers,
      openLeads,
      wonDeals,
      openTickets,
      revenue,
      leadStatuses,
      dealStages,
      ticketPriorities,
      recentActivities,
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.customer.count({ where: { deletedAt: null, status: 'ACTIVE' } }),
      prisma.lead.count({
        where: { deletedAt: null, status: { in: ['NEW', 'CONTACTED', 'QUALIFIED'] } },
      }),
      prisma.deal.count({ where: { deletedAt: null, stage: 'WON' } }),
      prisma.ticket.count({
        where: { deletedAt: null, status: { in: ['OPEN', 'IN_PROGRESS'] } },
      }),
      prisma.deal.aggregate({
        where: { deletedAt: null, stage: 'WON' },
        _sum: { value: true },
      }),
      groupCount('lead', 'status', { deletedAt: null }),
      groupCount('deal', 'stage', { deletedAt: null }),
      groupCount('ticket', 'priority', { deletedAt: null }),
      prisma.activity.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 8,
        select: {
          id: true,
          type: true,
          title: true,
          dueDate: true,
          completedAt: true,
          createdAt: true,
          assignedTo: {
            select: { id: true, name: true },
          },
        },
      }),
    ]);

    return {
      metrics: {
        totalUsers,
        activeCustomers,
        openLeads,
        wonDeals,
        openTickets,
        wonRevenue: revenue._sum.value ?? 0,
      },
      leadStatuses,
      dealStages,
      ticketPriorities,
      recentActivities,
    };
  },

  async pipelineSummary() {
    const rows = await prisma.deal.groupBy({
      by: ['stage'],
      where: { deletedAt: null },
      _count: { _all: true },
      _sum: { value: true },
      _avg: { probability: true },
    });

    return rows.map((row) => ({
      stage: row.stage,
      count: row._count._all,
      value: row._sum.value ?? 0,
      averageProbability: row._avg.probability ?? 0,
    }));
  },

  async ticketSummary() {
    const [byStatus, byPriority] = await Promise.all([
      groupCount('ticket', 'status', { deletedAt: null }),
      groupCount('ticket', 'priority', { deletedAt: null }),
    ]);

    return { byStatus, byPriority };
  },
};
