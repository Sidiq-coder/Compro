import { prisma } from '../prisma/client.js';

export const articleService = {
  async create(data) {
    return prisma.article.create({ data });
  },

  async findAll({ page = 1, limit = 10, search = '' }) {
    const skip = (page - 1) * limit;
    const where = search
      ? { title: { contains: search, mode: 'insensitive' } }
      : {};
    const [data, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.article.count({ where })
    ]);
    return { data, total, page: Number(page), limit: Number(limit) };
  },

  async findOne(id) {
    return prisma.article.findUnique({ where: { id: Number(id) } });
  },

  async update(id, data) {
    return prisma.article.update({ where: { id: Number(id) }, data });
  },

  async remove(id) {
    return prisma.article.delete({ where: { id: Number(id) } });
  }
};