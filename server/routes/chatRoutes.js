import express from 'express';
import { getConversation, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/chat/:otherUserId/:productId
// @desc    Get chat history for a specific product
// @access  Private
router.get('/:otherUserId/:productId', protect, getConversation);


// @route   POST /api/chat/:otherUserId/:productId
// @desc    Send a message (now handled by sockets)
// @access  Private
router.post('/:otherUserId/:productId', protect, sendMessage);


export default router;