import express from 'express';
const router = express.Router();
import { 
    registerUser, 
    loginUser, 
    getMe,
    updateUserLocation,
    getShopProfile,
    updateShopProfile
} from '../controllers/authController.js';
import { protect, isShopkeeper } from '../middleware/authMiddleware.js';

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/auth/me
// @desc    Get current logged-in user's profile
// @access  Private
router.get('/me', protect, getMe);

// @route   PUT /api/auth/updatelocation
// @desc    Update a shopkeeper's location
// @access  Private/Shopkeeper
router.put('/updatelocation', protect, isShopkeeper, updateUserLocation);

// @route   GET & PUT /api/auth/shopprofile
// @desc    Get or Update a shopkeeper's profile details
// @access  Private/Shopkeeper
router.route('/shopprofile')
    .get(protect, isShopkeeper, getShopProfile)
    .put(protect, isShopkeeper, updateShopProfile);

export default router;