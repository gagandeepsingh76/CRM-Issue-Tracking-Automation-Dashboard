import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { removeUndefined } from '../utils/cleanData.js';
import { getPagination, getPaginationMeta } from '../utils/pagination.js';

const ticketInclude = {
  customer: {
    select: { id: true, name: true, company: true, email: true },
  },
  assignedTo: {
    select: { id: true, name: true, email: true, role: true },
  },
  createdBy: {
    select: { id: true, name: true, email: true, role: true },
  },
};

const buildWhere = (query) => ({
  deletedAt: null,
  ...(query.status ? { status: query.status } : {}),
  ...(query.priority ? { priority: query.priority } : {}),
  ...(query.assignedToId ? { assignedToId: query.assignedToId } : {}),
  ...(query.customerId ? { customerId: query.customerId } : {}),
  ...(query.search
    ? {
        OR: [
          { subject: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
          { requesterName: { contains: query.search, mode: 'insensitive' } },
          { requesterEmail: { contains: query.search, mode: 'insensitive' } },
        ],
      }
    : {}),
});

export const ticketService = {
  async list(query) {
    const { page, limit, skip, take } = getPagination(query);
    const where = buildWhere(query);

    const [items, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: ticketInclude,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        skip,
        take,
      }),
      prisma.ticket.count({ where }),
    ]);

    return {
      items,
      meta: getPaginationMeta(total, page, limit),
    };
  },

  async create(payload, actor) {
    return prisma.ticket.create({
      data: removeUndefined({
        ...payload,
        assignedToId: payload.assignedToId ?? actor.id,
        createdById: actor.id,
      }),
      include: ticketInclude,
    });
  },

  async getById(id) {
    const ticket = await prisma.ticket.findFirst({
      where: { id, deletedAt: null },
      include: ticketInclude,
    });

    if (!ticket) {
      throw new ApiError(404, 'Ticket was not found.');
    }

    return ticket;
  },

  async update(id, payload) {
    await this.getById(id);

    return prisma.ticket.update({
      where: { id },
      data: removeUndefined(payload),
      include: ticketInclude,
    });
  },

  async updatePriority(id, priority) {
    await this.getById(id);

    return prisma.ticket.update({
      where: { id },
      data: { priority },
      include: ticketInclude,
    });
  },

  async remove(id) {
    await this.getById(id);

    return prisma.ticket.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'CLOSED' },
      include: ticketInclude,
    });
  },
};
