import express from 'express';
import { createPaymentIntent, paymentWebhook } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/payment/create-intent
// @desc    Create a new payment request and get a redirect URL
// @access  Private
router.post('/create-intent', protect, createPaymentIntent);

// @route   POST /api/payment/webhook
// @desc    Webhook for the payment gateway (PhonePe/Paytm) to call
// @access  Public
router.post('/webhook', paymentWebhook);

export default router;