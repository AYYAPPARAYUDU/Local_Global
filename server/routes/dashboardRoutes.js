import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect, isShopkeeper } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get stats for the shopkeeper dashboard
// @access  Private/Shopkeeper
router.get('/stats', protect, isShopkeeper, getDashboardStats);

export default router;