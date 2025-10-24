import express from 'express';
import { 
    getCustomerDashboard, 
    getAddresses, 
    addAddress 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get stats for the customer profile dashboard
// @route   GET /api/users/dashboard
// @access  Private
router.get('/dashboard', protect, getCustomerDashboard);

// @desc    Get all saved addresses for a user or add a new one
// @route   GET /api/users/addresses & POST /api/users/addresses
// @access  Private
router.route('/addresses')
    .get(protect, getAddresses)
    .post(protect, addAddress);

export default router;