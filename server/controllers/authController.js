import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * @desc    Register a new user (customer or shopkeeper)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
    const { name, email, password, role, shopName, address, phone, upiId, latitude, longitude } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        user = await User.create({
            name, email, password, role, shopName, address, phone, upiId,
            location: (role === 'shopkeeper' && latitude && longitude) ? { type: 'Point', coordinates: [longitude, latitude] } : undefined
        });

        const payload = { user: { id: user.id, name: user.name, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id, name: user.name, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

/**
 * @desc    Get logged-in user's profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    Update shopkeeper's location
 * @route   PUT /api/auth/updatelocation
 * @access  Private/Shopkeeper
 */
export const updateUserLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ msg: 'Latitude and longitude are required' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.location = {
            type: 'Point',
            coordinates: [longitude, latitude] // GeoJSON format: [longitude, latitude]
        };

        await user.save();
        res.json({ success: true, msg: 'Location updated successfully' });

    } catch (err) {
        console.error("Location update failed:", err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    Get a shopkeeper's full profile for settings page
 * @route   GET /api/auth/shopprofile
 * @access  Private/Shopkeeper
 */
export const getShopProfile = async (req, res) => {
    try {
        const shopkeeper = await User.findById(req.user.id);
        if (!shopkeeper || shopkeeper.role !== 'shopkeeper') {
            return res.status(404).json({ msg: 'Shopkeeper profile not found' });
        }
        res.json(shopkeeper);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    Update a shopkeeper's profile details
 * @route   PUT /api/auth/shopprofile
 * @access  Private/Shopkeeper
 */
export const updateShopProfile = async (req, res) => {
    try {
        const { shopName, email, phone, description, returnPolicy, upiId } = req.body;
        const updatedProfile = await User.findByIdAndUpdate(
            req.user.id,
            { shopName, email, phone, description, returnPolicy, upiId },
            { new: true, runValidators: true }
        );
        res.json(updatedProfile);
    } catch (err) {
        console.error("Profile update failed:", err);
        res.status(500).send('Server Error');
    }
};