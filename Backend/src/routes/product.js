import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/role.js';
import { upload } from '../utils/fileUpload.js';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCategories,
  getProductStats
} from '../controllers/product.js';

const router = express.Router();

// Public routes
router.get('/', getProducts); // Get all products (public)
router.get('/categories', getProductCategories); // Get product categories
router.get('/stats', authenticate, getProductStats); // Get product statistics
router.get('/:id', getProductById); // Get single product by ID (public)

// Protected routes - require authentication
router.post('/', 
  authenticate, 
  requireRole('admin', 'ketua_umum', 'ketua_departemen'),
  upload.single('image'),
  createProduct
); // Create new product

router.put('/:id', 
  authenticate, 
  requireRole('admin', 'ketua_umum', 'ketua_departemen'),
  upload.single('image'),
  updateProduct
); // Update product

router.delete('/:id', 
  authenticate, 
  requireRole('admin', 'ketua_umum'),
  deleteProduct
); // Delete product

export default router;
