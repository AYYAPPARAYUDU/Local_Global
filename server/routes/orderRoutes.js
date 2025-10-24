import express from 'express';
import {
    createOrder,
    getMyOrders,
    getShopOrders,
    updateOrderStatus,
    cancelOrder // 1. Import the new function
} from '../controllers/orderController.js';
import { protect, isShopkeeper } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Customer Routes ---
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);

// --- NEW CUSTOMER ROUTE ---
// @route   PUT /api/orders/:id/cancel
// @desc    Allow a customer to cancel their own order
// @access  Private
router.put('/:id/cancel', protect, cancelOrder); // 2. Add the new route

// --- Shopkeeper Routes ---
router.get('/shop', protect, isShopkeeper, getShopOrders);
router.put('/:id/status', protect, isShopkeeper, updateOrderStatus);

export default router;