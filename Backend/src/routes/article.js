import express from 'express';
import { articleController } from '../controllers/article.js';
import { authenticate } from '../middlewares/auth.js';
import { canManageArticle, canEditArticle } from '../middlewares/articleAuth.js';
import { requireMinimumRole } from '../middlewares/role.js';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Setup multer untuk upload gambar Editor.js
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadImage = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Hanya izinkan gambar
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const upload = multer({ dest: 'uploads/' }); // Simpan lokal sementara untuk file artikel

// Routes untuk manage article permissions (hanya admin/ketua umum)
router.get('/permissions/departments', authenticate, articleController.getAuthorizedDepartments);
router.put('/permissions/departments', 
  authenticate, 
  requireMinimumRole('ketua_umum'), 
  articleController.updateAuthorizedDepartments
);
router.get('/permissions/check', authenticate, articleController.checkArticlePermission);

// Routes untuk artikel
router.post(
  '/',
  authenticate, // Harus login dulu
  canManageArticle, // Cek izin membuat artikel
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'attachment', maxCount: 1 }
  ]),
  body('title').notEmpty().withMessage('Judul wajib diisi'),
  body('content').notEmpty().withMessage('Konten tidak boleh kosong'),
  body('status').isIn(['draft', 'published']).withMessage('Status tidak valid'),
  articleController.create
);

router.get('/', articleController.findAll);
router.get('/:id', articleController.findOne);

router.put(
  '/:id',
  authenticate, // Harus login dulu
  canEditArticle, // Cek izin edit artikel tertentu
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'attachment', maxCount: 1 }
  ]),
  articleController.update
);

router.delete(
  '/:id', 
  authenticate, // Harus login dulu
  canEditArticle, // Cek izin delete artikel tertentu (sama dengan edit)
  articleController.remove
);

// Routes untuk Editor.js
router.post('/upload-image', 
  authenticate,
  canManageArticle,
  uploadImage.single('image'),
  articleController.uploadImage
);

router.post('/fetch-url', 
  authenticate,
  canManageArticle,
  articleController.fetchUrl
);

// Stats route
router.get('/stats', authenticate, articleController.getStats);

export default router;
