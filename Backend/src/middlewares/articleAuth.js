// middlewares/articleAuth.js
import { prisma } from '../prisma/client.js';

export const canManageArticle = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User tidak terautentikasi'
      });
    }

    // Admin dan Ketua Umum selalu bisa mengelola artikel
    if (user.role === 'admin' || user.role === 'ketua_umum') {
      return next();
    }

    // Cek apakah user adalah pengurus dari departemen yang diotorisasi
    if (user.role === 'pengurus' || user.role === 'ketua_departemen' || user.role === 'sekretaris' || user.role === 'bendahara') {
      // Ambil data user lengkap dengan departemen
      const userWithDepartment = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          department: true
        }
      });

      if (!userWithDepartment || !userWithDepartment.department) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Anda tidak terdaftar di departemen manapun'
        });
      }

      // Cek apakah departemen user termasuk dalam daftar yang diotorisasi di database
      const authorizedDepartment = await prisma.articlePermission.findUnique({
        where: {
          departmentId: userWithDepartment.department.id
        }
      });

      if (authorizedDepartment) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'Forbidden: Departemen Anda tidak memiliki izin untuk mengelola artikel'
      });
    }

    // Role lain tidak diizinkan
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Anda tidak memiliki izin untuk mengelola artikel'
    });

  } catch (error) {
    console.error('Error in canManageArticle middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Middleware untuk mengecek apakah user bisa mengedit artikel tertentu
export const canEditArticle = async (req, res, next) => {
  try {
    const user = req.user;
    const articleId = req.params.id;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User tidak terautentikasi'
      });
    }

    // Admin dan Ketua Umum bisa edit artikel siapapun
    if (user.role === 'admin' || user.role === 'ketua_umum') {
      return next();
    }

    // Ambil artikel yang akan diedit
    const article = await prisma.article.findUnique({
      where: { id: parseInt(articleId) },
      include: {
        author: {
          include: {
            department: true
          }
        }
      }
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan'
      });
    }

    // Author bisa edit artikel sendiri (jika masih memiliki izin)
    if (article.authorId === user.id) {
      // Cek apakah author masih memiliki izin mengelola artikel
      return canManageArticle(req, res, next);
    }

    // Pengurus dari departemen yang sama dengan author bisa edit
    if (user.role === 'pengurus' || user.role === 'ketua_departemen' || user.role === 'sekretaris' || user.role === 'bendahara') {
      const userWithDepartment = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          department: true
        }
      });

      if (userWithDepartment?.department && 
          article.author?.department && 
          userWithDepartment.department.id === article.author.department.id) {
        
        // Cek apakah departemen ini diotorisasi mengelola artikel di database
        const authorizedDepartment = await prisma.articlePermission.findUnique({
          where: {
            departmentId: userWithDepartment.department.id
          }
        });

        if (authorizedDepartment) {
          return next();
        }
      }
    }

    return res.status(403).json({
      success: false,
      message: 'Forbidden: Anda tidak memiliki izin untuk mengedit artikel ini'
    });

  } catch (error) {
    console.error('Error in canEditArticle middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


