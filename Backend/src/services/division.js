import { prisma } from "../prisma/client.js";

export const DivisionService = {
  async getAll() {
    try {
      return await prisma.division.findMany({
        include: { 
          department: {
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
              users: true
            }
          }
        },
        orderBy: { name: 'asc' }
      });
    } catch (error) {
      throw new Error(`Gagal mengambil data divisi: ${error.message}`);
    }
  },

  async getById(id) {
    try {
      const division = await prisma.division.findUnique({
        where: { id: Number(id) },
        include: { 
          department: {
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
              users: true
            }
          }
        }
      });

      if (!division) {
        throw new Error('Divisi tidak ditemukan');
      }

      return division;
    } catch (error) {
      throw new Error(`Gagal mengambil divisi: ${error.message}`);
    }
  },

  async create(data) {
    try {
      // Validasi departemen exists
      if (data.departmentId) {
        const department = await prisma.department.findUnique({
          where: { id: Number(data.departmentId) }
        });
        
        if (!department) {
          throw new Error('Departemen tidak ditemukan');
        }
      }

      return await prisma.division.create({ 
        data: {
          ...data,
          departmentId: data.departmentId ? Number(data.departmentId) : null,
          createdAt: new Date()
        },
        include: {
          department: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              users: true
            }
          }
        }
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Nama divisi sudah ada');
      }
      if (error.code === 'P2003') {
        throw new Error('Departemen tidak valid');
      }
      throw new Error(`Gagal membuat divisi: ${error.message}`);
    }
  },

  async update(id, data) {
    try {
      // Validasi departemen exists jika sedang diubah
      if (data.departmentId) {
        const department = await prisma.department.findUnique({
          where: { id: Number(data.departmentId) }
        });
        
        if (!department) {
          throw new Error('Departemen tidak ditemukan');
        }
      }

      return await prisma.division.update({
        where: { id: Number(id) },
        data: {
          ...data,
          departmentId: data.departmentId ? Number(data.departmentId) : undefined,
          updatedAt: new Date()
        },
        include: {
          department: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              users: true
            }
          }
        }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Divisi tidak ditemukan');
      }
      if (error.code === 'P2002') {
        throw new Error('Nama divisi sudah ada');
      }
      if (error.code === 'P2003') {
        throw new Error('Departemen tidak valid');
      }
      throw new Error(`Gagal mengupdate divisi: ${error.message}`);
    }
  },

  async remove(id, currentUser = null) {
    try {
      // Cek apakah divisi masih memiliki user
      const division = await prisma.division.findUnique({
        where: { id: Number(id) },
        include: {
          _count: {
            select: {
              users: true
            }
          }
        }
      });

      if (!division) {
        throw new Error('Divisi tidak ditemukan');
      }

      if (division._count.users > 0) {
        throw new Error('Tidak dapat menghapus divisi yang masih memiliki user');
      }

      // Log audit trail
      if (currentUser) {
        console.log(`User ${currentUser.name} (${currentUser.role}) menghapus divisi: ${division.name}`);
      }

      return await prisma.division.delete({
        where: { id: Number(id) }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Divisi tidak ditemukan');
      }
      throw new Error(`Gagal menghapus divisi: ${error.message}`);
    }
  },
};
