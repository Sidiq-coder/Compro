import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/role.js';
import {
  getFinancialSummary,
  getRevenueAnalytics,
  getTopProducts,
  getExpenseSummary,
  getFinancialTransactions
} from '../controllers/finance.js';

const router = express.Router();

// All finance routes require authentication and specific roles
// Only admin, ketua_umum, and bendahara can access financial data

router.get('/summary', 
  authenticate, 
  requireRole('admin', 'ketua_umum', 'bendahara'),
  getFinancialSummary
); // Get financial summary

router.get('/analytics/revenue', 
  authenticate, 
  requireRole('admin', 'ketua_umum', 'bendahara'),
  getRevenueAnalytics
); // Get revenue analytics

router.get('/products/top', 
  authenticate, 
  requireRole('admin', 'ketua_umum', 'bendahara'),
  getTopProducts
); // Get top performing products

router.get('/expenses/summary', 
  authenticate, 
  requireRole('admin', 'ketua_umum', 'bendahara'),
  getExpenseSummary
); // Get expense summary

router.get('/transactions', 
  authenticate, 
  requireRole('admin', 'ketua_umum', 'bendahara'),
  getFinancialTransactions
); // Get financial transactions

export default router;
