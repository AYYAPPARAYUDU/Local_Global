import Order from '../models/Order.js';
import User from '../models/User.js';

/**
 * @desc    Get dashboard statistics for a logged-in customer
 * @route   GET /api/users/dashboard
 * @access  Private
 */
export const getCustomerDashboard = async (req, res) => {
    try {
        const customerId = req.user.id;

        // 1. Find all orders for this customer
        const orders = await Order.find({ user: customerId }).sort({ createdAt: -1 });

        // 2. Calculate stats
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        
        // 3. Determine Loyalty Tier
        let loyaltyTier = 'Bronze';
        if (totalSpent > 50000) loyaltyTier = 'Gold';
        else if (totalSpent > 10000) loyaltyTier = 'Silver';
        
        // 4. Get the 3 most recent orders for the history table
        const recentOrderHistory = orders.slice(0, 3);
        
        res.json({
            totalSpent,
            totalOrders,
            loyaltyTier,
            recentOrderHistory
        });

    } catch (error) {
        console.error("Error fetching customer dashboard:", error);
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    Get a user's saved addresses
 * @route   GET /api/users/addresses
 * @access  Private
 */
export const getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user.savedAddresses);
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    Add a new address for a user
 * @route   POST /api/users/addresses
 * @access  Private
 */
export const addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Add the new address to the array
        user.savedAddresses.push(req.body);
        await user.save();
        
        res.status(201).json(user.savedAddresses);
    } catch (error) {
        console.error("Error adding address:", error);
        res.status(500).send('Server Error');
    }
};