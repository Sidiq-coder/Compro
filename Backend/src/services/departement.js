import { prisma } from "../prisma/client.js";

export const DepartmentService = {
  async getAll() {
    try {
      return await prisma.department.findMany({
        include: { 
          divisions: {
            select: {
              id: true,
              name: true
            }
          }, 
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          _count: {
            select: {
              divisions: true,
              users: true
            }
          }
        },
        orderBy: { name: 'asc' }
      });
    } catch (error) {
      throw new Error(`Gagal mengambil data departemen: ${error.message}`);
    }
  },

  async getById(id) {
    try {
      const department = await prisma.department.findUnique({
        where: { id: Number(id) },
        include: { 
          divisions: {
            select: {
              id: true,
              name: true
            }
          }, 
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          _count: {
            select: {
              divisions: true,
              users: true
            }
          }
        }
      });

      if (!department) {
        throw new Error('Departemen tidak ditemukan');
      }

      return department;
    } catch (error) {
      throw new Error(`Gagal mengambil departemen: ${error.message}`);
    }
  },

  async create(data) {
    try {
      return await prisma.department.create({ 
        data: data,
        include: {
          _count: {
            select: {
              divisions: true,
              users: true
            }
          }
        }
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Nama departemen sudah ada');
      }
      throw new Error(`Gagal membuat departemen: ${error.message}`);
    }
  },

  async update(id, data) {
    try {
      return await prisma.department.update({
        where: { id: Number(id) },
        data: data,
        include: {
          divisions: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              divisions: true,
              users: true
            }
          }
        }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Departemen tidak ditemukan');
      }
      if (error.code === 'P2002') {
        throw new Error('Nama departemen sudah ada');
      }
      throw new Error(`Gagal mengupdate departemen: ${error.message}`);
    }
  },

  async remove(id, currentUser = null) {
    try {
      // Cek apakah departemen masih memiliki divisi atau user
      const department = await prisma.department.findUnique({
        where: { id: Number(id) },
        include: {
          _count: {
            select: {
              divisions: true,
              users: true
            }
          }
        }
      });

      if (!department) {
        throw new Error('Departemen tidak ditemukan');
      }

      if (department._count.divisions > 0) {
        throw new Error('Tidak dapat menghapus departemen yang masih memiliki divisi');
      }

      if (department._count.users > 0) {
        throw new Error('Tidak dapat menghapus departemen yang masih memiliki user');
      }

      // Log audit trail
      if (currentUser) {
        console.log(`User ${currentUser.name} (${currentUser.role}) menghapus departemen: ${department.name}`);
      }

      return await prisma.department.delete({
        where: { id: Number(id) }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Departemen tidak ditemukan');
      }
      throw new Error(`Gagal menghapus departemen: ${error.message}`);
    }
  },
};
