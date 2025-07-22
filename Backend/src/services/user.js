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

    // Validasi departement exists jika ada
    if (data.departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: parseInt(data.departmentId) }
      });
      
      if (!department) {
        throw new Error('Departemen tidak ditemukan');
      }
    }

    // Validasi division exists jika ada
    if (data.divisionId) {
      const division = await prisma.division.findUnique({
        where: { id: parseInt(data.divisionId) }
      });
      
      if (!division) {
        throw new Error('Divisi tidak ditemukan');
      }
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
    if (error.code === 'P2003') {
      throw new Error('Department atau Division yang direferensikan tidak ditemukan');
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

    // Validasi departement exists jika sedang diubah
    if (data.departmentId !== undefined && data.departmentId !== null) {
      const department = await prisma.department.findUnique({
        where: { id: parseInt(data.departmentId) }
      });
      
      if (!department) {
        throw new Error('Departemen tidak ditemukan');
      }
    }

    // Validasi division exists jika sedang diubah
    if (data.divisionId !== undefined && data.divisionId !== null) {
      const division = await prisma.division.findUnique({
        where: { id: parseInt(data.divisionId) }
      });
      
      if (!division) {
        throw new Error('Divisi tidak ditemukan');
      }
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
    if (error.code === 'P2003') {
      throw new Error('Department atau Division yang direferensikan tidak ditemukan');
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