import { prisma } from '../config/prisma.js';

export const healthService = {
  live() {
    return {
      service: 'crm-dashboard-backend',
      status: 'healthy',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  },

  async ready() {
    await prisma.$queryRaw`SELECT 1`;

    return {
      ...this.live(),
      dependencies: {
        database: 'ready',
      },
    };
  },
};
