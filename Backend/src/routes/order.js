import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/role.js';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStats
} from '../controllers/order.js';

const router = express.Router();

// Public routes
router.post('/', createOrder); // Create new order (public - for customers)

// Protected routes - require authentication
router.get('/', 
  authenticate, 
  requireRole('admin', 'ketua_umum', 'ketua_departemen', 'bendahara'),
  getOrders
); // Get all orders

router.get('/stats', 
  authenticate, 
  requireRole('admin', 'ketua_umum', 'bendahara'),
  getOrderStats
); // Get order statistics

router.get('/:id', 
  authenticate, 
  requireRole('admin', 'ketua_umum', 'ketua_departemen', 'bendahara'),
  getOrderById
); // Get single order by ID

router.put('/:id/status', 
  authenticate, 
  requireRole('admin', 'ketua_umum', 'bendahara'),
  updateOrderStatus
); // Update order status

router.delete('/:id', 
  authenticate, 
  requireRole('admin', 'ketua_umum'),
  deleteOrder
); // Delete order

export default router;
