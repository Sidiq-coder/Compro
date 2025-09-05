import { articleService } from '../services/article.js';
import { validationResult } from 'express-validator';
import { prisma } from '../prisma/client.js';
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      res.json({
        success: true,
        data: result.data || result,
        total: result.total || 0,
        message: 'Articles retrieved successfully'
      });
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
  },

  // Upload image untuk Editor.js
  async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: 0,
          error: 'No file uploaded'
        });
      }

      const file = req.file;
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const imageUrl = `${baseUrl}/uploads/${file.filename}`;

      res.json({
        success: 1,
        data: {
          url: imageUrl
        }
      });
    } catch (error) {
      console.error('Image upload error:', error);
      res.status(500).json({
        success: 0,
        error: 'Failed to upload image'
      });
    }
  },

  // Fetch URL untuk Link Tool di Editor.js
  async fetchUrl(req, res, next) {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({
          success: 0,
          error: 'URL is required'
        });
      }

      try {
        const response = await fetch(url);
        const html = await response.text();

        // Extract title dari HTML
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : 'No title';

        // Extract description dari meta tag
        const descriptionMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) ||
                                html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i);
        const description = descriptionMatch ? descriptionMatch[1].trim() : '';

        // Extract image dari meta tag
        const imageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i) ||
                          html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"[^>]*>/i);
        const image = imageMatch ? imageMatch[1].trim() : '';

        res.json({
          success: 1,
          link: url,
          meta: {
            title,
            description,
            image: {
              url: image
            }
          }
        });
      } catch (fetchError) {
        console.error('Error fetching URL:', fetchError);
        res.json({
          success: 1,
          link: url,
          meta: {
            title: url,
            description: '',
            image: {
              url: ''
            }
          }
        });
      }
    } catch (error) {
      console.error('Fetch URL error:', error);
      res.status(500).json({
        success: 0,
        error: 'Failed to fetch URL'
      });
    }
  },

  // Get article statistics
  async getStats(req, res) {
    try {
      const [
        totalArticles,
        publishedArticles,
        draftArticles,
        recentArticles,
        articlesByCategory,
        popularArticles
      ] = await Promise.all([
        // Total articles
        prisma.article.count(),
        
        // Published articles
        prisma.article.count({
          where: { status: 'published' }
        }),
        
        // Draft articles
        prisma.article.count({
          where: { status: 'draft' }
        }),
        
        // Recent articles (last 7 days)
        prisma.article.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        }),
        
        // Articles by category (if category field exists)
        prisma.article.groupBy({
          by: ['category'],
          _count: {
            category: true
          },
          where: {
            category: {
              not: null
            }
          }
        }).catch(() => []), // Ignore error if category field doesn't exist
        
        // Most viewed articles (if views field exists)
        prisma.article.findMany({
          take: 5,
          orderBy: {
            createdAt: 'desc' // Use createdAt since views field might not exist
          },
          select: {
            id: true,
            title: true,
            createdAt: true,
            status: true
          }
        })
      ]);

      // Format categories
      const categories = articlesByCategory.reduce((acc, curr) => {
        acc[curr.category] = curr._count.category;
        return acc;
      }, {});

      // Calculate growth percentage (mock calculation)
      const growthPercentage = recentArticles > 0 ? Math.round((recentArticles / totalArticles) * 100) : 0;

      const stats = {
        totalArticles,
        publishedArticles,
        draftArticles,
        recentArticles,
        growthPercentage: `+${growthPercentage}%`,
        categories,
        popularArticles,
        stats: {
          total: totalArticles,
          published: publishedArticles,
          draft: draftArticles,
          recent: recentArticles
        }
      };

      res.json({
        success: true,
        data: stats,
        message: 'Article statistics berhasil diambil'
      });
    } catch (error) {
      console.error('Error getting article stats:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil statistik artikel',
        error: 'Internal Server Error'
      });
    }
  }
};