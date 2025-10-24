import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * @desc    Middleware to protect routes by verifying JWT token
 */
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Get token from header
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Get the user from the database using the ID in the token
            req.user = await User.findById(decoded.user.id).select('-password');

            next(); // Proceed to the next middleware or controller
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({ msg: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ msg: 'Not authorized, no token' });
    }
};

/**
 * @desc    Middleware to authorize only shopkeeper roles
 */
export const isShopkeeper = (req, res, next) => {
    if (req.user && req.user.role === 'shopkeeper') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Shopkeeper role required.' });
    }
};