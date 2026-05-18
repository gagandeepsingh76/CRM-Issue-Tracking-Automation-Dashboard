import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { removeUndefined } from '../utils/cleanData.js';
import { getPagination, getPaginationMeta } from '../utils/pagination.js';

const dealInclude = {
  customer: {
    select: { id: true, name: true, company: true, email: true },
  },
  lead: {
    select: { id: true, firstName: true, lastName: true, email: true },
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
  ...(query.stage ? { stage: query.stage } : {}),
  ...(query.assignedToId ? { assignedToId: query.assignedToId } : {}),
  ...(query.customerId ? { customerId: query.customerId } : {}),
  ...(query.search
    ? {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' } },
          { customer: { name: { contains: query.search, mode: 'insensitive' } } },
        ],
      }
    : {}),
});

const closedAtForStage = (stage) => {
  if (stage === 'WON' || stage === 'LOST') {
    return new Date();
  }

  return null;
};

export const dealService = {
  async list(query) {
    const { page, limit, skip, take } = getPagination(query);
    const where = buildWhere(query);

    const [items, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        include: dealInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.deal.count({ where }),
    ]);

    return {
      items,
      meta: getPaginationMeta(total, page, limit),
    };
  },

  async create(payload, actor) {
    return prisma.deal.create({
      data: removeUndefined({
        ...payload,
        assignedToId: payload.assignedToId ?? actor.id,
        createdById: actor.id,
        closedAt: closedAtForStage(payload.stage),
      }),
      include: dealInclude,
    });
  },

  async getById(id) {
    const deal = await prisma.deal.findFirst({
      where: { id, deletedAt: null },
      include: dealInclude,
    });

    if (!deal) {
      throw new ApiError(404, 'Deal was not found.');
    }

    return deal;
  },

  async update(id, payload) {
    await this.getById(id);

    return prisma.deal.update({
      where: { id },
      data: removeUndefined({
        ...payload,
        closedAt: payload.stage ? closedAtForStage(payload.stage) : undefined,
      }),
      include: dealInclude,
    });
  },

  async updateStage(id, payload) {
    await this.getById(id);

    return prisma.deal.update({
      where: { id },
      data: removeUndefined({
        stage: payload.stage,
        probability: payload.probability,
        closedAt: closedAtForStage(payload.stage),
      }),
      include: dealInclude,
    });
  },

  async pipeline() {
    const rows = await prisma.deal.groupBy({
      by: ['stage'],
      where: { deletedAt: null },
      _count: { _all: true },
      _sum: { value: true },
      orderBy: { stage: 'asc' },
    });

    return rows.map((row) => ({
      stage: row.stage,
      count: row._count._all,
      value: row._sum.value ?? 0,
    }));
  },

  async remove(id) {
    await this.getById(id);

    return prisma.deal.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: dealInclude,
    });
  },
};
