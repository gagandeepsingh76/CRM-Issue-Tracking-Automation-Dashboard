import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { getPagination, getPaginationMeta } from '../utils/pagination.js';

const buildWhere = (userId, query) => ({
  userId,
  deletedAt: null,
  ...(query.isRead === undefined ? {} : { isRead: query.isRead }),
  ...(query.type ? { type: query.type } : {}),
});

export const notificationService = {
  async list(userId, query) {
    const { page, limit, skip, take } = getPagination(query);
    const where = buildWhere(userId, query);

    const [items, total, unread] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId, deletedAt: null, isRead: false },
      }),
    ]);

    return {
      items,
      meta: {
        ...getPaginationMeta(total, page, limit),
        unread,
      },
    };
  },

  async markRead(userId, id) {
    const notification = await prisma.notification.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!notification) {
      throw new ApiError(404, 'Notification was not found.');
    }

    return prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  },

  async markAllRead(userId) {
    const result = await prisma.notification.updateMany({
      where: { userId, deletedAt: null, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { updated: result.count };
  },
};
