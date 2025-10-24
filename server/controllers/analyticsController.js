import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

/**
 * @desc    Get all analytics data for a logged-in shopkeeper
 * @route   GET /api/analytics
 * @access  Private/Shopkeeper
 */
export const getAnalytics = async (req, res) => {
    try {
        const shopkeeperId = req.user.id;

        // 1. Get IDs of all products belonging to this shopkeeper
        const shopProducts = await Product.find({ user: shopkeeperId }).select('_id');
        const productIds = shopProducts.map(p => p._id);

        // 2. Get all orders that contain this shopkeeper's products
        const shopOrders = await Order.find({ 'orderItems.product': { $in: productIds } });

        // --- Calculate Core Stats ---
        const totalOrders = shopOrders.length;
        let totalRevenue = 0;
        shopOrders.forEach(order => {
            order.orderItems.forEach(item => {
                // Check if item.product exists (it might be null if deleted)
                if (item.product && productIds.some(pId => pId.equals(item.product))) {
                    totalRevenue += item.quantity * item.price;
                }
            });
        });

        // --- Monthly Sales Data (Line Chart) ---
        const monthlySalesData = await Order.aggregate([
            { $match: { 'orderItems.product': { $in: productIds }, createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) } } },
            { $group: {
                _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                totalSales: { $sum: "$totalPrice" }
            }},
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
        
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlySales = monthNames.map((month, index) => {
            const monthData = monthlySalesData.find(d => d._id.month === index + 1);
            return { name: month, sales: monthData ? monthData.totalSales : 0 };
        });

        // --- Sales by Category (Pie Chart) ---
        const categorySales = await Product.aggregate([
            { $match: { _id: { $in: productIds } } },
            { $lookup: {
                from: 'orders',
                localField: '_id',
                foreignField: 'orderItems.product',
                as: 'orders'
            }},
            { $unwind: '$orders' },
            { $unwind: '$orders.orderItems' },
            { $match: { 'orders.orderItems.product': { $in: productIds } } }, // Ensure item belongs to shop
            { $group: {
                _id: '$category',
                totalSales: { $sum: { $multiply: ['$orders.orderItems.price', '$orders.orderItems.quantity'] } }
            }}
        ]);

        // --- Top Selling Products ---
        const topProducts = await Product.find({ user: shopkeeperId }).sort({ sold: -1 }).limit(5);

        res.json({
            totalRevenue,
            totalOrders,
            newCustomers: 15, // Placeholder
            salesGrowth: 12.5, // Placeholder
            monthlySales,
            categorySales: categorySales.map(cat => ({ name: cat._id, value: cat.totalSales })),
            topProducts
        });

    } catch (error) {
        console.error("Error fetching analytics data:", error);
        res.status(500).send('Server Error');
    }
};