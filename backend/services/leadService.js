import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { removeUndefined } from '../utils/cleanData.js';
import { getPagination, getPaginationMeta } from '../utils/pagination.js';

const leadInclude = {
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
  ...(query.assignedToId ? { assignedToId: query.assignedToId } : {}),
  ...(query.customerId ? { customerId: query.customerId } : {}),
  ...(query.search
    ? {
        OR: [
          { firstName: { contains: query.search, mode: 'insensitive' } },
          { lastName: { contains: query.search, mode: 'insensitive' } },
          { email: { contains: query.search, mode: 'insensitive' } },
          { company: { contains: query.search, mode: 'insensitive' } },
        ],
      }
    : {}),
});

export const leadService = {
  async list(query) {
    const { page, limit, skip, take } = getPagination(query);
    const where = buildWhere(query);

    const [items, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: leadInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.lead.count({ where }),
    ]);

    return {
      items,
      meta: getPaginationMeta(total, page, limit),
    };
  },

  async create(payload, actor) {
    return prisma.lead.create({
      data: removeUndefined({
        ...payload,
        assignedToId: payload.assignedToId ?? actor.id,
        createdById: actor.id,
        convertedAt: payload.status === 'CONVERTED' ? new Date() : undefined,
      }),
      include: leadInclude,
    });
  },

  async getById(id) {
    const lead = await prisma.lead.findFirst({
      where: { id, deletedAt: null },
      include: leadInclude,
    });

    if (!lead) {
      throw new ApiError(404, 'Lead was not found.');
    }

    return lead;
  },

  async update(id, payload) {
    await this.getById(id);

    return prisma.lead.update({
      where: { id },
      data: removeUndefined({
        ...payload,
        convertedAt: payload.status === 'CONVERTED' ? new Date() : undefined,
      }),
      include: leadInclude,
    });
  },

  async updateStatus(id, status) {
    await this.getById(id);

    return prisma.lead.update({
      where: { id },
      data: {
        status,
        convertedAt: status === 'CONVERTED' ? new Date() : null,
      },
      include: leadInclude,
    });
  },

  async remove(id) {
    await this.getById(id);

    return prisma.lead.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: leadInclude,
    });
  },
};
