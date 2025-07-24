import { articleService } from '../services/article.js';
import { validationResult } from 'express-validator';
import { prisma } from '../prisma/client.js';
import fs from 'fs';

export const articleController = {
  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Pastikan user sudah authenticated
      if (!req.user || !req.user.id) {
        return res.status(401).json({ 
          status: 'error',
          message: 'User tidak terautentikasi' 
        });
      }

      const { title, content, externalLink, status } = req.body;
      const authorId = req.user.id; 

      const thumbnailUrl = req.files?.thumbnail?.[0]?.path;
      const attachmentUrl = req.files?.attachment?.[0]?.path;

      const article = await articleService.create({
        title,
        content,
        externalLink,
        status,
        authorId,
        thumbnailUrl,
        attachmentUrl
      });

      res.status(201).json({ message: 'Artikel berhasil dibuat', article });
    } catch (err) {
      next(err);
    }
  },

  async findAll(req, res, next) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const result = await articleService.findAll({ page, limit, search });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async findOne(req, res, next) {
    try {
      const { id } = req.params;
      const article = await articleService.findOne(id);
      if (!article) return res.status(404).json({ message: 'Artikel tidak ditemukan' });
      res.json(article);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      if (req.files?.thumbnail) data.thumbnailUrl = req.files.thumbnail[0].path;
      if (req.files?.attachment) data.attachmentUrl = req.files.attachment[0].path;

      const updated = await articleService.update(id, data);
      res.json({ message: 'Artikel diperbarui', updated });
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await articleService.remove(id);
      res.json({ message: 'Artikel dihapus', deleted });
    } catch (err) {
      next(err);
    }
  },

  // Mendapatkan departemen yang diizinkan mengelola artikel
  async getAuthorizedDepartments(req, res, next) {
    try {
      const authorizedDepartments = await prisma.articlePermission.findMany({
        include: {
          department: {
            select: {
              id: true,
              name: true,
              _count: {
                select: {
                  users: true
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        data: authorizedDepartments.map(ap => ap.department),
        message: 'Berhasil mendapatkan departemen yang diotorisasi'
      });
    } catch (err) {
      next(err);
    }
  },

  // Update departemen yang diizinkan mengelola artikel (hanya admin/ketua umum)
  async updateAuthorizedDepartments(req, res, next) {
    try {
      const { departmentIds } = req.body;

      if (!Array.isArray(departmentIds)) {
        return res.status(400).json({
          success: false,
          message: 'departmentIds harus berupa array'
        });
      }

      // Validasi bahwa departemen yang diinput benar-benar ada
      const existingDepartments = await prisma.department.findMany({
        where: {
          id: {
            in: departmentIds
          }
        }
      });

      if (existingDepartments.length !== departmentIds.length) {
        const existingIds = existingDepartments.map(d => d.id);
        const notFound = departmentIds.filter(id => !existingIds.includes(id));
        
        return res.status(400).json({
          success: false,
          message: `Departemen dengan ID tidak ditemukan: ${notFound.join(', ')}`
        });
      }

      // Hapus semua permission yang ada
      await prisma.articlePermission.deleteMany({});

      // Tambah permission baru
      if (departmentIds.length > 0) {
        await prisma.articlePermission.createMany({
          data: departmentIds.map(departmentId => ({
            departmentId: departmentId
          }))
        });
      }

      // Ambil data terbaru untuk response
      const newAuthorizedDepartments = await prisma.articlePermission.findMany({
        include: {
          department: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      res.json({
        success: true,
        data: newAuthorizedDepartments.map(ap => ap.department),
        message: 'Konfigurasi departemen berhasil diupdate'
      });
    } catch (err) {
      next(err);
    }
  },

  // Cek izin user untuk mengelola artikel
  async checkArticlePermission(req, res, next) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User tidak terautentikasi'
        });
      }

      // Admin dan Ketua Umum selalu bisa
      if (user.role === 'admin' || user.role === 'ketua_umum') {
        return res.json({
          success: true,
          data: {
            canManageArticle: true,
            reason: `User memiliki role ${user.role}`
          }
        });
      }

      // Cek departemen user
      const userWithDepartment = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          department: true
        }
      });

      if (!userWithDepartment || !userWithDepartment.department) {
        return res.json({
          success: true,
          data: {
            canManageArticle: false,
            reason: 'User tidak terdaftar di departemen manapun'
          }
        });
      }

      // Cek apakah departemen user diotorisasi
      const authorizedDepartment = await prisma.articlePermission.findUnique({
        where: {
          departmentId: userWithDepartment.department.id
        }
      });

      res.json({
        success: true,
        data: {
          canManageArticle: !!authorizedDepartment,
          userDepartment: userWithDepartment.department.name,
          reason: authorizedDepartment 
            ? `User adalah ${user.role} dari departemen ${userWithDepartment.department.name} yang diotorisasi`
            : `Departemen ${userWithDepartment.department.name} tidak diotorisasi mengelola artikel`
        }
      });

    } catch (err) {
      next(err);
    }
  }
};