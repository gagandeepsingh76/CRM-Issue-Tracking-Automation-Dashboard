import { prisma } from '../config/prisma.js';

export const userService = {
  async list(query) {
    return prisma.user.findMany({
      where: {
        deletedAt: null,
        status: 'ACTIVE',
        ...(query.role ? { role: query.role } : {}),
        ...(query.search
          ? {
              OR: [
                { name: { contains: query.search, mode: 'insensitive' } },
                { email: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
      orderBy: { name: 'asc' },
    });
  },
};
