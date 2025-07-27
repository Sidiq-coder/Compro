import { prisma } from '../prisma/client.js';

export const authorizeEventManagement = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      // Admin and Ketua Umum always have full access
      if (user.role === 'admin' || user.role === 'ketua_umum') {
        return next();
      }

      // Check specific permissions for other roles
      if (requiredPermission === 'create' && user.canCreateEvents) {
        return next();
      }

      // Check event permissions from database
      const eventPermissions = await prisma.eventPermission.findUnique({
        where: { userId: user.id }
      });

      if (eventPermissions) {
        if (
          (requiredPermission === 'validate' && eventPermissions.canValidate) ||
          (requiredPermission === 'manage' && eventPermissions.canManage)
        ) {
          return next();
        }
      }

      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki izin untuk mengakses fitur ini'
      });
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat memverifikasi izin'
      });
    }
  };
};

export const authorizeAttendanceValidation = async (req, res, next) => {
  try {
    const user = req.user;
    const attendanceId = req.params.id;

    // Get attendance with related event and departments
    const attendance = await prisma.attendance.findUnique({
      where: { id: Number(attendanceId) },
      include: {
        event: {
          include: {
            allowedDepartments: true
          }
        },
        user: {
          select: {
            departmentId: true
          }
        }
      }
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Data absensi tidak ditemukan'
      });
    }

    // Admin and Ketua Umum can validate any attendance
    if (user.role === 'admin' || user.role === 'ketua_umum') {
      return next();
    }

    // Department head can validate for their department's internal events
    if (user.role === 'ketua_departemen') {
      if (
        attendance.event.eventType === 'internal' &&
        attendance.event.allowedDepartments.some(
          dept => dept.id === attendance.user.departmentId
        )
      ) {
        return next();
      }
    }

    // Check if user has validation permission
    const eventPermissions = await prisma.eventPermission.findUnique({
      where: { userId: user.id }
    });

    if (eventPermissions?.canValidate) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Anda tidak memiliki izin untuk memvalidasi absensi ini'
    });
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memverifikasi izin validasi'
    });
  }
};