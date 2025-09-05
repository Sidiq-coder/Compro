import { prisma } from '../prisma/client.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const userRoles = ['admin', 'ketua_umum', 'ketua_departemen', 'ketua_divisi', 'sekretaris', 'bendahara', 'pengurus', 'anggota'];

// Definisi hirarki role (dari tertinggi ke terendah)
const ROLE_HIERARCHY = {
  admin: 8,
  ketua_umum: 7,
  ketua_departemen: 6,
  ketua_divisi: 5,
  sekretaris: 4,
  bendahara: 3,
  pengurus: 2,
  anggota: 1
};

export const getAllUsers = async (filters = {}, pagination = {}, roleFilter = {}) => {
  try {
    const { page = 1, limit = 10 } = pagination;
    const { departmentId, divisionId, search, role } = filters;

    const whereClause = {
      ...roleFilter, // Tambahkan filter berdasarkan role user yang mengakses
      ...(departmentId && { departmentId: parseInt(departmentId) }),
      ...(divisionId && { divisionId: parseInt(divisionId) }),
      ...(role && { role }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          department: { select: { id: true, name: true } },
          division: { select: { id: true, name: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' }
      }),
      prisma.user.count({ where: whereClause })
    ]);

    return {
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit
      }
    };
  } catch (error) {
    throw new Error(`Gagal mengambil data user: ${error.message}`);
  }
};

export const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: { select: { id: true, name: true } },
        division: { select: { id: true, name: true } },
      },
    });

    if (!user) {
      throw new Error('User tidak ditemukan');
    }
    return user;
  } catch (error) {
    throw new Error(`Gagal mengambil user: ${error.message}`);
  }
};

export const createUser = async (data) => {
  try {
    // Validasi role yang akan dibuat
    if (!userRoles.includes(data.role)) {
      throw new Error('Role tidak valid');
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    
    // Buat userData hanya dengan field yang ada di schema
    const userData = { 
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      ...(data.departmentId && { departmentId: parseInt(data.departmentId) }),
      ...(data.divisionId && { divisionId: parseInt(data.divisionId) })
    };
    
    const user = await prisma.user.create({ 
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: { select: { id: true, name: true } },
        division: { select: { id: true, name: true } }
      }
    });
    
    return user;
  } catch (error) {
    if (error.code === 'P2002') {
      throw new Error('Email sudah terdaftar');
    }
    throw new Error(`Gagal membuat user: ${error.message}`);
  }
};

export const updateUser = async (id, data, currentUser = null) => {
  try {
    // Validasi role jika sedang diubah
    if (data.role && !userRoles.includes(data.role)) {
      throw new Error('Role tidak valid');
    }

    // Hash password if it's being updated
    if (data.password) {
      data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    // Buat updateData hanya dengan field yang ada di schema
    const updateData = {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.password && { password: data.password }),
      ...(data.role && { role: data.role }),
      ...(data.departmentId !== undefined && { departmentId: data.departmentId ? parseInt(data.departmentId) : null }),
      ...(data.divisionId !== undefined && { divisionId: data.divisionId ? parseInt(data.divisionId) : null })
    };

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: { select: { id: true, name: true } },
        division: { select: { id: true, name: true } }
      }
    });
    
    return user;
  } catch (error) {
    if (error.code === 'P2025') {
      throw new Error('User tidak ditemukan');
    }
    if (error.code === 'P2002') {
      throw new Error('Email sudah terdaftar');
    }
    throw new Error(`Gagal mengupdate user: ${error.message}`);
  }
};

export const deleteUser = async (id, currentUser = null) => {
  try {
    // Log siapa yang menghapus untuk audit trail
    if (currentUser) {
      console.log(`User ${currentUser.name} (${currentUser.role}) menghapus user dengan ID: ${id}`);
    }

    return await prisma.user.delete({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw new Error('User tidak ditemukan');
    }
    throw new Error(`Gagal menghapus user: ${error.message}`);
  }
};

// Helper function for authentication
export const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Helper function untuk validasi otorisasi berdasarkan hirarki
export const canManageUserRole = (managerRole, targetRole) => {
  const managerLevel = ROLE_HIERARCHY[managerRole] || 0;
  const targetLevel = ROLE_HIERARCHY[targetRole] || 0;
  
  return managerLevel > targetLevel;
};

// Helper function untuk mendapatkan level role
export const getRoleLevel = (role) => {
  return ROLE_HIERARCHY[role] || 0;
};

// Helper function untuk mendapatkan daftar role yang bisa dikelola
export const getManageableRoles = (managerRole) => {
  const managerLevel = ROLE_HIERARCHY[managerRole] || 0;
  
  return userRoles.filter(role => {
    const roleLevel = ROLE_HIERARCHY[role] || 0;
    return roleLevel < managerLevel;
  });
};

export const getUserStats = async () => {
  try {
    // First get basic counts
    const totalUsers = await prisma.user.count();
    
    // Active users (users who logged in within last 30 days)
    const activeUsers = await prisma.user.count({
      where: {
        lastLoginAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    });

    // Simple approach for recent users - get users with highest IDs as proxy
    const maxUser = await prisma.user.findFirst({
      select: { id: true },
      orderBy: { id: 'desc' }
    });

    const recentUsers = maxUser ? await prisma.user.count({
      where: {
        id: {
          gt: Math.max(1, maxUser.id - 10) // Last 10 users created
        }
      }
    }) : 0;

    // Users by department
    const usersByDepartment = await prisma.user.groupBy({
      by: ['departmentId'],
      _count: {
        departmentId: true
      },
      where: {
        departmentId: {
          not: null
        }
      }
    });

    // Format users by role
    const roleStats = usersByRole.reduce((acc, curr) => {
      acc[curr.role] = curr._count.role;
      return acc;
    }, {});

    // Calculate growth percentage (mock calculation)
    const growthPercentage = totalUsers > 0 ? Math.round((recentUsers / totalUsers) * 100) : 0;

    const result = {
      totalUsers,
      activeUsers,
      recentUsers,
      adminUsers: roleStats.admin || 0,
      growthPercentage: `+${growthPercentage}%`,
      usersByRole: roleStats,
      usersByDepartment: usersByDepartment.length,
      stats: {
        admin: roleStats.admin || 0,
        ketua_umum: roleStats.ketua_umum || 0,
        ketua_departemen: roleStats.ketua_departemen || 0,
        ketua_divisi: roleStats.ketua_divisi || 0,
        sekretaris: roleStats.sekretaris || 0,
        bendahara: roleStats.bendahara || 0,
        pengurus: roleStats.pengurus || 0,
        anggota: roleStats.anggota || 0
      }
    };
    
    return result;
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw new Error(`Gagal mengambil statistik user: ${error.message}`);
  }
};