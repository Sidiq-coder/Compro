import express from 'express';
import * as dashboardController from '../controllers/dashboard.js';
import { authenticate } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/role.js';

const router = express.Router();

// Dashboard routes - hanya untuk admin dan roles tertentu
router.get('/stats', 
  authenticate, 
  requireRole('admin', 'ketua_umum', 'bendahara'), 
  dashboardController.getDashboardStats
);

router.get('/activities', 
  authenticate, 
  requireRole('admin', 'ketua_umum', 'bendahara'), 
  dashboardController.getRecentActivities
);

export default router;
