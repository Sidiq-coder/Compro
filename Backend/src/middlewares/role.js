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

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'Akses ditolak: Anda tidak memiliki izin',
        error: 'Forbidden'
      });
    }
    next();
  };
};

export const requireMinimumRole = (minimumRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Login diperlukan',
        error: 'Unauthorized'
      });
    }

    const userRoleLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const minimumRoleLevel = ROLE_HIERARCHY[minimumRole] || 0;

    if (userRoleLevel < minimumRoleLevel) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak: Level otorisasi tidak mencukupi',
        error: 'Forbidden'
      });
    }

    next();
  };
};

export const roleBasedFilter = (req, res, next) => {
  if (!req.user) return next();
  
  // Filter berdasarkan hirarki role
  const userRoleLevel = ROLE_HIERARCHY[req.user.role] || 0;
  const permittedRoles = getPermittedRoles(req.user.role, userRoleLevel);
  
  if (permittedRoles.length > 0) {
    req.roleFilter = { 
      role: {
        in: permittedRoles
      }
    };
  }
  
  next();
};

// Middleware untuk validasi otorisasi CRUD berdasarkan target user
export const canManageUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Login diperlukan',
        error: 'Unauthorized'
      });
    }

    // Jika sedang create user, validasi role yang akan dibuat
    if (req.method === 'POST' && req.validatedBody?.role) {
      const targetRoleLevel = ROLE_HIERARCHY[req.validatedBody.role] || 0;
      const userRoleLevel = ROLE_HIERARCHY[req.user.role] || 0;

      if (userRoleLevel <= targetRoleLevel) {
        return res.status(403).json({
          success: false,
          message: 'Akses ditolak: Tidak dapat membuat user dengan role yang sama atau lebih tinggi',
          error: 'Forbidden'
        });
      }
    }

    // Jika sedang update/delete user, validasi target user
    if ((req.method === 'PUT' || req.method === 'DELETE') && req.params.id) {
      const { prisma } = await import('../prisma/client.js');
      const targetUser = await prisma.user.findUnique({
        where: { id: parseInt(req.params.id) },
        select: { role: true, id: true }
      });

      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan',
          error: 'Not Found'
        });
      }

      // User tidak boleh mengedit/hapus dirinya sendiri
      if (targetUser.id === req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Akses ditolak: Tidak dapat mengedit/menghapus akun sendiri',
          error: 'Forbidden'
        });
      }

      const targetRoleLevel = ROLE_HIERARCHY[targetUser.role] || 0;
      const userRoleLevel = ROLE_HIERARCHY[req.user.role] || 0;

      if (userRoleLevel <= targetRoleLevel) {
        return res.status(403).json({
          success: false,
          message: 'Akses ditolak: Tidak dapat mengedit/menghapus user dengan role yang sama atau lebih tinggi',
          error: 'Forbidden'
        });
      }

      // Jika update, validasi role yang akan diubah
      if (req.method === 'PUT' && req.validatedBody?.role) {
        const newTargetRoleLevel = ROLE_HIERARCHY[req.validatedBody.role] || 0;
        
        if (userRoleLevel <= newTargetRoleLevel) {
          return res.status(403).json({
            success: false,
            message: 'Akses ditolak: Tidak dapat mengubah ke role yang sama atau lebih tinggi',
            error: 'Forbidden'
          });
        }
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat validasi otorisasi',
      error: 'Internal Server Error'
    });
  }
};

// Helper function untuk menentukan role yang boleh diakses berdasarkan hirarki
const getPermittedRoles = (userRole, userRoleLevel) => {
  const allRoles = Object.keys(ROLE_HIERARCHY);
  
  // User hanya bisa melihat role yang levelnya lebih rendah dari mereka
  return allRoles.filter(role => {
    const roleLevel = ROLE_HIERARCHY[role];
    return roleLevel < userRoleLevel;
  });
};

export { ROLE_HIERARCHY };