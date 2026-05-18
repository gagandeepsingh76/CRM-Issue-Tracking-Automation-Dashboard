import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { removeUndefined } from '../utils/cleanData.js';
import { getPagination, getPaginationMeta } from '../utils/pagination.js';

const customerInclude = {
  assignedTo: {
    select: { id: true, name: true, email: true, role: true },
  },
  createdBy: {
    select: { id: true, name: true, email: true, role: true },
  },
  _count: {
    select: { leads: true, deals: true, tickets: true },
  },
};

const buildWhere = (query) => ({
  deletedAt: null,
  ...(query.status ? { status: query.status } : {}),
  ...(query.assignedToId ? { assignedToId: query.assignedToId } : {}),
  ...(query.search
    ? {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { email: { contains: query.search, mode: 'insensitive' } },
          { company: { contains: query.search, mode: 'insensitive' } },
          { industry: { contains: query.search, mode: 'insensitive' } },
        ],
      }
    : {}),
});

export const customerService = {
  async list(query) {
    const { page, limit, skip, take } = getPagination(query);
    const where = buildWhere(query);

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: customerInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      items,
      meta: getPaginationMeta(total, page, limit),
    };
  },

  async create(payload, actor) {
    return prisma.customer.create({
      data: removeUndefined({
        ...payload,
        assignedToId: payload.assignedToId ?? actor.id,
        createdById: actor.id,
      }),
      include: customerInclude,
    });
  },

  async getById(id) {
    const customer = await prisma.customer.findFirst({
      where: { id, deletedAt: null },
      include: customerInclude,
    });

    if (!customer) {
      throw new ApiError(404, 'Customer was not found.');
    }

    return customer;
  },

  async update(id, payload) {
    await this.getById(id);

    return prisma.customer.update({
      where: { id },
      data: removeUndefined(payload),
      include: customerInclude,
    });
  },

  async remove(id) {
    await this.getById(id);

    return prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
      include: customerInclude,
    });
  },
};
