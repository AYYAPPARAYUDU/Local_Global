import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Conversation from '../models/Conversation.js';
import mongoose from 'mongoose';

/**
 * @desc    Get all dashboard statistics for a logged-in shopkeeper
 * @route   GET /api/dashboard/stats
 * @access  Private/Shopkeeper
 */
export const getDashboardStats = async (req, res) => {
    try {
        const shopkeeperId = req.user.id;

        // --- Core Stats Calculation ---
        const shopProducts = await Product.find({ user: shopkeeperId });
        const productIds = shopProducts.map(p => p._id);
        const totalProducts = shopProducts.length;

        // We now populate the user details for the recent orders list
        const shopOrders = await Order.find({ 'orderItems.product': { $in: productIds } }).populate('user', 'name email').sort({ createdAt: -1 });
        
        const totalOrders = shopOrders.length;
        
        let totalRevenue = 0;
        shopOrders.forEach(order => {
            order.orderItems.forEach(item => {
                // Ensure the item.product exists before trying to check it
                if (item.product && productIds.some(pId => pId.equals(item.product))) {
                    totalRevenue += item.quantity * item.price;
                }
            });
        });

        // --- Low Stock Products ---
        const lowStockProducts = shopProducts.filter(p => p.stock <= 10).sort((a,b) => a.stock - b.stock).slice(0, 5);

        // --- Recent Unread Messages ---
        const conversations = await Conversation.find({ users: shopkeeperId })
            .populate('users', 'name')
            .populate('product', 'name image price') // Populate product details
            .sort({ updatedAt: -1 })
            .limit(5);

        let unreadMessagesCount = 0;
        const recentMessages = [];
        conversations.forEach(convo => {
            if (convo.messages.length > 0) {
                const lastMessage = convo.messages[convo.messages.length - 1];
                if (lastMessage && !lastMessage.sender.equals(shopkeeperId) && !lastMessage.isRead) {
                    unreadMessagesCount++;
                    const customer = convo.users.find(user => user && !user._id.equals(shopkeeperId));
                    if (customer) {
                        recentMessages.push({
                            _id: lastMessage._id,
                            customer: { _id: customer._id, name: customer.name },
                            text: lastMessage.text,
                            isRead: lastMessage.isRead,
                            product: convo.product // Pass full product context
                        });
                    }
                }
            }
        });
        
        // --- Real Sales Chart Data Calculation ---
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        const salesData = await Order.aggregate([
            { $match: { createdAt: { $gte: last7Days }, 'orderItems.product': { $in: productIds } } },
            { $unwind: '$orderItems' },
            { $match: { 'orderItems.product': { $in: productIds } } },
            {
                $group: {
                    _id: { $dayOfWeek: { date: "$createdAt", timezone: "Asia/Kolkata" } },
                    totalSales: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] } }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const salesChartData = daysOfWeek.map((day, index) => {
            const dayData = salesData.find(d => d._id === index + 1);
            return { name: day, sales: dayData ? dayData.totalSales : 0 };
        });
        
        res.json({
            totalRevenue,
            totalOrders,
            totalProducts,
            unreadMessages: unreadMessagesCount,
            salesChartData,
            recentOrders: shopOrders.slice(0, 4), // Now contains user data
            lowStockProducts,
            recentMessages
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).send('Server Error');
    }
};