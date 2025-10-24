import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { protect, isShopkeeper } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/analytics
// @desc    Get all analytics data for a shopkeeper's dashboard
// @access  Private/Shopkeeper
router.get('/', protect, isShopkeeper, getAnalytics);

export default router;