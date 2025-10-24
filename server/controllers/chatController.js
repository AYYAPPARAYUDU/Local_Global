import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

/**
 * @desc    Get conversation between two users for a specific product
 * @route   GET /api/chat/:otherUserId/:productId
 * @access  Private
 */
export const getConversation = async (req, res) => {
    try {
        const { otherUserId, productId } = req.params;
        
        // Find a conversation that includes both users AND the specific product
        const conversation = await Conversation.findOne({
            users: { $all: [req.user.id, otherUserId] },
            product: productId
        })
        .populate('users', 'name')
        .populate('product', 'name image price');

        res.json(conversation);
    } catch (err) {
        console.error("Error getting conversation:", err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    Send a message (This is now handled by sockets)
 * @route   POST /api/chat/:otherUserId/:productId
 * @access  Private
 */
export const sendMessage = async (req, res) => {
    // Note: The primary way to send messages is now through Socket.IO for real-time updates.
    // This API endpoint is deprecated.
    res.status(400).json({ msg: 'This route is deprecated. Please use sockets for sending messages.' });
};